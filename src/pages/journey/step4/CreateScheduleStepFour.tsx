import { useEffect, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { TravelPlan } from '../step1/CreateScheduleStepOne';
import type { DaySchedule } from '../step2/CreateScheduleStepTwo';
import type { ItineraryCreateRequest, ItineraryItem } from '@/types/itinerary';
import { createItinerary } from '@/api/itinerary';
import { getUserInfo } from '@/api/auth';

const CreateScheduleStepFour = () => {
  const [travelPlan, setTravelPlan] = useState<TravelPlan | null>(null);
  const [scheduleList, setScheduleList] = useState<DaySchedule[]>([]);
  const [itineraryName, setItineraryName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  // 로그인 상태 확인
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const userData = await getUserInfo();
        console.log(
          'CreateScheduleStepFour - userData.user:',
          userData?.user?.id,
        );
        if (userData && userData.user) setIsLoggedIn(true);
        setUserId(userData?.user?.id || 0);
      } catch (error) {
        setIsLoggedIn(false);
      }
    };
    checkAuthStatus();
  }, []);

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

  // 일정 데이터를 ItineraryItem 배열로 변환
  const convertToItineraryItems = (): ItineraryItem[] => {
    const items: ItineraryItem[] = [];

    scheduleList.forEach((daySchedule) => {
      // 장소들 추가
      daySchedule.placeList.forEach((placeItem) => {
        items.push({
          place_id: placeItem.place_id,
          accommodation_id: 0,
          start_time: placeItem.start_time,
          end_time: placeItem.end_time,
          is_required: placeItem.is_required,
        });
      });

      // 숙소 추가
      if (daySchedule.accommodation) {
        items.push({
          place_id: 0,
          accommodation_id: daySchedule.accommodation.accommodation_id,
          start_time: null,
          end_time: null,
          is_required: true,
        });
      }
    });

    return items;
  };

  // 일정 저장 핸들러
  const handleSaveItinerary = async () => {
    if (!isLoggedIn) {
      setSaveError('로그인 후 이용해주세요.');
      return;
    }
    if (!travelPlan || !itineraryName.trim()) {
      setSaveError('여행 제목을 입력해주세요.');
      return;
    }

    setIsSaving(true);
    setSaveError(null);
    console.log('itineraryName', itineraryName);
    console.log('travelPlan', travelPlan);
    console.log('userId', userId);

    try {
      const itineraryData: ItineraryCreateRequest = {
        user_id: userId,
        relation: travelPlan.companion || '',
        start_at: travelPlan.startDate?.toISOString() || '',
        end_at: travelPlan.endDate?.toISOString() || '',
        location: travelPlan.location,
        theme: travelPlan.themes.join(', '),
        items: convertToItineraryItems(),
        name: itineraryName,
      };

      const response = await createItinerary(itineraryData);
      console.log('일정 저장 완료:', response);

      // 성공 시 마이페이지로 이동
      navigate('/users/mypage');
    } catch (error) {
      console.error('일정 저장 실패:', error);
      setSaveError('일정 저장에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSaving(false);
    }
  };

  // 여행 정보 요약 컴포넌트
  const TravelSummary = () => {
    if (!travelPlan) return null;

    return (
      <Card className="p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4 text-blue-900">
          여행 정보 요약
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">여행지</p>
            <p className="text-lg font-medium">{travelPlan.location}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">여행 기간</p>
            <p className="text-lg font-medium">
              {travelPlan.startDate?.toLocaleDateString('ko-KR')} ~{' '}
              {travelPlan.endDate?.toLocaleDateString('ko-KR')}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">동반자</p>
            <p className="text-lg font-medium">
              {travelPlan.companion || '미선택'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">여행 테마</p>
            <div className="flex flex-wrap gap-2">
              {travelPlan.themes.map((theme) => (
                <Badge key={theme} variant="secondary">
                  {theme}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </Card>
    );
  };

  // 일정 요약 컴포넌트
  const ScheduleSummary = () => {
    if (!scheduleList.length) return null;

    return (
      <Card className="p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4 text-blue-900">일정 요약</h3>
        <div className="space-y-4">
          {scheduleList.map((daySchedule, index) => (
            <div key={index} className="border-l-4 border-blue-200 pl-4">
              <h4 className="font-medium text-lg">
                {index + 1}일차 ({daySchedule.date.toLocaleDateString('ko-KR')})
              </h4>
              <div className="mt-2 space-y-2">
                {daySchedule.placeList.map((place, placeIndex) => (
                  <div key={placeIndex} className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">📍</span>
                    <span className="text-sm">{place.info.name}</span>
                  </div>
                ))}
                {daySchedule.accommodation && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">🏨</span>
                    <span className="text-sm">
                      {daySchedule.accommodation.name}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-900 mb-4">
            여행 일정 저장
          </h1>
          <p className="text-xl text-gray-600">
            완성된 여행 일정을 저장해주세요
          </p>
        </div>

        {/* 여행 정보 요약 */}
        <TravelSummary />

        {/* 일정 제목 입력 */}
        <Card className="p-6 mb-6">
          <h3 className="text-xl font-semibold mb-4 text-blue-900">
            일정 제목
          </h3>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="itineraryName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                이 여행의 제목을 입력해주세요
              </label>
              <Input
                id="itineraryName"
                type="text"
                value={itineraryName}
                onChange={(e) => setItineraryName(e.target.value)}
                placeholder="예: 제주도 3박 4일 가족여행"
                className="text-lg"
              />
            </div>
            {saveError && (
              <div className="text-red-500 text-sm">{saveError}</div>
            )}
          </div>
        </Card>

        {/* 일정 요약 */}
        <ScheduleSummary />

        {/* 버튼 영역 */}
        <div className="flex justify-center gap-4">
          <Link
            to="/journey/step3"
            state={{ travelPlan, scheduleList }}
            className="px-8 py-3 text-lg font-medium bg-gray-100 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
          >
            이전
          </Link>
          <Button
            onClick={handleSaveItinerary}
            disabled={!itineraryName.trim() || isSaving}
            className="px-8 py-3 text-lg font-medium bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {isSaving ? '저장 중...' : '일정 저장하기'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateScheduleStepFour;
