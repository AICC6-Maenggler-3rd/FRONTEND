import React, { useEffect, useRef } from 'react'

const MapPage = () => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current || !window.naver) return;

    const map = new window.naver.maps.Map(mapRef.current, {
      center: new window.naver.maps.LatLng(37.5665, 126.9780),
      zoom: 13,
    });

    // 백엔드 프록시 호출
    const fetchDirections = async () => {
      const start = "126.9780,37.5665"; // (lng,lat) 서울시청
      const goal = "126.9882,37.5512";  // 남산타워
      const waypoints = "126.9830,37.5700"; // 경복궁 (옵션)

      const res = await fetch(
        `http://localhost:8000/map/directions?start=${start}&goal=${goal}&waypoints=${waypoints}`
      );
      const data = await res.json();
      console.log("Directions:", data);

      if (data.route) {
        const route = data.route.traoptimal[0]; // 첫 번째 경로
        const path = route.path.map(([lng, lat]: [number, number]) => 
          new window.naver.maps.LatLng(lat, lng)
        );

        new window.naver.maps.Polyline({
          map,
          path,
          strokeColor: "#5347AA",
          strokeWeight: 4,
        });

        // 지도 중심 맞추기
        const bounds = new window.naver.maps.LatLngBounds();
        path.forEach(p => bounds.extend(p));
        map.fitBounds(bounds);
      }
    };

    fetchDirections();
  }, []);

  return <div ref={mapRef} style={{ width: "100%", height: "400px" }} />;
};

export default MapPage
