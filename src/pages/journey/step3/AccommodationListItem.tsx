import type { Accommodation } from '@/api/accommodation';
import React from 'react';

interface AccommodationListItemProps {
  accommodation: Accommodation;
  handleFocusAccommodation: (accommodation: Accommodation) => void;
  handleAccommodationClick: (accommodation: Accommodation) => void;
}

const AccommodationListItem = ({
  accommodation,
  handleFocusAccommodation,
  handleAccommodationClick,
}: AccommodationListItemProps) => {
  return (
    <div
      className="flex items-center gap-2 justify-between bg-white"
      draggable={true}
      onClick={() => handleFocusAccommodation(accommodation)}
    >
      <div className="px-4 py-2 flex flex-col gap-2 select-none">
        <div className="text-lg font-bold w-[150px] truncate">
          {accommodation.name}
        </div>
        <div className="text-sm text-gray-500 rounded-full bg-gray-100 px-2 py-1 w-fit">
          {accommodation.type}
        </div>
      </div>
      <button
        onClick={() => handleAccommodationClick(accommodation)}
        className="bg-blue-400 text-white px-4 py-2 rounded-md select-none text-sm"
      >
        상세
      </button>
    </div>
  );
};

export default AccommodationListItem;
