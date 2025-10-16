import type { Place } from '@/api/place';
import React, { useEffect, useRef, useState } from 'react'
import type { DaySchedule, PlaceItem } from './CreateScheduleStepTwo';
import PlaceListItem from '@/components/common/PlaceListItem';
import { requestPath } from '@/api/map';
import type { Route } from '@/components/KakaoMap';
interface DayScheduleBarProps {
  scheduleList: DaySchedule[];
  updateScheduleList?: (scheduleList: DaySchedule[]) => void;
  focusPlace?: Place;
  setFocusPlace?: (place: Place) => void;
  setDetailPlace?: (place: Place) => void;
  setRoute?: (route: Route) => void;
  setPlaceList?: (placeList: Place[]) => void;
}

interface DragItem {
  colIndex: number;
  itemIndex: number;
  place: PlaceItem;
}

const DayScheduleBar = ({scheduleList, updateScheduleList, focusPlace, setFocusPlace, setDetailPlace, setRoute, setPlaceList}: DayScheduleBarProps) => {
  const dragItemRef = useRef<DragItem | null>(null);
  const dropColRef = useRef<number | null>(null);
  const dropIndexRef = useRef<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [colPlaceholder, setColPlaceholder] = useState<{col_index: number, index: number}>({col_index: -1, index: -1});

  useEffect(() => {
    const handleGlobalDragEnd = () => {
      setIsDragging(false);
      setColPlaceholder({col_index: -1, index: -1});
    };
  
    window.addEventListener("dragend", handleGlobalDragEnd);
    window.addEventListener("drop", handleGlobalDragEnd);
  
    return () => {
      window.removeEventListener("dragend", handleGlobalDragEnd);
      window.removeEventListener("drop", handleGlobalDragEnd);
    };
  }, []);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, place: PlaceItem, day: number, itemIndex: number) => {
    dragItemRef.current = {colIndex: day, itemIndex: itemIndex, place: place};
    dropIndexRef.current = itemIndex;
    e.dataTransfer.effectAllowed = 'move';
    console.log("drag start", place);
    setIsDragging(true);
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    setIsDragging(false);
    setColPlaceholder({col_index: -1, index: -1});

    if (e.dataTransfer.getData('day') === index.toString()){
      return;
    }
    if(dragItemRef.current){
      //다른날짜에서 들여온 아이템이 현재 날짜에 있는 경우 스킵
      if (dragItemRef.current.colIndex !== index && scheduleList[index].placeList.some((p) => p.place_id === dragItemRef.current?.place.place_id)) return;
      const newScheduleList = [...scheduleList];
      newScheduleList[dragItemRef.current.colIndex].placeList.splice(dragItemRef.current.itemIndex, 1);
      console.log("drop index", dropIndexRef.current)
      if(dropIndexRef.current !== null){
        const targetIndex = (dragItemRef.current.colIndex === index && dragItemRef.current.itemIndex < dropIndexRef.current) ? dropIndexRef.current -1: dropIndexRef.current;
        newScheduleList[index].placeList.splice(targetIndex, 0, dragItemRef.current.place);
      }else{
        newScheduleList[index].placeList.push(dragItemRef.current.place);
      }
      updateScheduleList?.(newScheduleList);
      dragItemRef.current = null;
      return;
    }
    if(!e.dataTransfer.getData('text/plain')) return;
    // 외부에서 들어온 경우
    const place : Place = JSON.parse(e.dataTransfer.getData('text/plain'));
    if (scheduleList[index].placeList.some((p) => p.place_id === place.place_id)) return;

    const newScheduleList = [...scheduleList];
    if(dropIndexRef.current !== null){
      newScheduleList[index].placeList.splice(dropIndexRef.current, 0, {
        place_id: place.place_id, accommodation_id: 0, start_time: null, end_time: null, is_required: true, info: place});
    }else{
      newScheduleList[index].placeList.push({
        place_id: place.place_id, accommodation_id: 0, start_time: null, end_time: null, is_required: true, info: place});
    }

    updateScheduleList?.(newScheduleList);
  }

  // item 위로 들어옴
  const handleDragEnterItem = (colIndex: number, itemIndex: number) => {
    dropColRef.current = colIndex;
    dropIndexRef.current = itemIndex;
    setColPlaceholder({col_index: colIndex, index: itemIndex });
  };

  // 컬럼 위로 들어옴 (빈 컬럼 처리)
  const handleDragEnterColumn = (colIndex: number) => {
    dropColRef.current = colIndex;
    if (scheduleList[colIndex].placeList.length === 0) {
      dropIndexRef.current = 0;
      setColPlaceholder({col_index: colIndex, index: 0});
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    e.stopPropagation();
  }

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    setIsDragging(false);
    setColPlaceholder({col_index: -1, index: -1});
    if(!dragItemRef.current) return;
    if(dropColRef.current === -1){
      const newScheduleList = [...scheduleList];
      newScheduleList[dragItemRef.current.colIndex].placeList.splice(dragItemRef.current.itemIndex, 1);
      updateScheduleList?.(newScheduleList);
      dragItemRef.current = null;
      return;
    }
  }

  const handelDeleteDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    setColPlaceholder({col_index: -1, index: -1});
    dropColRef.current = -1;
    e.preventDefault();
    e.stopPropagation();
  }

  const handleFocusPlace = (place: Place) => {
    setFocusPlace?.(place);
  }

  const handlePlaceClick = (place: Place) => {
    setDetailPlace?.(place);
  }
  
  const handleViewPath = async (index: number) => {
    if(scheduleList[index].placeList.length < 2) return;
    const schedule = scheduleList[index];
    const waypoints = schedule.placeList.map((p) => ({lng: parseFloat(p.info.address_lo), lat: parseFloat(p.info.address_la)}));
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
    setPlaceList?.(schedule.placeList.map((p) => p.info));
  }

  
  return (
    <div className='flex h-full relative'>
      {
        isDragging && (
          <div 
          className='absolute inset-0 bg-gray-500/80 z-50 top-0 left-[calc(-100%)] w-full h-screen border-2 border-red-500 flex items-center justify-center'
          onDragEnter={handelDeleteDragEnter}
          onDragOver={(e)=>handleDragOver(e,-1)}
          >
            <div className='text-white text-2xl font-bold'>여행지 삭제</div>
          </div>
        )
      }
      <div className='w-[300px] h-full bg-white '>
        
        <div className='flex flex-col gap-2 h-full overflow-y-auto '>
          {scheduleList?.map((schedule) => (
            <div 
            key={schedule.index} className='flex flex-col gap-2 p-2 border-b border-gray-200' 
            onDrop={(e) => handleDrop(e, schedule.index)}
            onDragEnter={(e) => handleDragEnterColumn(schedule.index)}
            >
              <div className='flex justify-between items-center'>
                <h2>{schedule.index+1}일차 ({schedule.date.toLocaleDateString()})</h2>
                <div className='flex gap-2'>
                  <button className='text-sm text-gray-500' onClick={() => handleViewPath(schedule.index)}>
                    view
                  </button>
                </div>
              </div>
              <div 
                className='flex flex-col gap-2' 
                onDragOver={(e) => handleDragOver(e, schedule.index)}>
                {schedule.placeList?.map((place, itemIndex) => (
                  <div  key={place.place_id}>
                    <div 
                      draggable={true}
                      onDragStart={(e) => handleDragStart(e, place, schedule.index, itemIndex)}
                      onDragEnd={(e) => handleDragEnd(e)}
                      onDragEnter={(e) => handleDragEnterItem(schedule.index, itemIndex)}
                      >
                        {
                          (colPlaceholder.col_index === schedule.index && colPlaceholder.index === itemIndex) && (
                            <div className='h-2 bg-blue-600/40 select-none'/>
                          )
                        }
                        <PlaceListItem 
                        place={place.info} 
                        focus={focusPlace?.place_id === place.place_id}
                        handleFocusPlace={handleFocusPlace} 
                        handlePlaceClick={handlePlaceClick} 
                        />
                    </div>
                  </div>
                ))}
                {
                  schedule.placeList.length === 0 
                  ? (
                    <div 
                    className='text-center border-2 border-gray-200 rounded-md p-2 border-dashed h-[100px] flex flex-col items-center justify-center text-gray-500 select-none'
                    >
                      <div className='text-5xl'>+</div>
                      <div>여행지를 놓아주세요.</div>
                    </div>
                  )
                  : (
                    <>
                      {
                        (colPlaceholder.col_index === schedule.index && colPlaceholder.index === schedule.placeList.length) && (
                          <div className='h-2 bg-blue-600/40 select-none'/>
                        )
                      }
                      <div 
                        className='h-[20px] select-none'
                        onDragEnter={(e) => handleDragEnterItem(schedule.index, schedule.placeList.length)}
                        />
                    </>
                  )
                }
              </div>
              {
                (colPlaceholder.col_index === schedule.index && colPlaceholder.index === -1) && (
                  <div 
                    className='h-2 bg-blue-600/40 select-none'
                  >
                  </div>
                )
              }
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DayScheduleBar
