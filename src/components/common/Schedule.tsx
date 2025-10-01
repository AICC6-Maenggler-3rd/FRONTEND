import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link, useParams } from 'react-router-dom';

// React Router 파라미터 사용

// 임시 데이터 - 실제로는 API에서 가져올 데이터
const scheduleData: Record<string, any> = {
  '1': {
    title: '제주도 힐링 여행',
    location: '제주도',
    period: '2024.03.15 - 2024.03.18',
    duration: '3박 4일',
    status: '진행 완료',
    satisfaction: 4.8,
    budget: '총 45만원',
    participants: ['김여행'],
    description: '제주도의 아름다운 자연을 만끽하며 힐링하는 여행',
    dailySchedules: [
      {
        day: 1,
        date: '2024.03.15 (금)',
        activities: [
          {
            time: '09:00',
            activity: '김포공항 출발',
            location: '김포공항',
            type: '교통',
          },
          {
            time: '10:30',
            activity: '제주공항 도착',
            location: '제주공항',
            type: '교통',
          },
          {
            time: '12:00',
            activity: '점심식사',
            location: '흑돼지 맛집',
            type: '식사',
          },
          {
            time: '14:00',
            activity: '호텔 체크인',
            location: '제주 신라호텔',
            type: '숙박',
          },
          {
            time: '16:00',
            activity: '한라산 등반',
            location: '한라산',
            type: '관광',
          },
          {
            time: '19:00',
            activity: '저녁식사',
            location: '해산물 맛집',
            type: '식사',
          },
        ],
      },
      {
        day: 2,
        date: '2024.03.16 (토)',
        activities: [
          {
            time: '08:00',
            activity: '호텔 조식',
            location: '제주 신라호텔',
            type: '식사',
          },
          {
            time: '10:00',
            activity: '성산일출봉',
            location: '성산일출봉',
            type: '관광',
          },
          {
            time: '12:30',
            activity: '점심식사',
            location: '성산 맛집',
            type: '식사',
          },
          {
            time: '14:30',
            activity: '우도 관광',
            location: '우도',
            type: '관광',
          },
          {
            time: '17:00',
            activity: '카페 휴식',
            location: '우도 카페',
            type: '휴식',
          },
          {
            time: '19:30',
            activity: '저녁식사',
            location: '제주시 맛집',
            type: '식사',
          },
        ],
      },
      {
        day: 3,
        date: '2024.03.17 (일)',
        activities: [
          {
            time: '09:00',
            activity: '호텔 조식',
            location: '제주 신라호텔',
            type: '식사',
          },
          {
            time: '11:00',
            activity: '중문 관광단지',
            location: '중문',
            type: '관광',
          },
          {
            time: '13:00',
            activity: '점심식사',
            location: '중문 맛집',
            type: '식사',
          },
          {
            time: '15:00',
            activity: '쇼핑',
            location: '신세계면세점',
            type: '쇼핑',
          },
          {
            time: '18:00',
            activity: '저녁식사',
            location: '제주 전통음식점',
            type: '식사',
          },
          {
            time: '20:00',
            activity: '야경 감상',
            location: '용두암',
            type: '관광',
          },
        ],
      },
    ],
  },
  '2': {
    title: '부산 맛집 투어',
    location: '부산',
    period: '2024.02.20 - 2024.02.23',
    duration: '3박 4일',
    status: '진행 완료',
    satisfaction: 5.0,
    budget: '총 38만원',
    participants: ['김여행'],
    description: '부산의 유명한 맛집들을 탐방하는 미식 여행',
    dailySchedules: [
      {
        day: 1,
        date: '2024.02.20 (화)',
        activities: [
          {
            time: '07:00',
            activity: 'KTX 출발',
            location: '서울역',
            type: '교통',
          },
          {
            time: '09:30',
            activity: '부산역 도착',
            location: '부산역',
            type: '교통',
          },
          {
            time: '11:00',
            activity: '호텔 체크인',
            location: '부산 롯데호텔',
            type: '숙박',
          },
          {
            time: '12:30',
            activity: '돼지국밥',
            location: '할매 돼지국밥',
            type: '식사',
          },
          {
            time: '15:00',
            activity: '해운대 해변',
            location: '해운대',
            type: '관광',
          },
          {
            time: '18:00',
            activity: '회센터 저녁',
            location: '민락동 회센터',
            type: '식사',
          },
        ],
      },
    ],
  },
  '3': {
    title: '경주 역사 탐방',
    location: '경주',
    period: '2024.01.10 - 2024.01.12',
    duration: '2박 3일',
    status: '진행 완료',
    satisfaction: 4.7,
    budget: '총 25만원',
    participants: ['김여행'],
    description: '천년 고도 경주의 역사와 문화를 체험하는 여행',
    dailySchedules: [
      {
        day: 1,
        date: '2024.01.10 (수)',
        activities: [
          {
            time: '08:00',
            activity: 'KTX 출발',
            location: '서울역',
            type: '교통',
          },
          {
            time: '10:30',
            activity: '신경주역 도착',
            location: '신경주역',
            type: '교통',
          },
          {
            time: '12:00',
            activity: '점심식사',
            location: '경주 한정식',
            type: '식사',
          },
          {
            time: '14:00',
            activity: '불국사 관람',
            location: '불국사',
            type: '관광',
          },
          {
            time: '16:30',
            activity: '석굴암 관람',
            location: '석굴암',
            type: '관광',
          },
          {
            time: '19:00',
            activity: '저녁식사',
            location: '경주 맛집',
            type: '식사',
          },
        ],
      },
    ],
  },
};

const getActivityTypeColor = (type: string) => {
  switch (type) {
    case '교통':
      return 'bg-blue-100 text-blue-800';
    case '숙박':
      return 'bg-purple-100 text-purple-800';
    case '식사':
      return 'bg-orange-100 text-orange-800';
    case '관광':
      return 'bg-blue-100 text-blue-800';
    case '쇼핑':
      return 'bg-pink-100 text-pink-800';
    case '휴식':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default function ScheduleDetailPage() {
  const { id } = useParams();
  const schedule = id ? scheduleData[id] : undefined;

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-6xl mx-auto px-4 pt-16 py-8">
        <Link
          to="/mypage"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-10 mt-10 transition-colors ml-28"
        >
          ← 마이페이지로 돌아가기
        </Link>
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Schedule Overview */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-3xl mb-2">
                    {schedule.title}
                  </CardTitle>
                  <CardDescription className="text-lg mb-4">
                    {schedule.description}
                  </CardDescription>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      📍 <span>{schedule.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      📅 <span>{schedule.period}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      ⏰ <span>{schedule.duration}</span>
                    </div>
                  </div>
                </div>
                <Badge variant="secondary" className="px-3 py-1">
                  {schedule.status}
                </Badge>
              </div>
            </CardHeader>
          </Card>

          {/* Daily Schedules */}
          {schedule.dailySchedules.map((daySchedule: any, index: number) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  📅 Day {daySchedule.day} - {daySchedule.date}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {daySchedule.activities.map(
                    (activity: any, actIndex: number) => (
                      <div
                        key={actIndex}
                        className="flex items-start gap-4 p-4 border rounded-lg"
                      >
                        <div className="text-sm font-mono text-muted-foreground min-w-[60px]">
                          {activity.time}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold">
                              {activity.activity}
                            </h4>
                            <Badge
                              variant="outline"
                              className={`text-xs ${getActivityTypeColor(activity.type)}`}
                            >
                              {activity.type}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            📍 {activity.location}
                          </p>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
