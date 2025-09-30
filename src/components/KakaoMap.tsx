import { useEffect, useRef, useState, type ReactElement } from "react";
import { Map, MapMarker } from "react-kakao-maps-sdk";

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

interface MakerInfo extends MapLocation{
}

export interface MapInfo{
  direction? : Direction[]
  markers? : MakerInfo[]
}



const KakaoMap: React.FC<MapInfo> = (mapInfo) => {

  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [transport, setTransport] = useState<"CAR" | "PEDESTRIAN">("CAR");

  const routeInfo = {
    startX:0.0,
    startY:0.0,
    endX:0.0,
    endY:0.0,
    viaPoints:[],
    transport: "Car"
  }
  const direction = mapInfo.direction
  if(direction){
    routeInfo.startX = direction[0].lng
    routeInfo.startY = direction[0].lat
    routeInfo.endX = direction[direction.length-1].lng
    routeInfo.endY = direction[direction.length-1].lat
    

    direction.slice(1,direction.length-1).map((d)=>{return {x:d.lng, y:d.lat}})
  }

  useEffect(() => {
    if (!window.kakao || !mapRef.current) return;

    const mapObj = new window.kakao.maps.Map(mapRef.current, {
      center: new window.kakao.maps.LatLng(37.5665, 126.978),
      level: 5,
    });
    setMap(mapObj);

    
  }, []);

  const fetchRoute = async () => {
    if(direction === undefined || direction.length < 2) return;
    const res = await fetch("http://localhost:8000/map/route", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        startX: direction[0].lng,
        startY: direction[0].lat,
        endX: direction[direction.length-1].lng,
        endY: direction[direction.length-1].lat,
        viaPoints: (direction.length>2)?direction.slice(1,direction.length-1).map((d)=>{return {x:d.lng, y:d.lat}}):[],
        transport: transport,
      }),
    });

    const data = await res.json();
    drawRoute(data.route);
  };

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
      <div style={{ marginBottom: 10 }}>
        <label>
          <input
            type="radio"
            checked={transport === "CAR"}
            onChange={() => setTransport("CAR")}
          />
          자동차
        </label>
        <label style={{ marginLeft: 10 }}>
          <input
            type="radio"
            checked={transport === "PEDESTRIAN"}
            onChange={() => setTransport("PEDESTRIAN")}
          />
          보행자
        </label>
        <button onClick={fetchRoute} style={{ marginLeft: 10 }}>
          경로찾기
        </button>
      </div>
      <div ref={mapRef} style={{ width: "100%", height: "500px" }} />
    </div>
  );
};
export default KakaoMap
