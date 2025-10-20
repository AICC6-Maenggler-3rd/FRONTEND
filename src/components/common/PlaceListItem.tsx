import type { Place } from '@/api/place';
import React from 'react'


interface PlaceListItemProps {
  place: Place;
  focus: boolean;
  handleFocusPlace: (place: Place) => void;
  handlePlaceClick: (place: Place) => void;
}

const PlaceListItem = ({place, focus, handleFocusPlace, handlePlaceClick}: PlaceListItemProps) => {
  
  return (
    <div className={`flex px-4 items-center gap-2 justify-between duration-300 ease-out hover:bg-gray-100 cursor-pointer rounded-md ${focus ? 'bg-gray-100' : 'bg-white'}`} draggable={true} onClick={() => handleFocusPlace(place)}>
      <div className='py-2 flex flex-col gap-2 w-[150px] select-none'>
        <div className='text-lg font-bold w-[150px] truncate'>
          {place.name}
        </div>
        <div className='text-sm text-gray-500 rounded-full bg-gray-100 px-2 py-1 w-fit'>
          {place.type}
        </div>
      </div>
      <button onClick={() => handlePlaceClick(place)} className='bg-blue-400 hover:bg-blue-500 duration-300 ease-out text-white px-4 py-2 rounded-md select-none text-sm'>
        상세
      </button>
    </div>
  )
}

export default PlaceListItem
