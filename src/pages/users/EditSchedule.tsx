import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getUserInfo } from '@/api/auth';
import { getItineraryDetail } from '@/api/itinerary';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import InputTime from '@/components/ui/TimeNumberInput';

interface ItineraryItem {
  item_id: number;
  start_time: string;
  end_time?: string;
  item_type: 'place' | 'accommodation';
  data: {
    item_id: number;
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

interface EditableItem extends ItineraryItem {
  isEditing: boolean;
}

export default function EditSchedule() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [itinerary, setItinerary] = useState<ItineraryResponse | null>(null);
  const [editableItems, setEditableItems] = useState<EditableItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchItinerary = async () => {
      try {
        const userData = await getUserInfo();
        if (userData?.user?.id) {
          const data = await getItineraryDetail(Number(id));
          console.log('🔍 API 응답 데이터:', data);
          console.log('🔍 itinerary 데이터:', data.itinerary);
          console.log('🔍 items 데이터:', data.itinerary?.items);
          setItinerary(data.itinerary);
          setEditableItems(
            data.itinerary.items.map((item: ItineraryItem) => ({
              ...item,
              isEditing: false,
            })),
          );
        }
      } catch (error) {
        console.error('❌ 일정 데이터를 불러오지 못했습니다:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchItinerary();
  }, [id]);

  // 아이템 편집 모드 토글
  const toggleEditItem = (itemId: number | null) => {
    setEditableItems((prev) =>
      prev.map((item) =>
        item.data.item_id === itemId
          ? { ...item, isEditing: !item.isEditing }
          : item,
      ),
    );
  };

  // 시간 값을 HH:MM 형식으로 변환
  const handleTimeValue = (StringTime: string) => {
    if (!StringTime) return '00:00';
    try {
      const date = new Date(StringTime);
      if (isNaN(date.getTime())) return '00:00';
      return date.toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
    } catch (error) {
      console.error('시간 변환 오류:', error);
      return '00:00';
    }
  };

  // 시간 업데이트 (TimeNumberInput에서 받은 HH:MM 형식을 ISO로 변환)
  const updateItemTime = (
    itemId: number,
    field: 'start_time' | 'end_time',
    time: string,
  ) => {
    if (!time) return;

    setEditableItems((prev) =>
      prev.map((item) => {
        if (item.data.item_id === itemId) {
          // 기존 시간에서 날짜 부분을 유지하고 시간만 변경
          const existingTime = item.data[field] || item[field] || '';
          let existingDate;

          if (existingTime) {
            existingDate = new Date(existingTime);
          } else {
            // 기본값으로 현재 날짜 사용
            existingDate = new Date();
          }

          // 시간 설정
          const [hour, minute] = time.split(':').map(Number);
          existingDate.setHours(hour, minute, 0, 0);

          // ISO 문자열로 변환 (한국 시간대 오프셋 제거)
          const isoString = existingDate.toISOString();

          return {
            ...item,
            data: {
              ...item.data,
              [field]: isoString,
            },
          };
        }
        return item;
      }),
    );
  };

  // 아이템 삭제
  const removeItem = (itemId: number | null) => {
    setEditableItems((prev) =>
      prev.filter((item) => item.data.item_id !== itemId),
    );
  };

  // 변경사항 저장
  const handleSave = async () => {
    if (!itinerary) return;

    setSaving(true);
    try {
      // const updatedItinerary = {
      //   ...itinerary,
      //   user_id: itinerary.user_id || 0,
      //   relation: itinerary.relation || '',
      //   theme: itinerary.theme || '',
      //   items: editableItems.map((item) => ({
      //     start_time: item.data.start_time,
      //     end_time: item.data.end_time || null,
      //     place_id: null,
      //     accommodation_id: null,
      //     is_required: true,
      //   })),
      // };

      // await updateItinerary(Number(id), updatedItinerary);
      toast.success('일정이 성공적으로 수정되었습니다.', {
        position: 'top-center',
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        onClose: () => {
          navigate(`/schedule/${id}`);
        },
      });
    } catch (error) {
      console.error('일정 수정 실패:', error);
      toast.error('일정 수정에 실패했습니다.', {
        position: 'top-center',
        autoClose: 2000,
      });
    } finally {
      setSaving(false);
    }
  };

  // 날짜별로 일정 묶기
  const groupedByDay: Record<string, EditableItem[]> = {};
  editableItems.forEach((item) => {
    const startTime = item.data?.start_time || item.start_time;
    if (startTime) {
      const dateKey = startTime.split('T')[0];
      if (!groupedByDay[dateKey]) groupedByDay[dateKey] = [];
      groupedByDay[dateKey].push(item);
    }
  });

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

  return (
    <div className="min-h-screen py-8">
      <ToastContainer />
      <div className="max-w-4xl mx-auto px-4">
        {/* 헤더 */}
        <div className="text-center mt-10 mb-20">
          <h1 className="text-4xl font-bold text-blue-900 mb-4">
            ✏️ {itinerary.name || '여행 일정'} 수정
          </h1>
          <p className="text-lg text-gray-600">일정을 수정하고 저장해보세요.</p>
        </div>

        {/* 액션 버튼들 */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            to={`/schedule/${id}`}
            className="inline-flex items-center text-sm text-blue-700 hover:text-blue-800 transition-colors"
          >
            ← 일정 상세로 돌아가기
          </Link>

          <div className="flex items-center gap-3">
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {saving ? '저장 중...' : '💾 저장하기'}
            </Button>
          </div>
        </div>

        {/* 여행 정보 요약 */}
        <Card className="p-6 mb-6">
          <h3 className="text-xl font-semibold mb-4 text-blue-900">
            ℹ️ 여행 정보
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

        {/* 편집 가능한 일정 */}
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4 text-blue-900">
            📝 일정 편집
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
                      key={item.data.item_id}
                      className="flex items-start justify-between p-4 bg-white border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start gap-4 flex-1">
                        {/* 시간 편집 영역 */}
                        <div className="text-sm font-mono text-gray-500 min-w-[120px]">
                          {item.isEditing ? (
                            <div className="space-y-2">
                              <div>
                                <label className="text-xs text-gray-400">
                                  시작시간
                                </label>
                                <InputTime
                                  initialTime={handleTimeValue(
                                    item.data.start_time ||
                                      item.start_time ||
                                      '',
                                  )}
                                  onChange={(time) =>
                                    updateItemTime(
                                      item.data.item_id,
                                      'start_time',
                                      time,
                                    )
                                  }
                                />
                              </div>
                              <div>
                                <label className="text-xs text-gray-400">
                                  종료시간
                                </label>
                                <InputTime
                                  initialTime={handleTimeValue(
                                    item.data.end_time || item.end_time || '',
                                  )}
                                  onChange={(time) =>
                                    updateItemTime(
                                      item.data.item_id,
                                      'end_time',
                                      time,
                                    )
                                  }
                                />
                              </div>
                            </div>
                          ) : (
                            <div className="flex flex-col">
                              <span>
                                {item.data?.start_time || item.start_time
                                  ? new Date(
                                      item.data?.start_time || item.start_time,
                                    ).toLocaleTimeString('ko-KR', {
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    })
                                  : '시간 미정'}
                              </span>
                              {(item.data?.end_time || item.end_time) && (
                                <span>
                                  {new Date(
                                    (item.data?.end_time || item.end_time)!,
                                  ).toLocaleTimeString('ko-KR', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        {/* 장소 정보 */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-gray-800">
                              {item.data.info?.name || '장소 정보 없음'}
                            </h4>
                            <Badge
                              variant="outline"
                              className="text-xs bg-gray-100 text-gray-800"
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

                      {/* 액션 버튼들 */}
                      <div className="flex gap-2">
                        <Button
                          onClick={() => toggleEditItem(item.data.item_id)}
                          variant="outline"
                          size="sm"
                          className="text-xs"
                        >
                          {item.isEditing ? '✅ 완료' : '✏️ 수정'}
                        </Button>
                        <Button
                          onClick={() => removeItem(item.data.item_id)}
                          variant="outline"
                          size="sm"
                          className="text-xs text-red-600 hover:text-red-700"
                        >
                          🗑️ 삭제
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
