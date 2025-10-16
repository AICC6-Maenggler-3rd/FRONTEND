import type { Accommodation } from '@/api/accommodation';
import { useMemo } from 'react';
import useSingleAndDoubleClick from '@/hooks/common';

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
  // 선택된 항목 색상 변경
  // const [isSelected, setIsSelected] = useState(false);
  // const backgroundClass = isSelected
  //   ? 'bg-blue-100 border-blue-400' // 선택되었을 때의 스타일
  //   : 'bg-white border-gray-200'; // 선택되지 않았을 때의 스타일

  // 이미지 배열 파싱
  const firstImage = useMemo(() => {
    if (!accommodation?.image_url) return '';
    const first = accommodation.image_url
      .split(';')
      .map((s) => s.trim())
      .filter(Boolean)[0];
    return first || '';
  }, [accommodation]);

  // 더블클릭
  const handleSingleOrDoubleClick = useSingleAndDoubleClick(
    () => {
      handleFocusAccommodation(accommodation);
      // setIsSelected((prev) => !prev);
    },
    () => {
      handleAccommodationClick(accommodation);
      // setIsSelected((prev) => !prev);
    },
  );

  return (
    <div
      // className={`flex items-center gap-2 hover:cursor-pointer border ${backgroundClass}`}
      className="flex items-center gap-2 bg-white hover:cursor-pointer border"
      draggable
      // onClick={() => handleAccommodationClick(accommodation)}
      onClick={handleSingleOrDoubleClick}
    >
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
