import { useEffect, useRef, useState, type ReactElement } from 'react';
import { Map, MapMarker, type PolylineProps } from 'react-kakao-maps-sdk';
import { requestRoute } from '../api/map';
import marker_restaurant from '@/images/marker/restaurant.png';
import marker_accommodation from '@/images/marker/accommodation.png';
import marker_tour from '@/images/marker/tour.png';
import marker_cafe from '@/images/marker/cafe.png';
import marker_shop from '@/images/marker/shop.png';
import marker_activity from '@/images/marker/activity.png';
import marker_steam from '@/images/marker/steam.png';
import marker_spa from '@/images/marker/spa.png';
import marker_exhibition from '@/images/marker/exhibition.png';

interface Coord {
  lat: number;
  lng: number;
}

interface MapLocation extends Coord {
  lat: number;
  lng: number;
  title?: string;
  infoWindow?: ReactElement;
}

interface Direction extends MapLocation {}
export interface Route {
  start_point: Coord;
  end_point: Coord;
  path: Coord[];
  distance: number;
  duration: number;
  transport: 'CAR' | 'PEDESTRIAN';
}

interface MakerInfo extends MapLocation {}

export interface MapInfo {
  direction?: Direction[];
  route?: Route;
  markers?: MakerInfo[];
  placeList?: any[];
  focusPlace?: any;
  placeMarkerClick?: (place: any) => void;
  height?: string;
  startLocation?: Coord;
}

interface PlaceMarker {
  marker: kakao.maps.Marker;
  overlay: kakao.maps.CustomOverlay;
}

const MarkerLable = (name: string) => {
  const content = `
        <div style="
          background:white;
          border:1px solid #888;
          border-radius:6px;
          padding:3px 8px;
          font-size:13px;
          font-weight:500;
          white-space:nowrap;
          box-shadow:0 2px 4px rgba(0,0,0,0.2);
          transform: translateY(-5px);
          cursor: pointer;
        ">
          ${name}
        </div>
      `;
  return content;
};

const CreateMarker = (
  place: any,
  map: kakao.maps.Map,
  placeMarkerClick?: (place: any) => void,
) => {
  const imageSize = new kakao.maps.Size(40, 54);
  const imageOption = { offset: new kakao.maps.Point(20, 54) };
  const getMarkerImage = () => {
    console.log(place.type);
    if (place.type === '음식점') return marker_restaurant;
    if (place.type === '관광지') return marker_tour;
    if (place.type === '카페') return marker_cafe;
    if (place.type === '쇼핑') return marker_shop;
    if (place.type === '액티비티') return marker_activity;
    if (place.type === '스파') return marker_spa;
    if (place.type === '찜질방') return marker_steam;
    if (place.type === '전시장') return marker_exhibition;
    if (
      place.type === 'Motel' ||
      place.type === 'Hotel' ||
      place.type === 'Pension' ||
      place.type === 'Guesthouse'
    )
      return marker_accommodation;
    return marker_tour;
  };
  const markerImage = new kakao.maps.MarkerImage(
    getMarkerImage(),
    imageSize,
    imageOption,
  );
  const marker = new window.kakao.maps.Marker({
    position: new window.kakao.maps.LatLng(
      Number(place.address_la),
      Number(place.address_lo),
    ),
    map: map,
    title: place.name,
    image: markerImage,
  });

  const content = document.createElement('div');
  content.innerHTML = MarkerLable(place.name);
  const overlay = new window.kakao.maps.CustomOverlay({
    position: new window.kakao.maps.LatLng(
      Number(place.address_la),
      Number(place.address_lo),
    ),
    content: content,
    yAnchor: 3, // 마커 위로 살짝 이동
    zIndex: 10,
    map: map,
  });

  // 클릭 이벤트 추가
  kakao.maps.event.addListener(marker, 'click', () => {
    placeMarkerClick?.(place);
  });
  kakao.maps.event.addListener(marker, 'mouseover', () => {
    overlay.setZIndex(9999);
    marker.setZIndex(9999);
    content.style.transform = 'translateY(-4px) scale(1.05)';
  });
  kakao.maps.event.addListener(marker, 'mouseout', () => {
    overlay.setZIndex(10);
    marker.setZIndex(1);
    content.style.transform = 'translateY(0px) scale(1)';
  });

  content.addEventListener('click', () => {
    placeMarkerClick?.(place);
  });

  // ✅ 마우스 오버 시 z-index 높이기
  content.addEventListener('mouseenter', () => {
    overlay.setZIndex(9999);
    marker.setZIndex(9999);
    content.style.transform = 'translateY(-4px) scale(1.05)';
  });

  // ✅ 마우스 아웃 시 복원
  content.addEventListener('mouseleave', () => {
    overlay.setZIndex(10);
    marker.setZIndex(1);
    content.style.transform = 'translateY(0px) scale(1)';
  });

  return { marker, overlay };
};

const KakaoMap: React.FC<MapInfo> = (mapInfo) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [transport, setTransport] = useState<'CAR' | 'PEDESTRIAN'>('CAR');
  const [focusMarker, setFocusMarker] = useState<PlaceMarker | null>(null);
  const [drawMarkers, setDrawMarkers] = useState<PlaceMarker[]>([]);
  const [drawPolylines, setDrawPolylines] = useState<kakao.maps.Polyline[]>([]);

  const direction = mapInfo.direction;

  useEffect(() => {
    if (!window.kakao || !mapRef.current) return;
    const mapObj = new window.kakao.maps.Map(mapRef.current, {
      center: new window.kakao.maps.LatLng(
        mapInfo.startLocation?.lat || 37.5665,
        mapInfo.startLocation?.lng || 126.978,
      ),
      level: 5,
    });
    setMap(mapObj);
  }, []);

  useEffect(() => {
    const place = mapInfo.focusPlace;
    // 기존 마커 제거
    if (focusMarker) {
      focusMarker.marker.setMap(null);
      focusMarker.overlay.setMap(null);
    }
    // 새 마커 생성
    if (place) {
      const { marker, overlay } = CreateMarker(
        place,
        map,
        mapInfo.placeMarkerClick,
      );
      setFocusMarker({ marker, overlay });
      // 마커 위치로 지도 중심 변환
      map.setCenter(marker.getPosition());
      map.setLevel(5);
    }
  }, [mapInfo.focusPlace]);

  useEffect(() => {
    // 기존 마커 제거
    if (drawMarkers.length > 0) {
      drawMarkers.forEach((marker) => marker.marker.setMap(null));
      drawMarkers.forEach((marker) => marker.overlay.setMap(null));
      drawMarkers.length = 0;
    }
    if (focusMarker) {
      focusMarker.marker.setMap(null);
      focusMarker.overlay.setMap(null);
      setFocusMarker(null);
    }

    if (mapInfo.placeList) {
      console.log(mapInfo.placeList);
      const markers = mapInfo.placeList.map((place) => {
        const { marker, overlay } = CreateMarker(
          place,
          map,
          mapInfo.placeMarkerClick,
        );
        return { marker, overlay };
      });
      console.log(markers);
      setDrawMarkers(markers);
    }
  }, [mapInfo.placeList, mapInfo.route]);

  useEffect(() => {
    // 기존 polyline 제거
    if (drawPolylines.length > 0) {
      drawPolylines.forEach((line) => line.setMap(null));
      drawPolylines.length = 0; // 배열도 비워줌
    }

    if (mapInfo.route) {
      setTransport(mapInfo.route.transport);
      drawRoute(mapInfo.route.path);
    }
  }, [mapInfo.route]);

  const drawRoute = (coords: Coord[]) => {
    if (!map) return;

    const path = coords.map((c) => new window.kakao.maps.LatLng(c.lat, c.lng));

    // Polyline 그리기
    const polyline = new window.kakao.maps.Polyline({
      path,
      strokeWeight: 5,
      strokeColor: transport === 'CAR' ? '#FF0000' : '#0000FF',
      strokeOpacity: 0.7,
      strokeStyle: 'solid',
    });
    polyline.setMap(map);
    setDrawPolylines([...drawPolylines, polyline]);

    // 마커 그리기
    direction?.forEach((p, idx) => {
      new window.kakao.maps.Marker({
        position: new window.kakao.maps.LatLng(p.lat, p.lng),
        map,
        title:
          idx === 0
            ? '출발'
            : idx === path.length - 1
              ? '도착'
              : `경유지 ${idx}`,
      });
    });

    // 지도 중심 조정
    const bounds = new window.kakao.maps.LatLngBounds();
    path.forEach((p) => bounds.extend(p));
    map.setBounds(bounds);
  };

  return (
    <div>
      <div ref={mapRef} className={`w-full h-[100vh]`} />
    </div>
  );
};
export default KakaoMap;
