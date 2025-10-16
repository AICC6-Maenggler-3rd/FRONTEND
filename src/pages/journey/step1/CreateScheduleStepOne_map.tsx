import { useState } from 'react';
import { Button } from '../../../components/ui/button';
import { Link } from 'react-router-dom';

// 여행 계획 타입 정의
export interface TravelPlan {
  location: string;
  startDate: Date | null;
  endDate: Date | null;
  startTime: string;
  endTime: string;
  companion: string | null;
  themes: string[];
  default_la: number;
  default_lo: number;
}

/**
 * 사용자 여행 선호도 설정 페이지 컴포넌트
 * 여행지 선택을 위한 UI를 제공하며, 사이드바를 통해 단계별 네비게이션을 지원
 */
const CreateScheduleStepOne = () => {
  // 선택된 여행지 상태 (기본값: '서울특별시')
  const [selectedLocation, setSelectedLocation] = useState('서울특별시');

  // 검색 입력 필드 상태 (현재 사용하지 않음)
  // const [searchInput, setSearchInput] = useState('');

  // 현재 화면 상태 (위치 선택, 날짜 선택, 시간 선택, 구성원 선택, 테마 선택)
  const [currentView, setCurrentView] = useState<
    'location' | 'date' | 'time' | 'companion' | 'theme'
  >('location');

  // 선택된 날짜 상태
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // 클릭 기반 날짜 범위 선택을 위한 상태
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [selectionStep, setSelectionStep] = useState<'start' | 'end'>('start'); // 'start' 또는 'end'

  // 시간 선택을 위한 상태
  const [startTime, setStartTime] = useState('09:00'); // 기본값: 오전 9시
  const [endTime, setEndTime] = useState('18:00'); // 기본값: 오후 6시

  // 구성원 선택을 위한 상태
  const [selectedCompanion, setSelectedCompanion] = useState<string | null>(
    null,
  );

  // 여행 테마 선택을 위한 상태 (다중 선택)
  const [selectedThemes, setSelectedThemes] = useState<string[]>([]);

  // 통합 여행 계획 상태
  const [travelPlan, setTravelPlan] = useState<TravelPlan>({
    location: '서울특별시',
    startDate: null,
    endDate: null,
    startTime: '09:00',
    endTime: '18:00',
    companion: null,
    themes: [],
    default_la: 0,
    default_lo: 0,
  });

  // 현재 표시할 년월 상태
  const [currentMonth, setCurrentMonth] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth()),
  );

  // 선택 가능한 여행지 목록 (3x4 그리드로 표시)
  const locations = [
    '서울특별시',
    '부산광역시',
    '제주특별자치도',
    '인천광역시',
    '경상남도',
    '강원특별자치도',
    '전라남도',
    '전라북도',
    '광주광역시',
    '울산광역시',
    '충청남도',
    '충청북도',
    '대전광역시',
    '대구광역시',
    '세종특별자치시',
  ];

  // 선택 가능한 구성원 목록 (2x3 그리드로 표시)
  const companions = [
    '혼자서',
    '친구와',
    '연인과',
    '배우자와',
    '부모님과',
    '아이와',
  ];

  // 선택 가능한 여행 테마 목록 (3x3 그리드로 표시)
  const themes = [
    '액티비티',
    '자연',
    '바다',
    '등산',
    '쇼핑',
    '문화·예술',
    '관광',
    '먹방',
    '힐링',
  ];

  /**
   * 여행지 선택 핸들러
   * 사용자가 지역 버튼을 클릭했을 때 호출됨
   *
   * @param location - 선택된 여행지 이름
   */
  const handleLocationSelect = (location: string) => {
    setSelectedLocation(location);
    setTravelPlan((prev) => ({ ...prev, location }));
  };

  /**
   * 다음 단계로 이동하는 핸들러
   * 위치 선택 후 날짜 선택 화면으로 전환
   */
  const handleNext = () => {
    // 선택된 위치를 콘솔에 출력 (디버깅용)
    console.log('선택된 위치:', selectedLocation);

    // 날짜 선택 화면으로 전환
    setCurrentView('date');
  };

  /**
   * 이전 화면으로 돌아가는 핸들러
   * 날짜 선택에서 위치 선택으로 돌아감
   */
  const handlePrevious = () => {
    setCurrentView('location');
  };

  /**
   * 날짜 범위 선택 핸들러 (클릭 기반)
   *
   * @param date - 클릭된 날짜
   */
  const handleDateRangeSelect = (date: Date) => {
    if (selectionStep === 'start') {
      // 시작일 선택
      setStartDate(date);
      setEndDate(null);
      setSelectionStep('end');
      setTravelPlan((prev) => ({ ...prev, startDate: date, endDate: null }));
    } else {
      // 종료일 선택
      if (startDate && date < startDate) {
        // 종료일이 시작일보다 이전이면 순서 바꿈
        setEndDate(startDate);
        setStartDate(date);
        setTravelPlan((prev) => ({
          ...prev,
          startDate: date,
          endDate: startDate,
        }));
      } else {
        setEndDate(date);
        setTravelPlan((prev) => ({ ...prev, endDate: date }));
      }
      setSelectionStep('start'); // 다음 선택을 위해 시작일 선택 모드로
    }
  };

  /**
   * 날짜 범위 초기화 핸들러
   */
  const handleClearSelection = () => {
    setStartDate(null);
    setEndDate(null);
    setSelectedDate(null);
    setSelectionStep('start');
    setTravelPlan((prev) => ({ ...prev, startDate: null, endDate: null }));
  };

  /**
   * 날짜 선택 완료 후 시간 선택 화면으로 전환
   */
  const handleDateSelectionComplete = () => {
    if (startDate && endDate) {
      setCurrentView('time');
    }
  };

  /**
   * 시작 시간 변경 핸들러
   *
   * @param time - 선택된 시작 시간
   */
  const handleStartTimeChange = (time: string) => {
    setStartTime(time);
    setTravelPlan((prev) => ({ ...prev, startTime: time }));
  };

  /**
   * 종료 시간 변경 핸들러
   *
   * @param time - 선택된 종료 시간
   */
  const handleEndTimeChange = (time: string) => {
    setEndTime(time);
    setTravelPlan((prev) => ({ ...prev, endTime: time }));
  };

  /**
   * 시간 선택 완료 후 구성원 선택 화면으로 전환
   */
  const handleTimeSelectionComplete = () => {
    setCurrentView('companion');
  };

  /**
   * 구성원 선택 핸들러
   *
   * @param companion - 선택된 구성원
   */
  const handleCompanionSelect = (companion: string) => {
    setSelectedCompanion(companion);
    setTravelPlan((prev) => ({ ...prev, companion }));
  };

  /**
   * 구성원 선택 완료 후 테마 선택 화면으로 전환
   */
  const handleCompanionSelectionComplete = () => {
    setCurrentView('theme');
  };

  /**
   * 테마 선택 핸들러 (다중 선택)
   *
   * @param theme - 선택/해제할 테마
   */
  const handleThemeSelect = (theme: string) => {
    setSelectedThemes((prev) => {
      let newThemes;
      if (prev.includes(theme)) {
        // 이미 선택된 테마면 제거
        newThemes = prev.filter((t) => t !== theme);
      } else {
        // 선택되지 않은 테마면 추가
        newThemes = [...prev, theme];
      }
      // 여행 계획도 함께 업데이트
      setTravelPlan((plan) => ({ ...plan, themes: newThemes }));
      return newThemes;
    });
  };

  /**
   * 월 변경 핸들러
   *
   * @param direction - 변경 방향 ('prev' | 'next')
   */
  const handleMonthChange = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth);
    if (direction === 'prev') {
      newMonth.setMonth(newMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1);
    }
    setCurrentMonth(newMonth);
  };

  /**
   * 캘린더 렌더링 함수
   * 지정된 년월의 캘린더 데이터를 생성
   *
   * @param year - 년도
   * @param month - 월 (0-11)
   * @returns 캘린더 데이터 배열
   */
  const renderCalendar = (year: number, month: number) => {
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const calendar = [];
    const currentDate = new Date(startDate);

    // 6주 * 7일 = 42일
    for (let week = 0; week < 6; week++) {
      const weekDays = [];
      for (let day = 0; day < 7; day++) {
        weekDays.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }
      calendar.push(weekDays);
    }

    return calendar;
  };

  /**
   * 날짜가 현재 월에 속하는지 확인
   *
   * @param date - 확인할 날짜
   * @param currentMonth - 현재 월
   * @returns 현재 월에 속하는지 여부
   */
  const isCurrentMonth = (date: Date, currentMonth: Date) => {
    return (
      date.getMonth() === currentMonth.getMonth() &&
      date.getFullYear() === currentMonth.getFullYear()
    );
  };

  /**
   * 날짜가 선택된 날짜인지 확인
   *
   * @param date - 확인할 날짜
   * @returns 선택된 날짜인지 여부
   */
  const isSelectedDate = (date: Date) => {
    if (!selectedDate) return false;
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  /**
   * 날짜가 선택된 범위에 속하는지 확인
   *
   * @param date - 확인할 날짜
   * @returns 선택된 범위에 속하는지 여부
   */
  const isInSelectedRange = (date: Date) => {
    if (!startDate || !endDate) return false;

    const dateTime = date.getTime();
    const startTime = startDate.getTime();
    const endTime = endDate.getTime();

    return dateTime >= startTime && dateTime <= endTime;
  };

  /**
   * 날짜가 선택된 범위의 시작 날짜인지 확인
   *
   * @param date - 확인할 날짜
   * @returns 시작 날짜인지 여부
   */
  const isStartDate = (date: Date) => {
    if (!startDate) return false;
    return (
      date.getDate() === startDate.getDate() &&
      date.getMonth() === startDate.getMonth() &&
      date.getFullYear() === startDate.getFullYear()
    );
  };

  /**
   * 날짜가 선택된 범위의 종료 날짜인지 확인
   *
   * @param date - 확인할 날짜
   * @returns 종료 날짜인지 여부
   */
  const isEndDate = (date: Date) => {
    if (!endDate) return false;
    return (
      date.getDate() === endDate.getDate() &&
      date.getMonth() === endDate.getMonth() &&
      date.getFullYear() === endDate.getFullYear()
    );
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8">
      {currentView === 'location' ? (
        /* 위치 선택 화면 */
        <div className="w-full max-w-2xl">
          {/* 페이지 제목 및 질문 */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-blue-900 mb-4">위치</h1>
            <p className="text-xl text-blue-900">어디로 가시나요?</p>
          </div>

          {/* 한국 지도와 지역 선택 */}
          <div className="mb-8">
            <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  지역을 선택해주세요
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  지도에서 원하는 지역을 클릭하거나 아래 목록에서 선택하세요
                </p>
              </div>

              {/* 한국 지도 SVG */}
              <div
                className="flex justify-center mb-6 bg-cover bg-center w-full h-full"
                style={{
                  backgroundImage: "url('/image/korea.jpg')",
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  width: '100%',
                }}
              >
                <svg viewBox="0 0 400 500" className="w-full h-full">
                  {/* 지역별 클릭 가능한 영역들 */}
                  {/* 서울 */}
                  <circle
                    cx="145"
                    cy="125"
                    r="1"
                    fill={
                      selectedLocation === '서울특별시' ? '#3b82f6' : '#e2e8f0'
                    }
                    stroke={
                      selectedLocation === '서울특별시' ? '#1d4ed8' : '#94a3b8'
                    }
                    strokeWidth="2"
                    className="cursor-pointer hover:fill-blue-300 transition-colors"
                    onClick={() => handleLocationSelect('서울특별시')}
                  />
                  <text
                    x="145"
                    y="130"
                    textAnchor="middle"
                    className="text-xs font-semibold fill- pointer-events-none "
                  >
                    서울
                  </text>

                  {/* 부산 */}
                  <circle
                    cx="320"
                    cy="350"
                    r="15"
                    fill={
                      selectedLocation === '부산광역시' ? '#3b82f6' : '#e2e8f0'
                    }
                    stroke={
                      selectedLocation === '부산광역시' ? '#1d4ed8' : '#94a3b8'
                    }
                    strokeWidth="2"
                    className="cursor-pointer hover:fill-blue-300 transition-colors"
                    onClick={() => handleLocationSelect('부산광역시')}
                  />
                  <text
                    x="320"
                    y="355"
                    textAnchor="middle"
                    className="text-xs font-semibold fill-white pointer-events-none"
                  >
                    부산
                  </text>

                  {/* 제주 */}
                  <circle
                    cx="180"
                    cy="420"
                    r="12"
                    fill={
                      selectedLocation === '제주특별자치도'
                        ? '#3b82f6'
                        : '#e2e8f0'
                    }
                    stroke={
                      selectedLocation === '제주특별자치도'
                        ? '#1d4ed8'
                        : '#94a3b8'
                    }
                    strokeWidth="2"
                    className="cursor-pointer hover:fill-blue-300 transition-colors"
                    onClick={() => handleLocationSelect('제주특별자치도')}
                  />
                  <text
                    x="180"
                    y="425"
                    textAnchor="middle"
                    className="text-xs font-semibold fill-white pointer-events-none"
                  >
                    제주
                  </text>

                  {/* 인천 */}
                  <circle
                    cx="180"
                    cy="100"
                    r="12"
                    fill={
                      selectedLocation === '인천광역시' ? '#3b82f6' : '#e2e8f0'
                    }
                    stroke={
                      selectedLocation === '인천광역시' ? '#1d4ed8' : '#94a3b8'
                    }
                    strokeWidth="2"
                    className="cursor-pointer hover:fill-blue-300 transition-colors"
                    onClick={() => handleLocationSelect('인천광역시')}
                  />
                  <text
                    x="180"
                    y="105"
                    textAnchor="middle"
                    className="text-xs font-semibold fill-white pointer-events-none"
                  >
                    인천
                  </text>

                  {/* 경상남도 */}
                  <circle
                    cx="300"
                    cy="320"
                    r="12"
                    fill={
                      selectedLocation === '경상남도' ? '#3b82f6' : '#e2e8f0'
                    }
                    stroke={
                      selectedLocation === '경상남도' ? '#1d4ed8' : '#94a3b8'
                    }
                    strokeWidth="2"
                    className="cursor-pointer hover:fill-blue-300 transition-colors"
                    onClick={() => handleLocationSelect('경상남도')}
                  />
                  <text
                    x="300"
                    y="325"
                    textAnchor="middle"
                    className="text-xs font-semibold fill-white pointer-events-none"
                  >
                    경남
                  </text>

                  {/* 강원특별자치도 */}
                  <circle
                    cx="220"
                    cy="160"
                    r="12"
                    fill={
                      selectedLocation === '강원특별자치도'
                        ? '#3b82f6'
                        : '#e2e8f0'
                    }
                    stroke={
                      selectedLocation === '강원특별자치도'
                        ? '#1d4ed8'
                        : '#94a3b8'
                    }
                    strokeWidth="2"
                    className="cursor-pointer hover:fill-blue-300 transition-colors"
                    onClick={() => handleLocationSelect('강원특별자치도')}
                  />
                  <text
                    x="220"
                    y="165"
                    textAnchor="middle"
                    className="text-xs font-semibold fill-white pointer-events-none"
                  >
                    강원
                  </text>

                  {/* 전라남도 */}
                  <circle
                    cx="180"
                    cy="350"
                    r="12"
                    fill={
                      selectedLocation === '전라남도' ? '#3b82f6' : '#e2e8f0'
                    }
                    stroke={
                      selectedLocation === '전라남도' ? '#1d4ed8' : '#94a3b8'
                    }
                    strokeWidth="2"
                    className="cursor-pointer hover:fill-blue-300 transition-colors"
                    onClick={() => handleLocationSelect('전라남도')}
                  />
                  <text
                    x="180"
                    y="355"
                    textAnchor="middle"
                    className="text-xs font-semibold fill-white pointer-events-none"
                  >
                    전남
                  </text>

                  {/* 전라북도 */}
                  <circle
                    cx="200"
                    cy="320"
                    r="12"
                    fill={
                      selectedLocation === '전라북도' ? '#3b82f6' : '#e2e8f0'
                    }
                    stroke={
                      selectedLocation === '전라북도' ? '#1d4ed8' : '#94a3b8'
                    }
                    strokeWidth="2"
                    className="cursor-pointer hover:fill-blue-300 transition-colors"
                    onClick={() => handleLocationSelect('전라북도')}
                  />
                  <text
                    x="200"
                    y="325"
                    textAnchor="middle"
                    className="text-xs font-semibold fill-white pointer-events-none"
                  >
                    전북
                  </text>

                  {/* 광주 */}
                  <circle
                    cx="160"
                    cy="340"
                    r="10"
                    fill={
                      selectedLocation === '광주광역시' ? '#3b82f6' : '#e2e8f0'
                    }
                    stroke={
                      selectedLocation === '광주광역시' ? '#1d4ed8' : '#94a3b8'
                    }
                    strokeWidth="2"
                    className="cursor-pointer hover:fill-blue-300 transition-colors"
                    onClick={() => handleLocationSelect('광주광역시')}
                  />
                  <text
                    x="160"
                    y="345"
                    textAnchor="middle"
                    className="text-xs font-semibold fill-white pointer-events-none"
                  >
                    광주
                  </text>

                  {/* 울산 */}
                  <circle
                    cx="340"
                    cy="330"
                    r="10"
                    fill={
                      selectedLocation === '울산광역시' ? '#3b82f6' : '#e2e8f0'
                    }
                    stroke={
                      selectedLocation === '울산광역시' ? '#1d4ed8' : '#94a3b8'
                    }
                    strokeWidth="2"
                    className="cursor-pointer hover:fill-blue-300 transition-colors"
                    onClick={() => handleLocationSelect('울산광역시')}
                  />
                  <text
                    x="340"
                    y="335"
                    textAnchor="middle"
                    className="text-xs font-semibold fill-white pointer-events-none"
                  >
                    울산
                  </text>

                  {/* 충청남도 */}
                  <circle
                    cx="200"
                    cy="260"
                    r="12"
                    fill={
                      selectedLocation === '충청남도' ? '#3b82f6' : '#e2e8f0'
                    }
                    stroke={
                      selectedLocation === '충청남도' ? '#1d4ed8' : '#94a3b8'
                    }
                    strokeWidth="2"
                    className="cursor-pointer hover:fill-blue-300 transition-colors"
                    onClick={() => handleLocationSelect('충청남도')}
                  />
                  <text
                    x="200"
                    y="265"
                    textAnchor="middle"
                    className="text-xs font-semibold fill-white pointer-events-none"
                  >
                    충남
                  </text>

                  {/* 충청북도 */}
                  <circle
                    cx="220"
                    cy="220"
                    r="12"
                    fill={
                      selectedLocation === '충청북도' ? '#3b82f6' : '#e2e8f0'
                    }
                    stroke={
                      selectedLocation === '충청북도' ? '#1d4ed8' : '#94a3b8'
                    }
                    strokeWidth="2"
                    className="cursor-pointer hover:fill-blue-300 transition-colors"
                    onClick={() => handleLocationSelect('충청북도')}
                  />
                  <text
                    x="220"
                    y="225"
                    textAnchor="middle"
                    className="text-xs font-semibold fill-white pointer-events-none"
                  >
                    충북
                  </text>

                  {/* 대전 */}
                  <circle
                    cx="210"
                    cy="250"
                    r="10"
                    fill={
                      selectedLocation === '대전광역시' ? '#3b82f6' : '#e2e8f0'
                    }
                    stroke={
                      selectedLocation === '대전광역시' ? '#1d4ed8' : '#94a3b8'
                    }
                    strokeWidth="2"
                    className="cursor-pointer hover:fill-blue-300 transition-colors"
                    onClick={() => handleLocationSelect('대전광역시')}
                  />
                  <text
                    x="210"
                    y="255"
                    textAnchor="middle"
                    className="text-xs font-semibold fill-white pointer-events-none"
                  >
                    대전
                  </text>

                  {/* 대구 */}
                  <circle
                    cx="280"
                    cy="280"
                    r="12"
                    fill={
                      selectedLocation === '대구광역시' ? '#3b82f6' : '#e2e8f0'
                    }
                    stroke={
                      selectedLocation === '대구광역시' ? '#1d4ed8' : '#94a3b8'
                    }
                    strokeWidth="2"
                    className="cursor-pointer hover:fill-blue-300 transition-colors"
                    onClick={() => handleLocationSelect('대구광역시')}
                  />
                  <text
                    x="280"
                    y="285"
                    textAnchor="middle"
                    className="text-xs font-semibold fill-white pointer-events-none"
                  >
                    대구
                  </text>

                  {/* 세종 */}
                  <circle
                    cx="190"
                    cy="240"
                    r="8"
                    fill={
                      selectedLocation === '세종특별자치시'
                        ? '#3b82f6'
                        : '#e2e8f0'
                    }
                    stroke={
                      selectedLocation === '세종특별자치시'
                        ? '#1d4ed8'
                        : '#94a3b8'
                    }
                    strokeWidth="2"
                    className="cursor-pointer hover:fill-blue-300 transition-colors"
                    onClick={() => handleLocationSelect('세종특별자치시')}
                  />
                  <text
                    x="190"
                    y="245"
                    textAnchor="middle"
                    className="text-xs font-semibold fill-white pointer-events-none"
                  >
                    세종
                  </text>
                </svg>
              </div>

              {/* 선택된 지역 표시 */}
              {selectedLocation && (
                <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-blue-700 font-medium">
                    선택된 지역:{' '}
                    <span className="font-bold">{selectedLocation}</span>
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* 다음 단계로 이동하는 버튼 */}
          <div className="text-center">
            <Button
              onClick={handleNext}
              className="px-12 py-4 text-lg font-semibold bg-gradient-to-r from-blue-400 to-blue-500 text-white rounded-lg shadow-lg hover:from-blue-500 hover:to-blue-600 transition-all duration-200"
            >
              다음
            </Button>
          </div>
        </div>
      ) : currentView === 'date' ? (
        /* 날짜 선택 화면 */
        <div className="w-full max-w-4xl">
          {/* 페이지 제목 및 질문 */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-blue-900 mb-4">날짜</h1>
            <p className="text-xl text-blue-900">언제 가시나요?</p>

            {/* 선택 단계 안내 */}
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              📅 시작일과 종료일을 선택해주세요
            </div>
          </div>

          {/* 캘린더 컨테이너 */}
          <div className="flex gap-8 justify-center">
            {/* 첫 번째 캘린더 (현재 월) */}
            <div className="w-80">
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => handleMonthChange('prev')}
                  className="text-2xl text-gray-600 hover:text-gray-800"
                >
                  &lt;
                </button>
                <h2 className="text-xl font-semibold text-gray-800">
                  {currentMonth.getFullYear()}년 {currentMonth.getMonth() + 1}월
                </h2>
                <button
                  onClick={() => handleMonthChange('next')}
                  className="text-2xl text-gray-600 hover:text-gray-800"
                >
                  &gt;
                </button>
              </div>

              {/* 요일 헤더 */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
                  <div
                    key={day}
                    className="text-center text-sm font-medium text-gray-500 py-2"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* 캘린더 날짜 */}
              <div className="grid grid-cols-7 gap-1">
                {renderCalendar(
                  currentMonth.getFullYear(),
                  currentMonth.getMonth(),
                ).map((week, weekIndex) =>
                  week.map((date, dayIndex) => {
                    const isCurrentMonthDate = isCurrentMonth(
                      date,
                      currentMonth,
                    );
                    const isSelected = isSelectedDate(date);
                    const isInRange = isInSelectedRange(date);
                    const isStart = isStartDate(date);
                    const isEnd = isEndDate(date);
                    const isSunday = dayIndex === 0;
                    const isSaturday = dayIndex === 6;

                    return (
                      <button
                        key={`${weekIndex}-${dayIndex}`}
                        onClick={() => handleDateRangeSelect(date)}
                        className={`w-10 h-10 text-sm rounded transition-colors select-none ${
                          isStart || isEnd
                            ? 'bg-blue-600 text-white font-bold' // 시작/종료 날짜: 파란 배경, 흰 텍스트
                            : isInRange
                              ? 'bg-blue-100 text-blue-800' // 범위 내 날짜: 연한 파란 배경, 파란 텍스트
                              : isSelected
                                ? 'bg-black text-white' // 단일 선택된 날짜: 검은 배경, 흰 텍스트
                                : isCurrentMonthDate
                                  ? isSunday
                                    ? 'text-red-500 hover:bg-red-50' // 일요일: 빨간 텍스트
                                    : isSaturday
                                      ? 'text-teal-500 hover:bg-teal-50' // 토요일: 청록 텍스트
                                      : 'text-gray-700 hover:bg-gray-100' // 평일: 회색 텍스트
                                  : 'text-gray-300' // 다른 월의 날짜: 연한 회색
                        }`}
                      >
                        {date.getDate()}
                      </button>
                    );
                  }),
                )}
              </div>
            </div>

            {/* 두 번째 캘린더 (다음 월) */}
            <div className="w-80">
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => {
                    const nextMonth = new Date(currentMonth);
                    nextMonth.setMonth(nextMonth.getMonth() - 1);
                    setCurrentMonth(nextMonth);
                  }}
                  className="text-2xl text-gray-600 hover:text-gray-800"
                >
                  &lt;
                </button>
                <h2 className="text-xl font-semibold text-gray-800">
                  {currentMonth.getFullYear()}년 {currentMonth.getMonth() + 2}월
                </h2>
                <button
                  onClick={() => {
                    const nextMonth = new Date(currentMonth);
                    nextMonth.setMonth(nextMonth.getMonth() + 1);
                    setCurrentMonth(nextMonth);
                  }}
                  className="text-2xl text-gray-600 hover:text-gray-800"
                >
                  &gt;
                </button>
              </div>

              {/* 요일 헤더 */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
                  <div
                    key={day}
                    className="text-center text-sm font-medium text-gray-500 py-2"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* 캘린더 날짜 */}
              <div className="grid grid-cols-7 gap-1">
                {renderCalendar(
                  currentMonth.getFullYear(),
                  currentMonth.getMonth() + 1,
                ).map((week, weekIndex) =>
                  week.map((date, dayIndex) => {
                    const isCurrentMonthDate = isCurrentMonth(
                      date,
                      new Date(
                        currentMonth.getFullYear(),
                        currentMonth.getMonth() + 1,
                      ),
                    );
                    const isSelected = isSelectedDate(date);
                    const isInRange = isInSelectedRange(date);
                    const isStart = isStartDate(date);
                    const isEnd = isEndDate(date);
                    const isSunday = dayIndex === 0;
                    const isSaturday = dayIndex === 6;

                    return (
                      <button
                        key={`${weekIndex}-${dayIndex}`}
                        onClick={() => handleDateRangeSelect(date)}
                        className={`w-10 h-10 text-sm rounded transition-colors select-none ${
                          isStart || isEnd
                            ? 'bg-blue-600 text-white font-bold' // 시작/종료 날짜: 파란 배경, 흰 텍스트
                            : isInRange
                              ? 'bg-blue-100 text-blue-800' // 범위 내 날짜: 연한 파란 배경, 파란 텍스트
                              : isSelected
                                ? 'bg-black text-white' // 단일 선택된 날짜: 검은 배경, 흰 텍스트
                                : isCurrentMonthDate
                                  ? isSunday
                                    ? 'text-red-500 hover:bg-red-50' // 일요일: 빨간 텍스트
                                    : isSaturday
                                      ? 'text-teal-500 hover:bg-teal-50' // 토요일: 청록 텍스트
                                      : 'text-gray-700 hover:bg-gray-100' // 평일: 회색 텍스트
                                  : 'text-gray-300' // 다른 월의 날짜: 연한 회색
                        }`}
                      >
                        {date.getDate()}
                      </button>
                    );
                  }),
                )}
              </div>
            </div>
          </div>

          {/* 선택된 날짜 범위 표시 */}
          {startDate && endDate && (
            <div className="text-center mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-lg font-medium text-blue-800 mb-2">
                선택된 기간
              </p>
              <p className="text-blue-600">
                {startDate.toLocaleDateString('ko-KR')} ~{' '}
                {endDate.toLocaleDateString('ko-KR')}
              </p>
              <p className="text-sm text-blue-500 mt-1">
                총{' '}
                {Math.ceil(
                  (endDate.getTime() - startDate.getTime()) /
                    (1000 * 60 * 60 * 24),
                ) + 1}
                일
              </p>
            </div>
          )}

          {/* 선택 버튼 */}
          <div className="text-center mt-8">
            <div className="flex gap-4 justify-center">
              <Button
                onClick={handleClearSelection}
                className="px-6 py-3 text-lg font-medium bg-gray-100 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
              >
                초기화
              </Button>
              {startDate && endDate && (
                <Button
                  onClick={handleDateSelectionComplete}
                  className="px-8 py-3 text-lg font-medium bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  시간 선택하기
                </Button>
              )}
            </div>
          </div>

          {/* 하단 네비게이션 버튼 */}
          <div className="flex justify-center gap-4 mt-8">
            <Button
              onClick={handlePrevious}
              className="px-12 py-4 text-lg font-semibold bg-gradient-to-r from-blue-400 to-blue-500 text-white rounded-lg shadow-lg hover:from-blue-500 hover:to-blue-600 transition-all duration-200"
            >
              이전
            </Button>
          </div>
        </div>
      ) : currentView === 'time' ? (
        /* 시간 선택 화면 */
        <div className="w-full max-w-2xl">
          {/* 페이지 제목 및 질문 */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-blue-900 mb-4">시간</h1>
            <p className="text-xl text-blue-900">
              몇 시에 출발하고 돌아오시나요?
            </p>

            {/* 선택된 날짜 표시 */}
            {startDate && endDate && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-blue-700 font-medium mb-2">
                  선택된 여행 기간
                </p>
                <p className="text-blue-600">
                  {startDate.toLocaleDateString('ko-KR')} ~{' '}
                  {endDate.toLocaleDateString('ko-KR')}
                </p>
              </div>
            )}
          </div>

          {/* 시간 선택 폼 */}
          <div className="space-y-8">
            {/* 시작 시간 선택 */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                🚀 출발 시간
              </h3>
              <div className="flex items-center gap-4">
                <label className="text-gray-700 font-medium">시작일:</label>
                <span className="text-blue-600 font-semibold">
                  {startDate?.toLocaleDateString('ko-KR')}
                </span>
              </div>
              <div className="mt-4">
                <label className="block text-gray-700 font-medium mb-2">
                  시간을 선택해주세요
                </label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => handleStartTimeChange(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                />
              </div>
            </div>

            {/* 종료 시간 선택 */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                🏠 돌아오는 시간
              </h3>
              <div className="flex items-center gap-4">
                <label className="text-gray-700 font-medium">종료일:</label>
                <span className="text-blue-600 font-semibold">
                  {endDate?.toLocaleDateString('ko-KR')}
                </span>
              </div>
              <div className="mt-4">
                <label className="block text-gray-700 font-medium mb-2">
                  시간을 선택해주세요
                </label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => handleEndTimeChange(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                />
              </div>
            </div>
          </div>

          {/* 선택 버튼 */}
          <div className="text-center mt-8">
            <div className="flex gap-4 justify-center">
              <Button
                onClick={() => setCurrentView('date')}
                className="px-8 py-3 text-lg font-medium bg-gray-100 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
              >
                이전
              </Button>
              <Button
                onClick={handleTimeSelectionComplete}
                className="px-8 py-3 text-lg font-medium bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                다음
              </Button>
            </div>
          </div>
        </div>
      ) : currentView === 'companion' ? (
        /* 구성원 선택 화면 */
        <div className="w-full max-w-2xl">
          {/* 페이지 제목 및 질문 */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-blue-900 mb-4">구성원</h1>
            <p className="text-xl text-blue-900">누구와 함께 가시나요?</p>
          </div>

          {/* 구성원 선택 버튼 그리드 (2x3 레이아웃) */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {companions.map((companion) => (
              <button
                key={companion}
                onClick={() => handleCompanionSelect(companion)}
                className={`px-4 py-3 rounded-lg text-lg font-medium transition-colors ${
                  selectedCompanion === companion
                    ? 'bg-gray-600 text-white' // 선택된 구성원: 회색 배경, 흰 텍스트
                    : 'bg-gray-100 text-blue-900 hover:bg-gray-200' // 미선택 구성원: 연한 회색 배경, 파란 텍스트
                }`}
              >
                {companion}
              </button>
            ))}
          </div>

          {/* 선택 버튼 */}
          <div className="text-center mt-8">
            <div className="flex gap-4 justify-center">
              <Button
                onClick={() => setCurrentView('time')}
                className="px-8 py-3 text-lg font-medium bg-gray-100 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
              >
                이전
              </Button>
              {selectedCompanion && (
                <Button
                  onClick={handleCompanionSelectionComplete}
                  className="px-8 py-3 text-lg font-medium bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  다음
                </Button>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* 여행 테마 선택 화면 */
        <div className="w-full max-w-2xl">
          {/* 페이지 제목 및 질문 */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-blue-900 mb-4">여행 테마</h1>
            <p className="text-xl text-blue-900">무엇을 하고 싶으시나요?</p>

            {/* 선택된 테마 개수 표시 */}
            {selectedThemes.length > 0 && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-blue-700 font-medium">
                  {selectedThemes.length}개의 테마가 선택되었습니다
                </p>
                <p className="text-sm text-blue-600 mt-1">
                  {selectedThemes.join(', ')}
                </p>
              </div>
            )}
          </div>

          {/* 테마 선택 버튼 그리드 (3x3 레이아웃) */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {themes.map((theme) => (
              <button
                key={theme}
                onClick={() => handleThemeSelect(theme)}
                className={`px-4 py-3 rounded-lg text-lg font-medium transition-colors ${
                  selectedThemes.includes(theme)
                    ? 'bg-gray-600 text-white' // 선택된 테마: 회색 배경, 흰 텍스트
                    : 'bg-gray-100 text-blue-900 hover:bg-gray-200' // 미선택 테마: 연한 회색 배경, 파란 텍스트
                }`}
              >
                {theme}
              </button>
            ))}
          </div>

          {/* 선택 버튼 */}
          <div className="text-center mt-8">
            <div className="flex gap-4 justify-center">
              <Button
                onClick={() => setCurrentView('companion')}
                className="px-8 py-3 text-lg font-medium bg-gray-100 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
              >
                이전
              </Button>
              {selectedThemes.length > 0 && (
                <Link
                  to="/journey/step3"
                  state={{ travelPlan }}
                  className="px-8 py-3 text-lg font-medium bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  완료
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateScheduleStepOne;
