import {
  getAccommodationListWithinRadius,
  searchAccommodation,
  type Accommodation,
} from '@/api/accommodation';
import InstaViewer from '@/components/common/InataViewer';
import React, { useEffect, useState } from 'react';
import AccommodationListItem from './AccommodationListItem';
import AccommodationDetail from './AccommodationDetail';

interface AccommodationListProps {
  setFocusAccommodation: (accommodation: Accommodation) => void;
  setDetailAccommodation: (accommodation: Accommodation) => void;
  lat?: number;
  lng?: number;
  radius?: number;
}

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

  const fetchAccommodationList = async () => {
    setCurrentPage(1);
    const res = await getAccommodationListWithinRadius(
      currentPage,
      10,
      lat,
      lng,
      radius,
    );
    setAccommodationList(res.data);
    setTotalPages(res.total_pages);
  };
  useEffect(() => {
    fetchAccommodationList();
  }, []);

  const handleMore = async () => {
    const res = await getAccommodationListWithinRadius(
      currentPage + 1,
      10,
      lat,
      lng,
      radius,
    );
    setAccommodationList([...accommodationList, ...res.data]);
    setCurrentPage(currentPage + 1);
  };

  const handleAccommodationClick = (accommodation: Accommodation) => {
    setDetailAccommodation(accommodation);
  };

  const handleFocusAccommodation = (accommodation: Accommodation) => {
    setFocusAccommodation(accommodation);
  };

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    accommodation: Accommodation,
  ) => {
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('text/plain', JSON.stringify(accommodation));
  };

  const handleSearch = async () => {
    if (searchQuery.length === 0) {
      fetchAccommodationList();
      return;
    }
    const res = await searchAccommodation(searchQuery, currentPage, 10);
    setAccommodationList(res.data);
    setTotalPages(res.total_pages);
  };
  return (
    <div className="h-full">
      {/* <AccommodationDetail accommodation={currentAccommodation} setCurrentAccommodation={setCurrentAccommodation}/> */}
      <div className="flex items-center gap-2 py-2 px-4 h-[100px]">
        {/* 검색 */}
        <input
          type="text"
          placeholder="검색"
          className="w-[200px] p-2 border-2 border-gray-300 rounded-md"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearch();
            }
          }}
        />
        <button
          onClick={handleSearch}
          className="p-2 border-2 border-gray-300 rounded-md"
        >
          검색
        </button>
      </div>
      <div className="flex flex-col gap-2 w-[300px] h-[calc(100%-100px)] px-2 overflow-y-auto ">
        {accommodationList?.map((accommodation) => (
          <div
            key={accommodation.accommodation_id}
            draggable={true}
            onDragStart={(e) => handleDragStart(e, accommodation)}
          >
            <AccommodationListItem
              accommodation={accommodation}
              handleFocusAccommodation={handleFocusAccommodation}
              handleAccommodationClick={handleAccommodationClick}
            />
          </div>
        ))}
        <button
          onClick={handleMore}
          className="text-center text-lg font-bold border-2 border-blue-300 m-2 p-4 rounded-sm"
        >
          더보기
        </button>
      </div>
    </div>
  );
};

export default AccommodationList;
