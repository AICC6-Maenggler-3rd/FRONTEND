import {
  getAccommodationListWithinRadius,
  searchAccommodation,
  type Accommodation,
} from '@/api/accommodation';
import React, { useEffect, useMemo, useState } from 'react';
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
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const isSearchMode = useMemo(
    () => searchQuery.trim().length > 0,
    [searchQuery],
  );

  const fetchList = async (page = 1) => {
    const res = await getAccommodationListWithinRadius(
      page,
      PAGE_SIZE,
      lat,
      lng,
      radius,
    );
    setAccommodationList(
      page === 1 ? res.data : (prev) => [...prev, ...res.data],
    );
    setCurrentPage(page);
    setTotalPages(res.total_pages);
  };

  const fetchSearch = async (page = 1) => {
    const res = await searchAccommodation(searchQuery.trim(), page, PAGE_SIZE);
    setAccommodationList(
      page === 1 ? res.data : (prev) => [...prev, ...res.data],
    );
    setCurrentPage(page);
    setTotalPages(res.total_pages);
  };

  // 좌표/반경 바뀌면 초기화 후 재조회
  useEffect(() => {
    if (lat === -1 || lng === -1 || radius === -1) return;
    setCurrentPage(1);
    setAccommodationList([]);
    isSearchMode ? fetchSearch(1) : fetchList(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lat, lng, radius]);

  // 최초 로드
  useEffect(() => {
    fetchList(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMore = async () => {
    if (currentPage >= totalPages) return;
    const next = currentPage + 1;
    isSearchMode ? fetchSearch(next) : fetchList(next);
  };

  const handleSearch = async () => {
    if (!isSearchMode) {
      fetchList(1);
      return;
    }
    setCurrentPage(1);
    setAccommodationList([]);
    await fetchSearch(1);
  };

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    accommodation: Accommodation,
  ) => {
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('text/plain', JSON.stringify(accommodation));
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

        <button
          onClick={handleMore}
          disabled={currentPage >= totalPages}
          className="text-center text-lg font-bold border-2 border-blue-300 m-2 p-4 rounded-sm disabled:opacity-50"
        >
          더보기
        </button>
      </div>
    </div>
  );
};

export default AccommodationList;
