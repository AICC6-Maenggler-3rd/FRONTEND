import { getPlaceListByAddress, getPlaceList, searchPlace, type Place, getPlaceListWithinRadius } from '@/api/place';
import InstaViewer from '@/components/common/InataViewer';
import React, { useEffect, useState } from 'react'
import PlaceListItem from './PlaceListItem';
import PlaceDetail from './PlaceDetail';

interface PlaceListProps {
  setFocusPlace: (place: Place) => void;
  setDetailPlace: (place: Place) => void;
  baseAddress?: string;
  lat?: number;
  lng?: number;
  radius?: number;
}

const PlaceList = ({setFocusPlace, setDetailPlace, baseAddress, lat, lng, radius}: PlaceListProps) => {
  const [placeList, setPlaceList] = useState<Place[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const getListFunc = (currentPage: number) => {
    if (lat && lng && radius) {
      const func = ( )=> getPlaceListWithinRadius(currentPage, 10, lat, lng, radius);
      return func();
    }
    if (baseAddress) {
      const func = ( )=> getPlaceListByAddress(baseAddress, currentPage, 10);
      return func();
    }
    const func = ( )=> getPlaceList(currentPage, 10);
    return func();
  }

  const fetchPlaceList = async () => {
    setCurrentPage(1);
    const res = await getListFunc(currentPage);
    setPlaceList(res.places);
    setTotalPages(res.total_pages);
  };
  useEffect(() => {
    fetchPlaceList();
  }, []);


  const handleMore = async () => {
    if (searchQuery.length > 0) {
      const res = await searchPlace(searchQuery, currentPage + 1, 10);
      setPlaceList([...placeList, ...res.places]);
      setCurrentPage(currentPage + 1);
      return;
    }
    const res = await getListFunc(currentPage + 1);
    setPlaceList([...placeList, ...res.places]);
    setCurrentPage(currentPage + 1);
  }

  const handlePlaceClick = (place: Place) => {
    setDetailPlace(place);
  }

  const handleFocusPlace = (place: Place) => {
    setFocusPlace(place);
  }

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, place: Place) => {
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('text/plain', JSON.stringify(place));
  }

  const handleSearch = async () => {
    setCurrentPage(1);
    if (searchQuery.length === 0) {
      fetchPlaceList();
      return;
    }
    const res = await searchPlace(searchQuery, currentPage, 10);
    setPlaceList(res.places);
    setTotalPages(res.total_pages);
  }
  return (
    <div className='h-full'>
        {/* <PlaceDetail place={currentPlace} setCurrentPlace={setCurrentPlace}/> */}
        <div className='flex items-center gap-2 py-2 px-4 h-[100px]'>
          {/* 검색 */}
          <input type="text" placeholder='검색' className='w-[200px] p-2 border-2 border-gray-300 rounded-md' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearch();
            }
          }}
          />
          <button onClick={handleSearch} className='p-2 border-2 border-gray-300 rounded-md'>검색</button>
        </div>
        <div className='flex flex-col gap-2 w-[300px] h-[calc(100%-100px)] px-2 overflow-y-auto '>
          {placeList?.map((place) => (
            <div key={place.place_id} draggable={true} onDragStart={(e) => handleDragStart(e, place)}>
              <PlaceListItem  place={place} handleFocusPlace={handleFocusPlace} handlePlaceClick={handlePlaceClick}/>
            </div>
          ))}
          {currentPage < totalPages ? (
            <button onClick={handleMore} className='text-center text-lg font-bold border-2 border-blue-300 m-2 p-4 rounded-sm'>
              더보기
            </button>
          ) : (
            <div className='text-center text-lg font-bold border-2 border-blue-200 text-blue-300 border-dashed m-2 p-4 rounded-sm'>
              마지막 장소 입니다
            </div>
          )}
        </div>
        
      </div>
  )
}

export default PlaceList
