import { useEffect, useRef, useState, type ReactElement } from 'react';
import { Map, MapMarker, type PolylineProps } from 'react-kakao-maps-sdk';
import { requestRoute } from '../api/map';
import type { Accommodation } from '@/api/accommodation';

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
  accommodationList?: Accommodation[];
  focusAccommodation?: Accommodation;
  height?: string;
}

const KakaoMap: React.FC<MapInfo> = (mapInfo) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [transport, setTransport] = useState<'CAR' | 'PEDESTRIAN'>('CAR');
  const [focusMarker, setFocusMarker] = useState<any>(null);
  const [drawMarkers, setDrawMarkers] = useState<kakao.maps.Marker[]>([]);
  const [drawPolylines, setDrawPolylines] = useState<kakao.maps.Polyline[]>([]);

  const direction = mapInfo.direction;

  useEffect(() => {
    if (!window.kakao || !mapRef.current) return;
    const mapObj = new window.kakao.maps.Map(mapRef.current, {
      center: new window.kakao.maps.LatLng(37.5665, 126.978),
      level: 5,
    });
    setMap(mapObj);
  }, []);

  useEffect(() => {
    if (mapInfo.focusAccommodation) {
      // 기존 마커 제거
      if (focusMarker) {
        focusMarker.setMap(null);
      }

      const marker = new window.kakao.maps.Marker({
        position: new window.kakao.maps.LatLng(
          Number(mapInfo.focusAccommodation.address_la),
          Number(mapInfo.focusAccommodation.address_lo),
        ),
      });
      marker.setMap(map);
      setFocusMarker(marker);
      // 마커 위치로 지도 중심 변환
      map.setCenter(marker.getPosition());
      map.setLevel(5);
    }
  }, [mapInfo.focusAccommodation]);

  useEffect(() => {
    // 기존 마커 제거
    if (drawMarkers.length > 0) {
      drawMarkers.forEach((marker) => marker.setMap(null));
      drawMarkers.length = 0;
    }
    if (focusMarker) {
      focusMarker.setMap(null);
      setFocusMarker(null);
    }

    if (mapInfo.accommodationList) {
      const markers = mapInfo.accommodationList.map((accommodation) => {
        return new window.kakao.maps.Marker({
          position: new window.kakao.maps.LatLng(
            Number(accommodation.address_la),
            Number(accommodation.address_lo),
          ),
          map: map,
          color: '#ff0000',
          title: accommodation.name,
        });
      });
      setDrawMarkers(markers);
    }
  }, [mapInfo.accommodationList, mapInfo.route]);

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
