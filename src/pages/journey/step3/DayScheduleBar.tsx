import type { Accommodation } from '@/api/accommodation';
import React, { useEffect, useRef, useState } from 'react';
import type { DaySchedule } from './CreateScheduleStepThree';
import AccommodationListItem from '@/pages/journey/step3/AccommodationListItem';
import { requestPath } from '@/api/map';
import type { Route } from '@/components/KakaoMap';
interface DayScheduleBarProps {
  scheduleList: DaySchedule[];
  updateScheduleList?: (scheduleList: DaySchedule[]) => void;
  setFocusAccommodation?: (accommodation: Accommodation) => void;
  setDetailAccommodation?: (accommodation: Accommodation) => void;
  setRoute?: (route: Route) => void;
  setAccommodationList?: (accommodationList: Accommodation[]) => void;
}

interface DragItem {
  colIndex: number;
  itemIndex: number;
  accommodation: Accommodation;
}

const DayScheduleBar = ({
  scheduleList,
  updateScheduleList,
  setFocusAccommodation,
  setDetailAccommodation,
  setRoute,
  setAccommodationList,
}: DayScheduleBarProps) => {
  const dragItemRef = useRef<DragItem | null>(null);
  const dropColRef = useRef<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [colAccommodationholder, setColAccommodationholder] = useState<
    number | null
  >(null);

  useEffect(() => {
    const handleGlobalDragEnd = () => {
      setIsDragging(false);
      setColAccommodationholder(null);
    };

    window.addEventListener('dragend', handleGlobalDragEnd);
    window.addEventListener('drop', handleGlobalDragEnd);

    return () => {
      window.removeEventListener('dragend', handleGlobalDragEnd);
      window.removeEventListener('drop', handleGlobalDragEnd);
    };
  }, []);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, day: number) => {
    setIsDragging(false);
    setColAccommodationholder(null);
    if (e.dataTransfer.getData('day') === day.toString()) {
      return;
    }
    if (dragItemRef.current) {
      if (dragItemRef.current.colIndex === day) return;
      if (
        scheduleList[day - 1].accommodationList.some(
          (p) =>
            p.accommodation_id ===
            dragItemRef.current?.accommodation.accommodation_id,
        )
      )
        return;
      const newScheduleList = [...scheduleList];
      newScheduleList[
        dragItemRef.current.colIndex - 1
      ].accommodationList.splice(dragItemRef.current.itemIndex, 1);
      newScheduleList[day - 1].accommodationList.push(
        dragItemRef.current.accommodation,
      );
      updateScheduleList?.(newScheduleList);
      dragItemRef.current = null;

      return;
    }
    if (!e.dataTransfer.getData('text/plain')) return;
    const accommodation: Accommodation = JSON.parse(
      e.dataTransfer.getData('text/plain'),
    );
    if (
      scheduleList[day - 1].accommodationList.some(
        (p) => p.accommodation_id === accommodation.accommodation_id,
      )
    )
      return;

    const newScheduleList = [...scheduleList];
    newScheduleList[day - 1].accommodationList.push(accommodation);

    updateScheduleList?.(newScheduleList);
  };

  const handleDragEnter = (
    e: React.DragEvent<HTMLDivElement>,
    day: number,
    index: number,
  ) => {
    dropColRef.current = day;
    setColAccommodationholder(day);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, day: number) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    setIsDragging(false);
    setColAccommodationholder(null);
    if (!dragItemRef.current) return;
    if (dropColRef.current === -1) {
      const newScheduleList = [...scheduleList];
      newScheduleList[
        dragItemRef.current.colIndex - 1
      ].accommodationList.splice(dragItemRef.current.itemIndex, 1);
      updateScheduleList?.(newScheduleList);
      dragItemRef.current = null;
      return;
    }
  };

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    accommodation: Accommodation,
    day: number,
    itemIndex: number,
  ) => {
    dragItemRef.current = {
      colIndex: day,
      itemIndex: itemIndex,
      accommodation: accommodation,
    };
    e.dataTransfer.effectAllowed = 'move';
    setIsDragging(true);
  };

  const handleFocusAccommodation = (accommodation: Accommodation) => {
    setFocusAccommodation?.(accommodation);
  };

  const handleAccommodationClick = (accommodation: Accommodation) => {
    setDetailAccommodation?.(accommodation);
  };

  const handleViewPath = async (day: number) => {
    if (scheduleList[day - 1].accommodationList.length < 2) return;
    const schedule = scheduleList[day - 1];
    const waypoints = schedule.accommodationList.map((p) => ({
      lng: parseFloat(p.address_lo),
      lat: parseFloat(p.address_la),
    }));
    const path = await requestPath({ waypoints: waypoints, transport: 'CAR' });
    const route: Route = {
      start_point: { lng: path.start_point.lng, lat: path.start_point.lat },
      end_point: { lng: path.end_point.lng, lat: path.end_point.lat },
      path: path.path.map((p) => ({ lng: p.lng, lat: p.lat })),
      distance: path.distance,
      duration: path.duration,
      transport: 'CAR',
    };
    setRoute?.(route);
    setAccommodationList?.(schedule.accommodationList);
  };
  const handleDeleteDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handelDeleteDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    setColAccommodationholder(-1);
    dropColRef.current = -1;
    e.preventDefault();
    e.stopPropagation();
    console.log('object');
  };

  return (
    <div className="flex h-full relative">
      {isDragging && (
        <div
          className="absolute inset-0 bg-gray-500/80 z-50 top-0 left-[calc(-100%)] w-full h-screen border-2 border-red-500 flex items-center justify-center"
          onDragEnter={handelDeleteDragEnter}
          onDragOver={(e) => handleDragOver(e, -1)}
        >
          <div className="text-white text-2xl font-bold">숙소 삭제</div>
        </div>
      )}
      <div className="w-[300px] h-full bg-white overflow-y-auto">
        <h1 className="text-2xl font-bold text-center py-4 border-b border-gray-200">
          숙소
        </h1>
        <div className="flex flex-col gap-2">
          {scheduleList?.map((schedule) => (
            <div
              key={schedule.day}
              className="flex flex-col gap-2 p-2 border-b border-gray-200"
              onDrop={(e) => handleDrop(e, schedule.day)}
              onDragEnter={(e) => handleDragEnter(e, schedule.day, -1)}
            >
              <div className="flex justify-between items-center">
                <h2>{schedule.day}일차</h2>
                <div className="flex gap-2">
                  <button
                    className="text-sm text-gray-500"
                    onClick={() => handleViewPath(schedule.day)}
                  >
                    view
                  </button>
                </div>
              </div>
              <div
                className="flex flex-col gap-2"
                onDragOver={(e) => handleDragOver(e, schedule.day)}
              >
                {schedule.accommodationList?.map((accommodation, itemIndex) => (
                  <div key={accommodation.accommodation_id}>
                    <div
                      draggable={true}
                      onDragStart={(e) =>
                        handleDragStart(
                          e,
                          accommodation,
                          schedule.day,
                          itemIndex,
                        )
                      }
                      onDragEnd={(e) => handleDragEnd(e)}
                    >
                      <AccommodationListItem
                        accommodation={accommodation}
                        handleFocusAccommodation={handleFocusAccommodation}
                        handleAccommodationClick={handleAccommodationClick}
                      />
                    </div>
                  </div>
                ))}
                {schedule.accommodationList.length === 0 && (
                  <div className="text-center border-2 border-gray-200 rounded-md p-2 border-dashed h-[100px] flex flex-col items-center justify-center text-gray-500 select-none">
                    <div className="text-5xl">+</div>
                    <div>숙소를 놓아주세요.</div>
                  </div>
                )}
                {colAccommodationholder === schedule.day && (
                  <div className="h-2 bg-blue-600/40 select-none"></div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DayScheduleBar;
