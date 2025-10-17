import React from 'react';
import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import type { TravelPlan } from '../step1/CreateScheduleStepOne';
import type { DaySchedule } from '../step2/CreateScheduleStepTwo';

const CreateScheduleStepFour = () => {
  const [travelPlan, setTravelPlan] = useState<TravelPlan | null>(null);
  const [scheduleList, setScheduleList] = useState<DaySchedule[]>([]);
  const location = useLocation();
  useEffect(() => {
    const state = location.state;
    if (state?.travelPlan) {
      setTravelPlan(state.travelPlan);
    }
    if (state?.scheduleList) {
      setScheduleList(state.scheduleList);
    }
  }, [location.state]);

  useEffect(() => {
    if (travelPlan && scheduleList) {
      console.log('travelPlan', travelPlan);
      console.log('scheduleList', scheduleList);
    }
  }, [travelPlan, scheduleList]);

  return <div>aaa</div>;
};

export default CreateScheduleStepFour;
