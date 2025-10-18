import {
  getAccommodationListWithinRadius,
  type Accommodation,
} from '@/api/accommodation';
import React, { useEffect, useState } from 'react';
import AccommodationListItem from './AccommodationListItem';

interface AccommodationListProps {
  setFocusAccommodation: (accommodation: Accommodation) => void;
  setDetailAccommodation: (accommodation: Accommodation) => void;
  lat?: number;
  lng?: number;
  radius?: number;
}

const PAGE_SIZE = 10;

const AccommodationList = ({
  setFocusAccommodation,
  setDetailAccommodation,
  lat = -1,
  lng = -1,
  radius = -1,
}: AccommodationListProps) => {
  const [accommodationList, setAccommodationList] = useState<Accommodation[]>(
    [],
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [hasMoreData, setHasMoreData] = useState(true);

  const fetchList = async (page = 1) => {
    const res = await getAccommodationListWithinRadius(
      page,
      PAGE_SIZE,
      lat,
      lng,
      radius,
      searchQuery.replace(' ', ''),
    );
    setAccommodationList(
      page === 1 ? res.data : (prev) => [...prev, ...res.data],
    );
    setCurrentPage(page);

    // 실제 반환된 데이터가 PAGE_SIZE보다 적으면 더 이상 데이터가 없음
    setHasMoreData(res.data.length === PAGE_SIZE);
  };

  // 좌표/반경 바뀌면 초기화 후 재조회
  useEffect(() => {
    if (lat === -1 || lng === -1 || radius === -1) return;
    setCurrentPage(1);
    setAccommodationList([]);
    setHasMoreData(true);
    fetchList(1);
  }, [lat, lng, radius]);

  // 최초 로드
  useEffect(() => {
    fetchList(1);
  }, []);

  const handleMore = async () => {
    if (!hasMoreData) return;
    const next = currentPage + 1;
    fetchList(next);
  };

  const handleSearch = async () => {
    setCurrentPage(1);
    setAccommodationList([]);
    setHasMoreData(true);
    fetchList(1);
    return;
  };

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    accommodation: Accommodation,
  ) => {
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('text/plain', JSON.stringify(accommodation));
    e.dataTransfer.setData('type', 'accommodation');
  };

  return (
    <div className="h-full">
      <div className="flex items-center gap-2 py-2 px-4 h-[100px]">
        <input
          type="text"
          placeholder="검색"
          className="w-[200px] p-2 border-2 border-gray-300 rounded-md"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSearch();
          }}
        />
        <button
          onClick={handleSearch}
          className="p-2 border-2 border-gray-300 rounded-md"
        >
          검색
        </button>
      </div>

      <div className="flex flex-col gap-1 w-[300px] h-[calc(100%-100px)] px-2 overflow-y-auto">
        {accommodationList.map((accommodation) => (
          <div
            key={accommodation.accommodation_id}
            draggable
            onDragStart={(e) => handleDragStart(e, accommodation)}
          >
            <AccommodationListItem
              accommodation={accommodation}
              handleFocusAccommodation={setFocusAccommodation}
              handleAccommodationClick={(a) => {
                setFocusAccommodation(a);
                setDetailAccommodation(a);
              }}
            />
          </div>
        ))}
        {hasMoreData && (
          <button
            onClick={handleMore}
            className="text-center text-lg font-bold border-2 border-blue-300 m-2 p-4 rounded-sm disabled:opacity-50"
          >
            더보기
          </button>
        )}
        {!hasMoreData && (
          <div className="text-center text-lg font-bold border-2 border-blue-200 text-blue-300 border-dashed m-2 p-4 rounded-sm">
            마지막 숙박시설 입니다
          </div>
        )}
      </div>
    </div>
  );
};

export default AccommodationList;
