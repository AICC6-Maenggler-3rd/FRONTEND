import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getUserInfo } from '@/api/auth';
import { getItineraryDetail } from '@/api/itinerary';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ItineraryItem {
  item_id: number;
  start_time: string;
  end_time?: string;
  item_type: 'place' | 'accommodation';
  data: {
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
}

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

export default function ScheduleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [itinerary, setItinerary] = useState<ItineraryResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchItinerary = async () => {
      try {
        // ✅ 로그인한 사용자 정보 가져오기
        const userData = await getUserInfo();
        console.log('ScheduleDetailPage - userData:', userData);

        // user_id가 존재할 때만 API 요청
        if (userData?.user?.id) {
          const userId = userData.user.id;
          const data = await getItineraryDetail(Number(id));
          setItinerary(data);
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

  // 날짜별로 일정 묶기
  const groupedByDay: Record<string, ItineraryItem[]> = {};
  itinerary.items.forEach((item) => {
    const dateKey = item.start_time.split('T')[0];
    if (!groupedByDay[dateKey]) groupedByDay[dateKey] = [];
    groupedByDay[dateKey].push(item);
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-5xl mx-auto px-4 pt-16 pb-10">
        <Link
          to="/mypage"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-10 transition-colors"
        >
          ← 마이페이지로 돌아가기
        </Link>

        {/* 일정 기본 정보 */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-3xl mb-2">
                  {itinerary.name || '여행명'}
                </CardTitle>
                <CardDescription className="text-lg mb-4">
                  출발지: {itinerary.location}
                </CardDescription>
                <div className="flex flex-col text-sm gap-1">
                  <div>
                    📅 {itinerary.start_at} ~ {itinerary.end_at}
                  </div>
                  {itinerary.relation && <div>👥 {itinerary.relation}</div>}
                </div>
              </div>
              <Badge variant="secondary">진행 완료</Badge>
            </div>
          </CardHeader>
        </Card>

        {/* 일자별 일정 */}
        {Object.entries(groupedByDay).map(([date, items], idx) => (
          <Card key={date} className="mt-6">
            <CardHeader>
              <CardTitle>
                📅 Day {idx + 1} - {date}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.item_id}
                  className="flex items-start justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start gap-4 flex-1">
                    <div className="text-sm font-mono text-muted-foreground min-w-[60px]">
                      {new Date(item.start_time).toLocaleTimeString('ko-KR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">{item.data.info.name}</h4>
                        <Badge
                          variant="outline"
                          className={`text-xs ${getActivityTypeColor(
                            item.data.info.type,
                          )}`}
                        >
                          {item.data.info.type || '기타'}
                        </Badge>
                      </div>
                      {item.data.info.address && (
                        <p className="text-sm text-muted-foreground">
                          📍 {item.data.info.address}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <button className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                      → 상세보기
                    </button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
