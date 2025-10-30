import type { Place } from '@/api/place';

interface PlaceListItemProps {
  place: Place;
  focus: boolean;
  handleFocusPlace: (place: Place) => void;
  handlePlaceClick: (place: Place) => void;
  isRecommended?: boolean;
}

const PlaceListItem = ({
  place,
  focus,
  handleFocusPlace,
  handlePlaceClick,
  isRecommended,
}: PlaceListItemProps) => {
  return (
    <div
      className={`relative flex px-4 items-center gap-2 justify-between duration-300 ease-out hover:bg-gray-100 cursor-pointer rounded-md ${focus ? 'bg-gray-100' : 'bg-white'}`}
      draggable={true}
      onClick={() => handleFocusPlace(place)}
    >
      <div className="py-2 flex flex-col gap-2 w-[150px] select-none">
        <div className="text-lg font-bold w-[150px] truncate">{place.name}</div>
        <div className="text-sm text-gray-500 rounded-full bg-gray-100 px-2 py-1 w-fit">
          {place.type}
        </div>
      </div>
      <div className="flex flex-col items-end gap-2">
        <div>
          {isRecommended && (
            <div className="top-1 right-1 bg-blue-500 text-white text-xs px-2 py-1 rounded shadow-md">
              🎊 AI 추천
            </div>
          )}
        </div>
        <div>
          <button
            onClick={() => handlePlaceClick(place)}
            className="bg-blue-400 hover:bg-blue-500 duration-300 ease-out text-white px-4 py-2 rounded-md select-none text-sm"
          >
            상세
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlaceListItem;
