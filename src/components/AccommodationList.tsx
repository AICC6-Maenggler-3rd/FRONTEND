import {
  getAccommodationListWithinRadius,
  searchAccommodation,
  type Accommodation,
} from '@/api/accommodation';
import InstaViewer from '@/components/common/InataViewer';
import React, { useEffect, useState } from 'react';
import AccommodationListItem from '../pages/journey/step3/AccommodationListItem';
import AccommodationDetail from '../pages/journey/step3/AccommodationDetail';

interface AccommodationListProps {
  setFocusAccommodation: (Accommodation: Accommodation) => void;
  setDetailAccommodation: (Accommodation: Accommodation) => void;
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
  const [AccommodationList, setAccommodationList] = useState<Accommodation[]>(
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
    setAccommodationList([...AccommodationList, ...res.data]);
    setCurrentPage(currentPage + 1);
  };

  const handleAccommodationClick = (Accommodation: Accommodation) => {
    setDetailAccommodation(Accommodation);
  };

  const handleFocusAccommodation = (Accommodation: Accommodation) => {
    setFocusAccommodation(Accommodation);
  };

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    Accommodation: Accommodation,
  ) => {
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('text/plain', JSON.stringify(Accommodation));
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
      {/* <AccommodationDetail Accommodation={currentAccommodation} setCurrentAccommodation={setCurrentAccommodation}/> */}
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
        {AccommodationList?.map((Accommodation) => (
          <div
            key={Accommodation.accommodation_id}
            draggable={true}
            onDragStart={(e) => handleDragStart(e, Accommodation)}
          >
            <AccommodationListItem
              accommodation={Accommodation}
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
