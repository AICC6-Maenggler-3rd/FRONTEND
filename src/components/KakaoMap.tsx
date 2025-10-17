import { useEffect, useRef, useState, type ReactElement } from "react";
import { Map, MapMarker, type PolylineProps } from "react-kakao-maps-sdk";
import { requestRoute } from "../api/map";
import type { Place } from "@/api/place";

interface Coord {
  lat: number;
  lng: number;
}

interface MapLocation extends Coord{
  lat:number
  lng:number
  title?:string
  infoWindow?:ReactElement
}

interface Direction extends MapLocation{
}
export interface Route {
  start_point: Coord
  end_point: Coord
  path: Coord[]
  distance: number
  duration: number
  transport: "CAR" | "PEDESTRIAN"
}

interface MakerInfo extends MapLocation{
}


export interface MapInfo{
  direction? : Direction[]
  route? : Route
  markers? : MakerInfo[]
  placeList? : Place[]
  focusPlace? : Place
  placeMarkerClick? : (place: Place) => void
  height? : string
  startPoint? : Coord
}



interface PlaceMarker{
  marker: kakao.maps.Marker
  overlay: kakao.maps.CustomOverlay
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
}

const CreateMarker = (place: Place, map: kakao.maps.Map, placeMarkerClick?: (place: Place) => void) => {
  const marker = new window.kakao.maps.Marker({
    position: new window.kakao.maps.LatLng(Number(place.address_la),Number(place.address_lo)),
    map: map,
    title: place.name,
  });

  const content = document.createElement('div');
  content.innerHTML = MarkerLable(place.name);
  const overlay = new window.kakao.maps.CustomOverlay({
    position: new window.kakao.maps.LatLng(Number(place.address_la),Number(place.address_lo)),
    content: content,
    yAnchor: 2.5, // 마커 위로 살짝 이동
    zIndex: 10,
    map: map,
  });

  // 클릭 이벤트 추가
  kakao.maps.event.addListener(marker, 'click', () => {
    placeMarkerClick?.(place);
  });
  content.addEventListener('click', () => {
    placeMarkerClick?.(place);
  });


  return {marker, overlay};
}

const KakaoMap: React.FC<MapInfo> = (mapInfo) => {

  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [transport, setTransport] = useState<"CAR" | "PEDESTRIAN">("CAR");
  const [focusMarker, setFocusMarker] = useState<PlaceMarker | null>(null);
  const [drawMarkers, setDrawMarkers] = useState<PlaceMarker[]>([]);
  const [drawPolylines, setDrawPolylines] = useState<kakao.maps.Polyline[]>([]);

  const direction = mapInfo.direction

  useEffect(() => {
    if (!window.kakao || !mapRef.current) return;
    const mapObj = new window.kakao.maps.Map(mapRef.current, {
      center: new window.kakao.maps.LatLng(mapInfo.startPoint?.lat || 37.5665, mapInfo.startPoint?.lng || 126.978),
      level: 5,
    });
    setMap(mapObj);
  }, []);

  useEffect(() => {
    const place = mapInfo.focusPlace;
    // 기존 마커 제거
    if(focusMarker){
      focusMarker.marker.setMap(null);
      focusMarker.overlay.setMap(null);
    }
    // 새 마커 생성
    if(place){
      const {marker, overlay} = CreateMarker(place, map, mapInfo.placeMarkerClick);
      setFocusMarker({marker, overlay});
      // 마커 위치로 지도 중심 변환
      map.setCenter(marker.getPosition());
      map.setLevel(5);
    }
  }, [mapInfo.focusPlace]);

  useEffect(() => {
    // 기존 마커 제거
    if(drawMarkers.length > 0){
      drawMarkers.forEach((marker) => marker.marker.setMap(null));
      drawMarkers.forEach((marker) => marker.overlay.setMap(null));
      drawMarkers.length = 0;
    }
    if(focusMarker){
      focusMarker.marker.setMap(null);
      focusMarker.overlay.setMap(null);
      setFocusMarker(null);
    }

    if(mapInfo.placeList){
      console.log(mapInfo.placeList)
      const markers = mapInfo.placeList.map((place) => {
        const {marker, overlay} = CreateMarker(place, map, mapInfo.placeMarkerClick);
        return {marker, overlay};
    });
    console.log(markers)
      setDrawMarkers(markers);
    }

  }, [mapInfo.placeList, mapInfo.route]);

  useEffect(() => {
    // 기존 polyline 제거
    if(drawPolylines.length > 0){
      drawPolylines.forEach((line) => line.setMap(null));
      drawPolylines.length = 0; // 배열도 비워줌
    }

    if (mapInfo.route){
      setTransport(mapInfo.route.transport);
      drawRoute(mapInfo.route.path);
    }
  }, [mapInfo.route]);

  const drawRoute = (coords: Coord[]) => {
    if (!map) return;

    const path = coords.map(c => new window.kakao.maps.LatLng(c.lat, c.lng));

    // Polyline 그리기
    const polyline = new window.kakao.maps.Polyline({
      path,
      strokeWeight: 5,
      strokeColor: transport === "CAR" ? "#FF0000" : "#0000FF",
      strokeOpacity: 0.7,
      strokeStyle: "solid",
    });
    polyline.setMap(map);
    setDrawPolylines([...drawPolylines, polyline]);

    // 마커 그리기
    direction?.forEach((p, idx) => {
      new window.kakao.maps.Marker({
        position: new window.kakao.maps.LatLng(p.lat, p.lng),
        map,
        title: idx === 0 ? "출발" : idx === path.length - 1 ? "도착" : `경유지 ${idx}`,
      });
    });

    // 지도 중심 조정
    const bounds = new window.kakao.maps.LatLngBounds();
    path.forEach(p => bounds.extend(p));
    map.setBounds(bounds);
  };

  
  
  
  return (
    <div>
      <div ref={mapRef} className={`w-full h-[100vh]`} />
    </div>
  );
};
export default KakaoMap
