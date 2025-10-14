import React, { useEffect, useState } from 'react'
import PlaceList from '../../../components/common/PlaceList'
import JourneySidebar from '@/components/journey/JourneySidebar'
import KakaoMap from '@/components/KakaoMap';
import type { Place } from '@/api/place';
import DayScheduleBar from './DayScheduleBar';
import PlaceDetail from '@/components/common/PlaceDetail';
import type { Route } from '@/components/KakaoMap';
export interface DaySchedule{
  day: number;
  placeList: Place[];
}

const CreateScheduleStepTwo = () => {
    // 현재 활성화된 단계 상태 (기본값: 1 - 정보 입력 단계)
    const [currentStep, setCurrentStep] = useState(1);
    const [focusPlace, setFocusPlace] = useState<Place | null>(null);

    const [scheduleList, setScheduleList] = useState<DaySchedule[]>([]);
    const [usedPlaceList, setUsedPlaceList] = useState<Place[]>([]);
    const [detailPlace, setDetailPlace] = useState<Place | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [route, setRoute] = useState<Route | null>(null);
    const [placeList, setPlaceList] = useState<Place[]>([]);

    const duration = 3;
    
    // 위치기반 검색용 나중에 수정 필요
    const baseLat = 37.5665;
    const baseLng = 126.978;
    const baseRadius = 3000;


    useEffect(() => {
        const scheduleList = Array.from({length: duration}, (_, i) => ({
            day: i + 1,
            placeList: [],
        }));
        setScheduleList(scheduleList);
    }, []);


    const handleStepChange = (step: number) => {
      setCurrentStep(step);
    };


  return (
    <div className="h-[calc(100vh)] bg-white flex">
      {
        detailPlace && (<PlaceDetail place={detailPlace} setCurrentPlace={setDetailPlace}/>)
      }
      {/* 왼쪽 사이드바 - 여행 계획 단계 네비게이션 */}
      <JourneySidebar
        currentStep={currentStep}
        onStepChange={handleStepChange}
      />
      <div className='h-full flex'>
        <PlaceList setFocusPlace={setFocusPlace} setDetailPlace={setDetailPlace} lat={baseLat} lng={baseLng} radius={baseRadius}/>
        <div className='h-full flex flex-col justify-between items-baseline'>
          <DayScheduleBar scheduleList={scheduleList} updateScheduleList={setScheduleList} setFocusPlace={setFocusPlace} setDetailPlace={setDetailPlace} setRoute={setRoute} setPlaceList={setPlaceList}/>
          <div className='px-5 w-full flex justify-center'>
            <button className='text-center text-lg font-bold border-2 border-blue-300 m-2 p-4 rounded-sm w-full'>
              스케쥴 자동 생성
            </button>
          </div>
        </div>
      </div>

      <div className='w-full h-full'>
          <KakaoMap focusPlace={focusPlace || undefined} route={route || undefined} placeList={placeList || undefined}/>
      </div>
    </div>
  )
}

export default CreateScheduleStepTwo
