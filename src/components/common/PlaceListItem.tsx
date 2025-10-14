import type { Place } from '@/api/place';
import React from 'react'


interface PlaceListItemProps {
  place: Place;
  handleFocusPlace: (place: Place) => void;
  handlePlaceClick: (place: Place) => void;
}

const PlaceListItem = ({place, handleFocusPlace, handlePlaceClick}: PlaceListItemProps) => {
  return (
    <div className='flex items-center gap-2 justify-between bg-white' draggable={true} onClick={() => handleFocusPlace(place)}>
      <div className='px-4 py-2 flex flex-col gap-2 select-none'>
        <div className='text-lg font-bold w-[150px] truncate'>
          {place.name}
        </div>
        <div className='text-sm text-gray-500 rounded-full bg-gray-100 px-2 py-1 w-fit'>
          {place.type}
        </div>
      </div>
      <button onClick={() => handlePlaceClick(place)} className='bg-blue-400 text-white px-4 py-2 rounded-md select-none text-sm'>
        상세
      </button>
    </div>
  )
}

export default PlaceListItem
