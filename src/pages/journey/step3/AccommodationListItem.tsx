import type { Accommodation } from '@/api/accommodation';
import React, { useMemo } from 'react';

interface AccommodationListItemProps {
  accommodation: Accommodation;
  handleFocusAccommodation: (accommodation: Accommodation) => void;
  handleAccommodationClick: (accommodation: Accommodation) => void;
}

const AccommodationListItem = ({
  accommodation,
  handleAccommodationClick,
}: AccommodationListItemProps) => {
  // 이미지 배열 파싱
  const firstImage = useMemo(() => {
    if (!accommodation?.image_url) return '';
    const first = accommodation.image_url
      .split(';')
      .map((s) => s.trim())
      .filter(Boolean)[0];
    return first || '';
  }, [accommodation]);
  return (
    <div
      className="flex items-center gap-2 bg-white hover:cursor-pointer border"
      draggable
      onClick={() => handleAccommodationClick(accommodation)}
    >
      {/* <div
      className="flex items-center gap-2 justify-between bg-white"
      draggable
      onClick={() => handleFocusAccommodation(accommodation)}
    > */}
      {/* 썸네일 */}
      <div className="shrink-0 w-16 h-16 rounded-md overflow-hidden">
        {firstImage ? (
          <img
            src={firstImage}
            alt={accommodation.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
            no image
          </div>
        )}
      </div>
      <div className="w-full h-full flex flex-col gap-2 select-none truncate">
        <div className="text-lg font-bold truncate">{accommodation.name}</div>
        <div className="text-sm text-gray-500 rounded-full bg-gray-100 px-2 py-1 w-fit">
          {accommodation.type}
        </div>
      </div>
    </div>
  );
};

export default AccommodationListItem;
