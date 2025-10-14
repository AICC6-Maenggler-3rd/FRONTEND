import { getPlaceList, type Place } from '@/api/place';
import InstaViewer from '@/components/common/InataViewer';
import React, { useEffect, useState } from 'react'
import PlaceListItem from './PlaceListItem';
import PlaceDetail from './PlaceDetail';

interface PlaceListProps {
  setFocusPlace: (place: Place) => void;
  setDetailPlace: (place: Place) => void;
}

const PlaceList = ({setFocusPlace, setDetailPlace}: PlaceListProps) => {
  const [placeList, setPlaceList] = useState<Place[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchPlaceList = async () => {
      const res = await getPlaceList(currentPage, 10);
      setPlaceList(res.data);
      setTotalPages(res.total_pages);
    };
    fetchPlaceList();
  }, []);


  const handleMore = async () => {
    const res = await getPlaceList(currentPage + 1, 10);
    setPlaceList([...placeList, ...res.data]);
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

  return (
    <div className='h-full'>
        {/* <PlaceDetail place={currentPlace} setCurrentPlace={setCurrentPlace}/> */}
        <div className='flex flex-col gap-2 w-[300px] px-2 overflow-y-auto h-full'>
          {placeList?.map((place) => (
            <div key={place.place_id} draggable={true} onDragStart={(e) => handleDragStart(e, place)}>
              <PlaceListItem  place={place} handleFocusPlace={handleFocusPlace} handlePlaceClick={handlePlaceClick}/>
            </div>
))}
          <button onClick={handleMore} className='text-center text-lg font-bold border-2 border-blue-300 m-2 p-4 rounded-sm'>
            더보기
          </button>
        </div>
        
      </div>
  )
}

export default PlaceList
