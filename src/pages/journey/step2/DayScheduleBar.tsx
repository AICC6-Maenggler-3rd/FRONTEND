import type { Place } from '@/api/place';
import React from 'react'
import type { DaySchedule } from './CreateScheduleStepTwo';
import PlaceListItem from '@/components/common/PlaceListItem';
import { requestPath } from '@/api/map';
import type { Route } from '@/components/KakaoMap';
interface DayScheduleBarProps {
  duration: number;
  scheduleList: DaySchedule[];
  updateScheduleList?: (scheduleList: DaySchedule[]) => void;
  setFocusPlace?: (place: Place) => void;
  setDetailPlace?: (place: Place) => void;
  setRoute?: (route: Route) => void;
  setPlaceList?: (placeList: Place[]) => void;
}

const DayScheduleBar = ({duration, scheduleList, updateScheduleList, setFocusPlace, setDetailPlace, setRoute, setPlaceList}: DayScheduleBarProps) => {

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, day: number) => {
    if (e.dataTransfer.getData('day') === day.toString()){
      return;
    }
    const place : Place = JSON.parse(e.dataTransfer.getData('text/plain'));
    
    if (scheduleList[day-1].placeList.some((p) => p.place_id === place.place_id)) return;

    scheduleList.forEach((daySchedule) => {
      if(daySchedule.day === day) return;
      if(daySchedule.placeList.some((p) => p.place_id === place.place_id)){
        daySchedule.placeList = daySchedule.placeList.filter((p) => p.place_id !== place.place_id);
      }
    });

    const newScheduleList = [...scheduleList];
    newScheduleList[day-1].placeList.push(place);
    updateScheduleList?.(newScheduleList);
  }

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>, day: number) => {
    e.preventDefault();
    e.stopPropagation();
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, day: number) => {
    e.preventDefault();
    e.stopPropagation();
  }

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, place: Place, day?: number) => {
    e.dataTransfer.setData('text/plain', JSON.stringify(place));
    e.dataTransfer.setData('day', day?.toString() || '');
  }

  const handleFocusPlace = (place: Place) => {
    setFocusPlace?.(place);
  }

  const handlePlaceClick = (place: Place) => {
    setDetailPlace?.(place);
  }
  
  const handleViewPath = async (day: number) => {
    if(scheduleList[day-1].placeList.length < 2) return;
    const schedule = scheduleList[day-1];
    const waypoints = schedule.placeList.map((p) => ({lng: parseFloat(p.address_lo), lat: parseFloat(p.address_la)}));
    const path = await requestPath({waypoints: waypoints, transport: "CAR"});
    console.log(path)
    const route : Route = {
      start_point: {lng: path.start_point.lng, lat: path.start_point.lat},
      end_point: {lng: path.end_point.lng, lat: path.end_point.lat},
      path: path.path.map((p) => ({lng: p.lng, lat: p.lat})),
      distance: path.distance,
      duration: path.duration,
      transport: "CAR"
    }
    setRoute?.(route);
    setPlaceList?.(schedule.placeList);
  }

  return (
    <div className='w-[300px] h-full bg-white overflow-y-auto'>
      <h1 className='text-2xl font-bold text-center py-4 border-b border-gray-200'>여행지</h1>
      <div className='flex flex-col gap-2'>
        {scheduleList?.map((schedule) => (
          <div key={schedule.day} className='flex flex-col gap-2 p-2 border-b border-gray-200'>
            <div className='flex justify-between items-center'>
              <h2>{schedule.day}일차</h2>
              <div className='flex gap-2'>
                <button className='text-sm text-gray-500' onClick={() => handleViewPath(schedule.day)}>
                  view
                </button>
              </div>
            </div>
            <div className='flex flex-col gap-2' onDrop={(e) => handleDrop(e, schedule.day)} onDragEnter={(e) => handleDragEnter(e, schedule.day)} onDragOver={(e) => handleDragOver(e, schedule.day)}>
              {schedule.placeList?.map((place) => (
                <div key={place.place_id} 
                  draggable={true}
                  onDragStart={(e) => handleDragStart(e, place, schedule.day)}
                  onDragEnd={(e) => handleDragEnd(e)}
                >
                  <PlaceListItem 
                  place={place} 
                  handleFocusPlace={handleFocusPlace} 
                  handlePlaceClick={handlePlaceClick} 
                  />
                </div>
              ))}
              {
                schedule.placeList.length === 0 && (
                  <div className='text-center border-2 border-gray-200 rounded-md p-2 border-dashed h-[100px] flex flex-col items-center justify-center text-gray-500 select-none'>
                    <div className='text-5xl'>+</div>
                    <div>여행지를 놓아주세요.</div>
                  </div>
                )
              }
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DayScheduleBar
