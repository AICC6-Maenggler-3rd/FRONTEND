import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyItineraries } from '@/api/itinerary';
import type { ItinerarySchema } from '@/types/itinerary';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function ItineraryListPage() {
  const [items, setItems] = useState<ItinerarySchema[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await getMyItineraries(page, limit);
        setItems(res.itineraries);
        setTotalPages(res.total_pages);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [page, limit]);

  return (
    <div className="min-h-screen bg-background">
      {/* Back Button */}
      <Link
        to="/mypage"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground ml-151 mt-26 transition-colors"
      >
        ← 마이페이지로 돌아가기
      </Link>
      <div className="container mx-auto pt-10 py-8 max-w-4xl">
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-xl">나의 전체 일정</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <div className="text-center text-muted-foreground py-12">
                불러오는 중...
              </div>
            ) : items.length === 0 ? (
              <div className="p-6 border-2 border-dashed rounded-lg text-center">
                아직 생성된 일정이 없습니다.
              </div>
            ) : (
              items.map((it) => {
                const start = new Date(it.start_at || '');
                const end = new Date(it.end_at || '');
                const duration = Math.ceil(
                  (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
                );
                const locationName = it.start_location || '';
                const title =
                  it.name ||
                  it.theme ||
                  (locationName ? `${locationName} 여행` : '여행');
                return (
                  <Link
                    key={it.itinerary_id}
                    to={`/schedule/${it.itinerary_id}`}
                    className="block"
                  >
                    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-sm">
                            {title.slice(0, 2)}
                          </span>
                        </div>
                        <div>
                          <div className="font-semibold text-black">
                            {title}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {start.toLocaleDateString('ko-KR')} -{' '}
                            {end.toLocaleDateString('ko-KR')} ({duration}박{' '}
                            {duration + 1}일)
                          </div>
                          <div className="text-xs text-gray-700 mt-1">
                            • {it.relation || '일정'}
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        → 상세보기
                      </div>
                    </div>
                  </Link>
                );
              })
            )}

            <div className="flex items-center justify-between pt-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                이전
              </Button>
              <div className="text-sm text-muted-foreground">
                {page} / {totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                다음
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
