import { useEffect, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { TravelPlan } from '../step1/CreateScheduleStepOne';
import type { DaySchedule } from '../step2/CreateScheduleStepTwo';
import type { ItineraryCreateRequest, ItineraryItem } from '@/types/itinerary';
import { createItinerary } from '@/api/itinerary';
import { getUserInfo } from '@/api/auth';
import { format, parseISO } from 'date-fns';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import InputTime from '@/components/ui/TimeNumberInput';

const CreateScheduleStepFour = ({}) => {
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
      // startDate와 endDate의 시간을 startTime과 endTime으로 설정
      const adjustedTravelPlan = {
        ...state.travelPlan,
        startDate: (() => {
          if (!state.travelPlan.startDate) return null;
          const date = new Date(state.travelPlan.startDate);
          const [startHour, startMinute] = state.travelPlan.startTime
            .split(':')
            .map(Number);
          date.setHours(startHour, startMinute, 0, 0);
          return date;
        })(),
        endDate: (() => {
          if (!state.travelPlan.endDate) return null;
          const date = new Date(state.travelPlan.endDate);
          const [endHour, endMinute] = state.travelPlan.endTime
            .split(':')
            .map(Number);
          date.setHours(endHour, endMinute, 0, 0);
          return date;
        })(),
      };
      setTravelPlan(adjustedTravelPlan);

      if (state?.scheduleList) {
        const adjustedScheduleList = [...state.scheduleList];

        // 첫 번째 일정의 날짜를 startDate로 설정
        if (adjustedScheduleList.length > 0 && adjustedTravelPlan.startDate) {
          adjustedScheduleList[0].placeList[0].start_time = toKoreanISOString(
            new Date(adjustedTravelPlan.startDate),
          );
        }

        // 마지막 일정의 날짜를 endDate로 설정
        if (adjustedScheduleList.length > 0 && adjustedTravelPlan.endDate) {
          const lastIndex = adjustedScheduleList.length - 1;
          const lastPlaceIndex =
            adjustedScheduleList[lastIndex].placeList.length - 1;
          adjustedScheduleList[lastIndex].placeList[lastPlaceIndex].end_time =
            toKoreanISOString(new Date(adjustedTravelPlan.endDate));
        }

        setScheduleList(adjustedScheduleList);
      }
    }
  }, [location.state]);

  // 디버깅용;
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
        const startIso = buildIsoFromDateAndTime(
          daySchedule.date,
          format(placeItem.start_time ?? new Date(), 'HH:mm'),
        );
        const endIso = placeItem.end_time ?? null;

        items.push({
          place_id: placeItem.place_id,
          accommodation_id: null,
          start_time: startIso,
          end_time: endIso,
          is_required: placeItem.is_required,
        });
      });

      // 숙소 추가
      if (daySchedule.accommodation) {
        const accStartIso = buildIsoFromDateAndTime(
          daySchedule.date,
          format(daySchedule.date ?? new Date(), 'HH:mm'),
        );

        items.push({
          place_id: null,
          accommodation_id: daySchedule.accommodation.accommodation_id,
          start_time: accStartIso,
          end_time: null,
          is_required: true,
        });
      }
    });

    return items;
  };

  // date(일자) + HH:mm(로컬 시간) => ISO 문자열 생성 (로컬 시간대 유지)
  const buildIsoFromDateAndTime = (date: Date, hhmm: string): string => {
    const [h, m] = hhmm.split(':').map((v) => parseInt(v, 10));
    const d = new Date(date);
    d.setHours(h || 0, m || 0, 0, 0);
    return d.toISOString();
  };

  // 한국 시간을 그대로 유지하면서 ISO 형식으로 변환
  const toKoreanISOString = (date: Date | null): string => {
    if (!date) return '';
    // 한국 시간대 오프셋 계산 (UTC+9)
    const offset = 9 * 60; // 9시간을 분으로 변환
    const localTime = new Date(date.getTime() + offset * 60 * 1000);
    return localTime.toISOString().replace('.000', '');
  };

  const handleTimeChange = (
    index: number,
    placeIndex: number,
    time: string,
    field: 'start' | 'end',
  ) => {
    //date = Thu Oct 16 2025 00:00:00 GMT+0900 (한국 표준시)
    setScheduleList((prev) => {
      const newScheduleList = [...prev];
      let StringTime = '1970-01-01T00:00:00Z';
      if (field === 'start') {
        StringTime =
          newScheduleList[index].placeList[placeIndex].start_time ?? '';
      } else {
        StringTime =
          newScheduleList[index].placeList[placeIndex].end_time ?? '';
      }
      const date = parseISO(StringTime);
      date.setHours(
        Number(time.split(':')[0]),
        Number(time.split(':')[1]),
        0,
        0,
      );
      const KoreanISOString = toKoreanISOString(date);
      if (field === 'start') {
        newScheduleList[index].placeList[placeIndex].start_time =
          KoreanISOString;
      } else {
        newScheduleList[index].placeList[placeIndex].end_time = KoreanISOString;
      }
      return newScheduleList;
    });
  };

  const handleTimeValue = (StringTime: string) => {
    return StringTime.slice(11, 16);
  };

  const handleAccommodationTimeValue = (index: number) => {
    return format(scheduleList[index]?.date ?? new Date(), 'HH:mm');
  };

  const handleAccommodationTimeChange = (index: number, time: string) => {
    setScheduleList((prev) => {
      const newScheduleList = [...prev];
      newScheduleList[index].date.setHours(
        Number(time.split(':')[0]),
        Number(time.split(':')[1]),
      );
      return newScheduleList;
    });
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
        start_at: toKoreanISOString(travelPlan.startDate),
        end_at: toKoreanISOString(travelPlan.endDate),
        location: travelPlan.location,
        theme: travelPlan.themes.join(', '),
        items: convertToItineraryItems(),
        name: itineraryName,
      };

      await createItinerary(itineraryData);
      console.log('일정 저장 완료');

      // 성공 시 토스트 메시지 표시
      toast.success('일정이 성공적으로 저장되었습니다!', {
        position: 'top-center',
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        onClose: () => {
          // 토스트가 닫힌 후 마이페이지로 이동
          navigate('/mypage');
        },
      });
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
            <p className="text-sm text-gray-600">구성원</p>
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
                {daySchedule.placeList.map((place, placeIndex) => {
                  return (
                    <div key={placeIndex} className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">📍</span>
                      <span className="text-sm flex-1">{place.info.name}</span>
                      {/* 시작/종료 시간 입력 */}
                      <div className="flex items-center gap-6">
                        <div className="flex flex-col items-center">
                          <label className="text-xs text-gray-500 mb-1">
                            시작
                          </label>
                          <InputTime
                            initialTime={handleTimeValue(
                              scheduleList[index].placeList[placeIndex]
                                .start_time ?? '2025-10-14T00:00:00Z',
                            )}
                            onChange={(time) => {
                              handleTimeChange(
                                index,
                                placeIndex,
                                time,
                                'start',
                              );
                            }}
                          />
                        </div>
                        <div className="flex flex-col items-center">
                          <label className="text-xs text-gray-500 mb-1">
                            종료
                          </label>
                          <InputTime
                            initialTime={handleTimeValue(
                              scheduleList[index].placeList[placeIndex]
                                .end_time ?? '2025-10-14T00:00:00Z',
                            )}
                            onChange={(time) => {
                              handleTimeChange(index, placeIndex, time, 'end');
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
                {daySchedule.accommodation &&
                  (() => {
                    return (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">🏨</span>
                        <span className="text-sm flex-1">
                          {daySchedule.accommodation.name}
                        </span>
                        <div className="flex items-center gap-2">
                          <div className="flex flex-col items-center">
                            <label className="text-xs text-gray-500 mb-1">
                              체크인
                            </label>
                            <input
                              type="time"
                              value={handleAccommodationTimeValue(index)}
                              onChange={(e) => {
                                handleAccommodationTimeChange(
                                  index,
                                  e.target.value,
                                );
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })()}
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <ToastContainer />
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
              <input
                id="itineraryName"
                type="text"
                value={itineraryName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setItineraryName(e.target.value)
                }
                placeholder="예: 제주도 3박 4일 가족여행"
                className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
