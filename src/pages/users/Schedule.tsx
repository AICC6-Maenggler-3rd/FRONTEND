import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getUserInfo } from '@/api/auth';
import { getItineraryDetail, deleteItinerary } from '@/api/itinerary';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface ItineraryItem {
  item_id: number;
  start_time: string;
  end_time?: string;
  item_type: 'place' | 'accommodation';
  data: {
    start_time: string;
    end_time?: string;
    info: {
      name: string;
      address?: string;
      type?: string;
    };
  };
}

interface ItineraryResponse {
  itinerary_id: number;
  location: string;
  theme?: string;
  start_at: string;
  end_at: string;
  relation?: string;
  user_id?: number;
  items: ItineraryItem[];
  name: string;
}

export default function ScheduleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [itinerary, setItinerary] = useState<ItineraryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchItinerary = async () => {
      try {
        // ✅ 로그인한 사용자 정보 가져오기
        const userData = await getUserInfo();

        // user_id가 존재할 때만 API 요청
        if (userData?.user?.id) {
          const data = await getItineraryDetail(Number(id));
          console.log('🔍 API 응답 데이터:', data);
          console.log('🔍 itinerary 데이터:', data.itinerary);
          console.log('🔍 items 데이터:', data.itinerary?.items);
          // API 응답 구조에 맞게 데이터 설정
          setItinerary(data.itinerary);
        } else {
          console.error('❌ 로그인된 사용자 정보를 가져오지 못했습니다.');
        }
      } catch (error) {
        console.error('❌ 일정 데이터를 불러오지 못했습니다:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchItinerary();
  }, [id]);

  // 날짜별로 일정 묶기
  const groupedByDay: Record<string, ItineraryItem[]> = {};

  const getActivityTypeColor = (type?: string) => {
    switch (type) {
      case '식사':
        return 'bg-orange-100 text-orange-800';
      case '숙박':
        return 'bg-purple-100 text-purple-800';
      case '관광':
        return 'bg-blue-100 text-blue-800';
      case '교통':
        return 'bg-blue-50 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // 일정 수정 페이지로 이동
  const handleEditSchedule = () => {
    if (id) {
      navigate(`/schedule/edit/${id}`);
    } else {
      // 추후 토스트 알림 추가 예정
    }
  };

  // 일정 삭제 확인 모달 표시
  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  // 일정 삭제 실행
  const handleDeleteConfirm = async () => {
    if (!id) return;

    setIsDeleting(true);
    try {
      await deleteItinerary(Number(id));
      toast.success('일정이 삭제되었습니다.', {
        position: 'top-center',
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        onClose: () => {
          navigate('/mypage');
        },
      });
    } catch (error) {
      console.error('일정 삭제 실패:', error);
      toast.error('일정 삭제에 실패했습니다.', {
        position: 'top-center',
        autoClose: 2000,
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  // 삭제 취소
  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-muted-foreground">
        일정 데이터를 불러오는 중입니다...
      </div>
    );

  if (!itinerary)
    return (
      <div className="flex flex-col justify-center items-center h-screen text-red-500">
        일정 데이터를 찾을 수 없습니다.
        <Link
          to="/mypage"
          className="mt-4 px-4 py-2 border rounded-md hover:bg-gray-50"
        >
          마이페이지로 돌아가기
        </Link>
      </div>
    );

  console.log('🔍 itinerary 객체:', itinerary);
  console.log('🔍 itinerary.items:', itinerary.items);

  if (itinerary.items && Array.isArray(itinerary.items)) {
    itinerary.items.forEach((item, index) => {
      console.log(`🔍 아이템 ${index}:`, item);
      console.log(
        `🔍 item.start_time:`,
        item.start_time,
        typeof item.start_time,
      );
      console.log(
        `🔍 item.data.start_time:`,
        item.data?.start_time,
        typeof item.data?.start_time,
      );

      // start_time이 존재하는 경우에만 처리 (item.data.start_time에서 가져오기)
      const startTime = item.data?.start_time || item.start_time;
      if (startTime) {
        const dateKey = startTime.split('T')[0];
        if (!groupedByDay[dateKey]) groupedByDay[dateKey] = [];
        groupedByDay[dateKey].push(item);
        console.log(
          `🔍 아이템 추가: ${dateKey}에 ${item.data?.info?.name || '장소 정보 없음'} 추가`,
        );
      } else {
        console.log(`⚠️ 아이템 ${index}의 start_time이 없습니다:`, startTime);
      }
    });
    console.log('🔍 최종 groupedByDay:', groupedByDay);
  } else {
    console.warn('⚠️ itinerary.items가 배열이 아닙니다:', itinerary.items);
  }

  // 여행 정보 요약 컴포넌트
  const TravelSummary = () => {
    if (!itinerary) return null;
    return (
      <Card className="p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4 text-blue-900">
          ℹ️ 여행 정보 요약
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">여행지</p>
            <p className="text-lg font-medium">{itinerary.location}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">여행 기간</p>
            <p className="text-lg font-medium">
              {new Date(itinerary.start_at).toLocaleDateString('ko-KR')} ~{' '}
              {new Date(itinerary.end_at).toLocaleDateString('ko-KR')}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">동반자</p>
            <p className="text-lg font-medium">
              {itinerary.relation || '미선택'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-2">여행 테마</p>
            <div className="flex flex-wrap gap-2">
              {itinerary.theme ? (
                <Badge variant="secondary">{itinerary.theme}</Badge>
              ) : (
                <span className="text-sm text-gray-500">미선택</span>
              )}
            </div>
          </div>
        </div>
      </Card>
    );
  };

  // 일정 요약 컴포넌트
  const ScheduleSummary = () => {
    if (!Object.keys(groupedByDay).length) return null;

    return (
      <Card className="p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4 text-blue-900">일정 요약</h3>
        <div className="space-y-4">
          {Object.entries(groupedByDay).map(([date, items], index) => (
            <div key={date} className="border-l-4 border-blue-200 pl-4">
              <h4 className="font-medium text-lg">
                {index + 1}일차 ({new Date(date).toLocaleDateString('ko-KR')})
              </h4>
              <div className="mt-2 space-y-2">
                {items.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">
                      {item.item_type === 'accommodation' ? '🏨' : '📍'}
                    </span>
                    <span className="text-sm">
                      {item.data.info?.name || '장소 정보 없음'}
                    </span>
                    <span className="text-xs text-gray-400">
                      {(() => {
                        const startTime =
                          item.data?.start_time || item.start_time;
                        const endTime = item.data?.end_time || item.end_time;

                        if (!startTime) return '시간 미정';

                        const startTimeStr = new Date(
                          startTime,
                        ).toLocaleTimeString('ko-KR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        });

                        if (endTime) {
                          const endTimeStr = new Date(
                            endTime,
                          ).toLocaleTimeString('ko-KR', {
                            hour: '2-digit',
                            minute: '2-digit',
                          });
                          return `${startTimeStr} ~ ${endTimeStr}`;
                        }

                        return startTimeStr;
                      })()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  };

  return (
    <div className="min-h-screen py-8">
      <ToastContainer />
      <div className="max-w-4xl mx-auto px-4">
        {/* 헤더 */}
        <div className="text-center mt-10 mb-20">
          <h1 className="text-4xl font-bold text-blue-900 mb-4">
            {itinerary.name || '여행 일정'}
          </h1>
          <p className="text-lg text-gray-600">
            상세한 여행 일정을 확인해 보세요.
          </p>
        </div>

        {/* 뒤로가기 버튼과 액션 버튼들 */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            to="/mypage"
            className="inline-flex items-center text-sm text-blue-700 hover:text-blue-800 transition-colors"
          >
            ← 마이페이지로 돌아가기
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={handleEditSchedule}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors"
            >
              ✏️ 일정 수정
            </button>
            <button
              onClick={handleDeleteClick}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-black bg-white border border-red-500 rounded-lg hover:bg-red-500 hover:border-red-200 transition-colors"
            >
              🗑️ 일정 삭제
            </button>
          </div>
        </div>

        {/* 여행 정보 요약 */}
        <TravelSummary />

        {/* 일정 요약 */}
        <ScheduleSummary />

        {/* 상세 일정 */}
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4 text-blue-900">
            상세 일정
          </h3>
          <div className="space-y-6">
            {Object.entries(groupedByDay).map(([date, items], idx) => (
              <div key={date} className="border rounded-lg p-4">
                <h4 className="text-lg font-semibold mb-4 text-gray-800">
                  📅 Day {idx + 1} -{' '}
                  {new Date(date).toLocaleDateString('ko-KR')}
                </h4>
                <div className="space-y-3">
                  {items.map((item) => (
                    <div
                      key={item.item_id}
                      className="flex items-start justify-between p-4 bg-white border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start gap-4 flex-1">
                        <div className="text-sm font-mono text-gray-500 min-w-[60px]">
                          {(() => {
                            const startTime =
                              item.data?.start_time || item.start_time;
                            const endTime =
                              item.data?.end_time || item.end_time;

                            if (!startTime) return <span>시간 미정</span>;

                            const startTimeStr = new Date(
                              startTime,
                            ).toLocaleTimeString('ko-KR', {
                              hour: '2-digit',
                              minute: '2-digit',
                            });

                            if (endTime) {
                              const endTimeStr = new Date(
                                endTime,
                              ).toLocaleTimeString('ko-KR', {
                                hour: '2-digit',
                                minute: '2-digit',
                              });
                              return (
                                <div className="flex flex-col">
                                  <span>{startTimeStr}</span>
                                  <span>{endTimeStr}</span>
                                </div>
                              );
                            }

                            return <span>{startTimeStr}</span>;
                          })()}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-gray-800">
                              {item.data.info?.name || '장소 정보 없음'}
                            </h4>
                            <Badge
                              variant="outline"
                              className={`text-xs ${getActivityTypeColor(
                                item.data.info?.type,
                              )}`}
                            >
                              {item.data.info?.type || '기타'}
                            </Badge>
                          </div>
                          {item.data.info?.address && (
                            <p className="text-sm text-gray-600">
                              📍 {item.data.info.address}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* 삭제 확인 모달 */}
      {showDeleteModal && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40"
          onClick={handleDeleteCancel}
        >
          <div
            className="relative w-[400px] max-w-[90vw] bg-white rounded-xl shadow-xl border border-gray-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 헤더 */}
            <div className="px-6 pt-5 pb-3">
              <div className="flex items-start justify-between">
                <h3 className="text-xl font-semibold text-red-600">
                  ⚠️ 일정 삭제 확인
                </h3>
                <button
                  aria-label="close"
                  onClick={handleDeleteCancel}
                  className="rounded-full p-1 text-gray-500 hover:bg-gray-100"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* 본문 */}
            <div className="px-6 pb-6">
              <p className="text-gray-600 mb-6">
                정말로 이 일정을 삭제하시겠습니까?
                <br />
                삭제된 일정은 복구할 수 없습니다.
              </p>
            </div>

            {/* 하단 버튼 */}
            <div className="absolute right-4 bottom-2">
              <div className="flex gap-3">
                <button
                  onClick={handleDeleteCancel}
                  disabled={isDeleting}
                  className="px-5 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                  취소
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  disabled={isDeleting}
                  className="px-5 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {isDeleting ? '삭제 중...' : '삭제'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
