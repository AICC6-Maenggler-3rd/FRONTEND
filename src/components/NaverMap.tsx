import React, { useEffect, useRef, type ReactElement } from 'react'
import ReactDOM from "react-dom/client";


interface MapLocation{
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


function offsetPath(path: naver.maps.LatLng[], offsetMeters: number): naver.maps.LatLng[] {
  const result: naver.maps.LatLng[] = [];

  for (let i = 0; i < path.length - 1; i++) {
    const p1 = path[i];
    const p2 = path[i + 1];

    const lat1 = p1.lat();
    const lng1 = p1.lng();
    const lat2 = p2.lat();
    const lng2 = p2.lng();

    // 위도/경도 차이 (deg)
    const dx = lng2 - lng1;
    const dy = lat2 - lat1;

    const length = Math.sqrt(dx * dx + dy * dy);
    if (length === 0) continue;

    // 현재 위도에서 1도당 거리 (m)
    const metersPerDegLat = 111320;
    const metersPerDegLng = 111320 * Math.cos((lat1 * Math.PI) / 180);

    // 단위벡터의 수직벡터
    const ox = -(dy / length);
    const oy = dx / length;

    // 오프셋(m)을 위경도 단위로 환산
    const dLat = (oy * offsetMeters) / metersPerDegLat;
    const dLng = (ox * offsetMeters) / metersPerDegLng;

    result.push(new naver.maps.LatLng(lat1 + dLat, lng1 + dLng));
  }

  // 마지막 점도 보정해서 추가
  const last = path[path.length - 1];
  result.push(new naver.maps.LatLng(last.lat(), last.lng()));

  return result;
}



const LocationString = (location:MapLocation) : string=>{
  console.log(location)
  return `${location.lng},${location.lat}`
}

const NaverMap: React.FC<MapInfo> = (mapInfo) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(()=>{
    if (!mapRef.current) return;
    const script = document.createElement("script");
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${import.meta.env.VITE_NAVER_CLIENT_ID}`;
    script.async = true;
    script.onload = () => {
      const { naver } = window;
      const map = new naver.maps.Map(mapRef.current!, {
        center: new naver.maps.LatLng(37.5665, 126.9780),
        zoom: 13,
      });

      class MyOverlay extends naver.maps.OverlayView {
        private _element: HTMLElement;
        private _position: naver.maps.LatLng;
        constructor(content: HTMLElement, position : naver.maps.LatLng) {
          super();
          this._element = content;
          this._position = position;
        }
      
        onAdd() {
          const overlayLayer = this.getPanes().overlayLayer;
          overlayLayer.appendChild(this._element);
        }
      
        draw() {
          const projection = this.getProjection();
          const pos = projection.fromCoordToOffset(this._position);
        
          const el = this._element;
          el.style.position = "absolute";
        
          // width, height 가져오기
          const { width, height } = el.getBoundingClientRect();
        
          el.style.left = `${pos.x - width / 2}px`;  // 좌우 중앙 맞춤
          el.style.top = `${pos.y - height - 45}px`; // 마커 위 10px 띄우기
        }
      
        onRemove() {
          this._element.parentNode?.removeChild(this._element);
        }
      }
  
      const overlays: MyOverlay[] = [];
      // 마커가 있으면 마커 생성
      if (mapInfo?.markers){
        mapInfo.markers.forEach(loc => {
          
          // 마커 설정
          const position = new window.naver.maps.LatLng(loc.lat, loc.lng)
          const marker = new window.naver.maps.Marker({
            position: position,
            title:loc.title,
            map,
          });
          
          // 오버레이 설정
          // 오버레이 컨테이너
          const overlayDiv = document.createElement("div");
  
          // React 컴포넌트 렌더링
          const root = ReactDOM.createRoot(overlayDiv);
          root.render(loc.infoWindow);
          
          const overlay = new MyOverlay(overlayDiv, position)
          overlays.push(overlay);

          // 마커 클릭 → 해당 오버레이만 토글
          naver.maps.Event.addListener(marker, "click", () => {
            if (overlay.getMap()) {
              overlay.setMap(null);
            } else {
              // 다른 오버레이 닫기
              overlays.forEach((o) => o.setMap(null));
              overlay.setMap(map);
            }
          });
        })
      }
  
  
      // console.log("Test")
      const direction = mapInfo.direction
      if (direction && direction.length > 1){
        const fetchDirections = async () => {
          const start = LocationString(direction[0])
          const goal =  LocationString(direction[direction.length-1])
          let link = `http://localhost:8000/map/directions?start=${start}&goal=${goal}`
          if(direction.length>2){
            const waypoint:string[] = []
            direction.forEach((l,i)=>{
              if(i == 0 || i == direction.length-1) return;
              waypoint.push(LocationString(l))
            });
            link = link + "&waypoints="+waypoint.join('|');
          }
  
          console.log(link)
    
          const res = await fetch(link);
          const data = await res.json();
          console.log("Directions:", data);
    
          if (data.route) {
            const route = data.route.traoptimal[0]; // 첫 번째 경로
            const origin_path = route.path.map(([lng, lat]: [number, number]) => 
              new window.naver.maps.LatLng(lat, lng)
            );
            const path = offsetPath(origin_path,3)
            new window.naver.maps.Polyline({
              map,
              path,
              strokeColor: "#5347AA",
              strokeOpacity: 0.7,
              strokeWeight: 6,
            });
            // 지도 중심 맞추기
            const bounds = new window.naver.maps.LatLngBounds();
            path.forEach(p => bounds.extend(p));
            map.fitBounds(bounds);
          }
        };
        
        fetchDirections();
      }
    };
  
    document.head.appendChild(script);
  
    return () => {
      document.head.removeChild(script);
    };
  },[])

  return <div ref={mapRef} style={{ width: "100%", height: "800px" }} />;
}

export default NaverMap
