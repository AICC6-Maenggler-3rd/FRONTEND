import { useEffect, useRef, useState } from 'react';
import type { Accommodation } from '@/api/accommodation';

interface MapProps {
  accommodationList?: Accommodation[];
  focusAccommodation?: Accommodation | null;
  height?: string;
}

const KakaoMap = ({
  accommodationList = [],
  focusAccommodation,
  height = '100%',
}: MapProps) => {
  const mapEl = useRef<HTMLDivElement>(null);
  const mapRef = useRef<kakao.maps.Map | null>(null);
  const markersRef = useRef<kakao.maps.Marker[]>([]);
  const infoRef = useRef<kakao.maps.InfoWindow | null>(null);
  const [ready, setReady] = useState(false);

  // 1) 맵 초기화
  useEffect(() => {
    if (!window.kakao || !mapEl.current) return;
    const map = new kakao.maps.Map(mapEl.current, {
      center: new kakao.maps.LatLng(37.5665, 126.978),
      level: 6,
    });
    mapRef.current = map;
    infoRef.current = new kakao.maps.InfoWindow({ zIndex: 2 });
    setReady(true);
  }, []);

  // 2) 마커 다시 그리기
  useEffect(() => {
    if (!ready || !mapRef.current) return;
    const map = mapRef.current;

    // 기존 마커 제거
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];

    if (!accommodationList.length) return;

    const bounds = new kakao.maps.LatLngBounds();

    accommodationList.forEach((acc) => {
      const lat = Number(acc.address_la);
      const lng = Number(acc.address_lo);
      if (Number.isNaN(lat) || Number.isNaN(lng)) return;

      const pos = new kakao.maps.LatLng(lat, lng);
      const marker = new kakao.maps.Marker({ position: pos, title: acc.name });
      marker.setMap(map);
      markersRef.current.push(marker);
      bounds.extend(pos);

      // 간단 인포윈도우
      kakao.maps.event.addListener(marker, 'click', () => {
        const html = `<div style="padding:6px 10px;white-space:nowrap;font-size:12px">${acc.name}</div>`;
        infoRef.current?.setContent(html);
        infoRef.current?.open(map, marker);
      });
    });

    // 보기 좋은 범위로
    if (!bounds.isEmpty()) map.setBounds(bounds);
  }, [ready, accommodationList]);

  // 3) 리스트에서 포커스된 숙소를 중앙으로
  useEffect(() => {
    if (!ready || !mapRef.current || !focusAccommodation) return;
    const lat = Number(focusAccommodation.address_la);
    const lng = Number(focusAccommodation.address_lo);
    if (Number.isNaN(lat) || Number.isNaN(lng)) return;

    const map = mapRef.current;
    const pos = new kakao.maps.LatLng(lat, lng);
    map.panTo(pos); // 부드럽게 이동
    map.setLevel(5);
  }, [ready, focusAccommodation]);

  return <div ref={mapEl} className="w-full" style={{ height }} />;
};

export default KakaoMap;
