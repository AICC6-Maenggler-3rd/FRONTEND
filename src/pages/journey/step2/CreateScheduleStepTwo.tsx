import { useEffect, useState } from 'react';
import PlaceList from '../../../components/common/PlaceList';
import KakaoMap from '@/components/KakaoMap';
import type { Place } from '@/api/place';
import DayScheduleBar from './DayScheduleBar';
import PlaceDetail from '@/components/common/PlaceDetail';
import type { Route } from '@/components/KakaoMap';
import { useLocation, useNavigate } from 'react-router-dom';
import type { Itinerary, ItineraryCreateRequest, ItineraryItem, ItineraryItemDataResponse, ItineraryItemResponse, ItineraryResponse } from '@/types/itinerary';
import { generateItinerary } from '@/api/itinerary';
import type { Accommodation } from '@/types/accommodation';
import { Link } from 'react-router-dom';


export interface DaySchedule {
  index: number;
  date: Date;
  placeList: PlaceItem[];
  accommodation : Accommodation | null;
}
export interface PlaceItem extends ItineraryItem{
  info: Place;
}
const CalculateDuration = (start_at: string, end_at: string) => {
  // 기간 계산, 시작일과 종료일 포함
  return Math.ceil((new Date(end_at).getTime() - new Date(start_at).getTime()) / (24 * 60 * 60 * 1000)) + 1;
}

const CalculateDayIndex = (start_at: string, date: string) => {
  // 시작일을 기준으로 몇 번째 날짜인지 계산, 시작일은 0일로 계산
  return Math.floor((new Date(date).getTime() - new Date(start_at).getTime() + 12 * 60 * 60 * 1000) / (24 * 60 * 60 * 1000));
}

const ConvertScheduleToItineraryRequest = (scheduleList: DaySchedule[], travelPlan: any) => {
  const itinerary : ItineraryCreateRequest = {
    start_location: travelPlan.location,
    theme: travelPlan.theme,
    start_at: travelPlan.startDate,
    end_at: travelPlan.endDate,
    relation: travelPlan.companion,
    user_id: travelPlan.user_id,
    items: [],
  }
  for(const schedule of scheduleList) {
    //travelPlan.startDate 기준으로 일정 인덱스 만큼 더해서 날짜 계산 DateType, date-fns 없음
    const date = new Date(travelPlan.startDate.getTime() + schedule.index * 24 * 60 * 60 * 1000);
    for(const place of schedule.placeList) {
      const index = schedule.placeList.indexOf(place);
      const start_time = new Date(date.getTime() + index * 2 * 60 * 60 * 1000);
      const end_time = new Date(date.getTime() + (index * 2 + 2) * 60 * 60 * 1000);
      const item : ItineraryItem = {
        place_id: place.info.place_id,
        accommodation_id: 0,
        start_time: start_time.toISOString(),
        end_time: end_time.toISOString(),
        is_required: true,
      }
      itinerary.items.push(item);
    }
  }
  return itinerary;
}

const ConvertItineraryResponseToSchedule = (itinerary: ItineraryResponse) => {
  
  const duration = CalculateDuration(itinerary.start_at, itinerary.end_at);
  const scheduleList: DaySchedule[] = Array.from({ length: duration }, (_, i) => ({
    index: i,
    date: new Date(new Date(itinerary.start_at).getTime() + i * 24 * 60 * 60 * 1000),
    placeList: [],
    accommodation: null,
  }));
  // console.log("itinerary", itinerary);
  console.log("scheduleList", scheduleList);
  for(const item of itinerary.items) {
    const index = CalculateDayIndex(itinerary.start_at, item.data.start_time || '');
    console.log("index", index);
    if(item.item_type === "place") {
      scheduleList[index].placeList.push({
        place_id: item.data.place_id,
        accommodation_id: 0,
        start_time: item.data.start_time,
        end_time: item.data.end_time,
        is_required: true,
        info: item.data.info as Place,
      } as PlaceItem);
    }
  }
  return scheduleList;
}

const CreateScheduleStepTwo = () => {
  const navigate = useNavigate();
  const [focusPlace, setFocusPlace] = useState<Place | null>(null);

  const [scheduleList, setScheduleList] = useState<DaySchedule[]>([]);
  const [detailPlace, setDetailPlace] = useState<Place | null>(null);
  const [route, setRoute] = useState<Route | null>(null);
  const [placeList, setPlaceList] = useState<Place[]>([]);

  const [duration, setDuration] = useState(1);

  const location = useLocation();
  const travelPlan = location.state?.travelPlan;

  const [generateAction, setGenerateAction] = useState(false);
  const [fixSchedule, setFixSchedule] = useState(false);

  // // 위치기반 검색용 나중에 수정 필요
  // const baseLat = 37.5665;
  // const baseLng = 126.978;
  // const baseRadius = 3000;

  useEffect(() => {
    if (travelPlan) {
      console.log('이전 단계에서 받은 데이터:', travelPlan);
      // 필요 시 상태 초기화
      const diffTime =
        travelPlan.endDate?.getTime() - travelPlan.startDate?.getTime();
      setDuration(
        diffTime ? Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1 : 1,
      );
    }
  }, [travelPlan]);

  useEffect(() => {
    const scheduleList = Array.from({ length: duration }, (_, i) => ({
      index: i,
      date: new Date(travelPlan.startDate.getTime() + i * 24 * 60 * 60 * 1000),
      placeList: [],
      accommodation: null,
    }));
    setScheduleList(scheduleList);
  }, [duration]);
  const handleAutoSchedule = async () => {
    console.log('스케쥴 자동 생성');
    const itinerary = ConvertScheduleToItineraryRequest(scheduleList, travelPlan);
    setGenerateAction(true);
    const result = await generateItinerary(itinerary, 'random');
    const new_scheduleList = ConvertItineraryResponseToSchedule(result);
    setScheduleList(new_scheduleList);
    setGenerateAction(false);
    // navigate('/stepThree', { state: { travelPlan, scheduleList: new_scheduleList } });
  }

  const handleFocusPlace = (place: Place) => {
    if(focusPlace?.place_id === place.place_id) {
      setFocusPlace(null);
    }else{
      setFocusPlace(place);
    }
  }

  return (
    <div className="h-[calc(100vh)] bg-white flex">
      {detailPlace && (
        <PlaceDetail place={detailPlace} setCurrentPlace={setDetailPlace} />
      )}
      <div className='relative h-full w-full flex'>
        {
          generateAction && (
            <div className='absolute select-none top-0 left-0 w-full h-full z-[999] bg-white'>
              <div className='flex flex-col items-center justify-center h-full'>
                <div>
                  <img src="public/image/schedule_generate.png" alt="schedule_generate" className='w-[10rem] h-[10rem]' />
                </div>
                <div className='text-2xl font-bold'>스케쥴 자동 생성 중...</div>
              </div>
            </div>
          )

        }
        <div className="relative h-full flex">
          <PlaceList
            focusPlace={focusPlace || undefined}
            setFocusPlace={handleFocusPlace}
            setDetailPlace={setDetailPlace}
            baseAddress={travelPlan?.location}
            />
          <div className="h-full flex flex-col justify-between items-baseline">
            <div className='h-[5rem] w-full flex items-center justify-center'>
              <h1 className='text-2xl w-full font-bold text-center py-4 border-b border-gray-200 flex items-center justify-center'>
                {fixSchedule ? '스케쥴 수정' : '필수 여행지 추가'}
              </h1>
            </div>
            <div className='h-[calc(100%-10rem)]'>
              <DayScheduleBar
                scheduleList={scheduleList}
                updateScheduleList={setScheduleList}
                focusPlace={focusPlace || undefined}
                setFocusPlace={handleFocusPlace}
                setDetailPlace={setDetailPlace}
                setRoute={setRoute}
                setPlaceList={setPlaceList}
                />
            </div>
            <div className="px-5 h-[5rem] w-full flex justify-center">
              <button className="text-center text-lg font-bold border-2 border-blue-300 m-2 p-4 rounded-sm w-full" onClick={handleAutoSchedule}>
                스케쥴 자동 생성
              </button>
            </div>
          </div>
        </div>

        <div className="relative w-full h-full">
          <KakaoMap
            focusPlace={focusPlace || undefined}
            route={route || undefined}
            placeList={placeList || undefined}
            />
          <div className='navigation-bar absolute top-5 right-2 z-50 flex h-[3rem] w-[15rem] items-center justify-center gap-2'>
            <Link 
              to='/journey/step1'
              state={{ travelPlan, scheduleList }}
              className='h-[3rem] shadow-md flex items-center justify-center text-lg font-bold bg-white border-2 border-blue-300 m-2 p-4 rounded-sm w-full' 
              >
              이전
            </Link>
            <Link 
              to='/journey/step2'
              state={{ travelPlan, scheduleList }}
              className='h-[3rem] shadow-md flex items-center justify-center text-lg font-bold bg-white border-2 border-blue-300 m-2 p-4 rounded-sm w-full' 
            >
              다음
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateScheduleStepTwo;
