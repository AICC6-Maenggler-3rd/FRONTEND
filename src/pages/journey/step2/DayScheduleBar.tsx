import type { Place } from '@/api/place';
import React, { useEffect, useRef, useState } from 'react'
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

interface DragItem {
  colIndex: number;
  itemIndex: number;
  place: Place;
}

const DayScheduleBar = ({duration, scheduleList, updateScheduleList, setFocusPlace, setDetailPlace, setRoute, setPlaceList}: DayScheduleBarProps) => {
  const dragItemRef = useRef<DragItem | null>(null);
  const dropColRef = useRef<number | null>(null);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, day: number) => {
    if (e.dataTransfer.getData('day') === day.toString()){
      return;
    }
    if(dragItemRef.current){
      if(dragItemRef.current.colIndex === day)return;
      const newScheduleList = [...scheduleList];
      newScheduleList[dragItemRef.current.colIndex-1].placeList.splice(dragItemRef.current.itemIndex, 1);
      newScheduleList[day-1].placeList.push(dragItemRef.current.place);
      updateScheduleList?.(newScheduleList);
      dragItemRef.current = null;
      return;
    }
    if(!e.dataTransfer.getData('text/plain')) return;
    const place : Place = JSON.parse(e.dataTransfer.getData('text/plain'));
    if (scheduleList[day-1].placeList.some((p) => p.place_id === place.place_id)) return;
    
    
    const newScheduleList = [...scheduleList];
    newScheduleList[day-1].placeList.push(place);


    updateScheduleList?.(newScheduleList);
  }

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>, day: number, index: number) => {
    dropColRef.current = day;
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, day: number) => {
    e.preventDefault();
    e.stopPropagation();
  }

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    if(dragItemRef.current){
      if(!dropColRef.current) return;
      const newScheduleList = [...scheduleList];
      newScheduleList[dragItemRef.current.colIndex-1].placeList.splice(dragItemRef.current.itemIndex, 1);
      updateScheduleList?.(newScheduleList);
      dragItemRef.current = null;
    }
  }

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, place: Place, day: number, itemIndex: number) => {
    dragItemRef.current = {colIndex: day, itemIndex: itemIndex, place: place};
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

  const cleanUpDrag = () => {

  }

  return (
    <div className='w-[300px] h-full bg-white overflow-y-auto'>
      <h1 className='text-2xl font-bold text-center py-4 border-b border-gray-200'>필수 여행지</h1>
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
            <div 
              className='flex flex-col gap-2' 
              onDrop={(e) => handleDrop(e, schedule.day)}
              onDragOver={(e) => handleDragOver(e, schedule.day)}>
              {schedule.placeList?.map((place, itemIndex) => (
                <div  key={place.place_id}>
                  <div 
                    draggable={true}
                    onDragStart={(e) => handleDragStart(e, place, schedule.day, itemIndex)}
                    onDragEnter={(e) => handleDragEnter(e, schedule.day, itemIndex)}
                    onDrop={(e) => handleDrop(e, schedule.day)}
                    onDragEnd={(e) => handleDragEnd(e)}
                    >
                    <PlaceListItem 
                    place={place} 
                    handleFocusPlace={handleFocusPlace} 
                    handlePlaceClick={handlePlaceClick} 
                    />
                  </div>
                </div>
              ))}
              {
                schedule.placeList.length === 0 
                ? (
                  <div className='text-center border-2 border-gray-200 rounded-md p-2 border-dashed h-[100px] flex flex-col items-center justify-center text-gray-500 select-none'>
                    <div className='text-5xl'>+</div>
                    <div>여행지를 놓아주세요.</div>
                  </div>
                )
                : (
                  <>
                    <div 
                      className=' h-[40px] select-none'
                      onDragEnter={(e) => handleDragEnter(e, schedule.day, schedule.placeList.length)}
                    >
                    </div>
                  </>
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
