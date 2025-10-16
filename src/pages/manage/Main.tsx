import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { FileText, Users, FolderTree, BarChart3, MapPin} from "lucide-react"
import { getDashboardData, getPlacesPopularity, getPlacesCategoryStats } from '@/api/manage'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'



const Main = () => {
  const [userCount, setUserCount] = useState<number>(0)
  const [placesCount, setPlacesCount] = useState<number>(0)
  const [categoriesCount, setCategoriesCount] = useState<number>(0)
  const [snsAccountsCount, setSnsAccountsCount] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(true)
  const [popularPlaces, setPopularPlaces] = useState<any[]>([])
  const [categoryStats, setCategoryStats] = useState<any[]>([])
  const [chartsLoading, setChartsLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        const data = await getDashboardData()
        setUserCount(data.users_count)
        setPlacesCount(data.places_count)
        setCategoriesCount(data.categories_count)
        setSnsAccountsCount(data.sns_accounts_count)
      } catch (error) {
        console.error('대시보드 데이터 조회 실패:', error)
        setUserCount(0)
        setPlacesCount(0)
        setCategoriesCount(0)
        setSnsAccountsCount(0)
      } finally {
        setLoading(false)
      }
    }

    const fetchChartsData = async () => {
      try {
        setChartsLoading(true)
        console.log('차트 데이터 조회 시작...')
        
        const [popularityData, categoryData] = await Promise.all([
          getPlacesPopularity(),
          getPlacesCategoryStats()
        ])
        
        console.log('인기 장소 데이터:', popularityData)
        console.log('카테고리 데이터:', categoryData)
        
        setPopularPlaces(popularityData.popular_places || [])
        setCategoryStats(categoryData.category_stats || [])
      } catch (error) {
        console.error('차트 데이터 조회 실패:', error)
        setPopularPlaces([])
        setCategoryStats([])
      } finally {
        setChartsLoading(false)
      }
    }

    fetchDashboardData()
    fetchChartsData()
  }, [])

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* 대시보드 카드들을 그리드로 배치 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">회원</p>
              <p className="text-3xl font-semibold text-foreground mt-2">
                {loading ? '로딩 중...' : userCount.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">카테고리</p>
              <p className="text-3xl font-semibold text-foreground mt-2"> {loading ? '로딩 중...' : categoriesCount.toLocaleString()}</p>
            </div>
            <div className="rounded-full bg-blue-500/10 p-3">
              <FolderTree className="h-6 w-6 text-blue-500" />
            </div>  
          </div>
        </Card>

        <Card className="border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">장소 데이터</p>
              <p className="text-3xl font-semibold text-foreground mt-2">
                {loading ? '로딩 중...' : placesCount.toLocaleString()}
              </p>
            </div>
            <div className="rounded-full bg-purple-500/10 p-3">
              <FileText className="h-6 w-6 text-purple-500" />
            </div>
          </div>
        </Card>

        <Card className="border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">SNS 계정 관리</p>
              <p className="text-3xl font-semibold text-foreground mt-2">
                {loading ? '로딩 중...' : snsAccountsCount.toLocaleString()}
              </p>
            </div>
            <div className="rounded-full bg-green-500/10 p-3">
              <BarChart3 className="h-6 w-6 text-green-500" />
            </div>
          </div>
        </Card>
      </div>

       {/* Quick Actions */}
        <div className="grid grid-cols-1">
            <Card className="border-border bg-card p-6">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-foreground">빠른 작업</h3>
                <p className="text-sm text-muted-foreground">자주 사용하는 기능</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Button
                  variant="outline"
                  className="h-24 flex-col gap-2 border-border hover:bg-secondary bg-transparent"
                >
                  <Users className="h-6 w-6" />
                  <span className="text-sm">회원 추가</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-24 flex-col gap-2 border-border hover:bg-secondary bg-transparent"
                >
                  <FolderTree className="h-6 w-6" />
                  <span className="text-sm">카테고리 생성</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-24 flex-col gap-2 border-border hover:bg-secondary bg-transparent"
                >
                  <FileText className="h-6 w-6" />
                  <span className="text-sm">게시물 작성</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-24 flex-col gap-2 border-border hover:bg-secondary bg-transparent"
                >
                  <BarChart3 className="h-6 w-6" />
                  <span className="text-sm">통계 보기</span>
                </Button>
              </div>
            </Card>
        </div>

        {/* 장소 인기도 분석 차트 섹션 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 인기 장소 TOP 10 차트 */}
          <Card className="border-border bg-card p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <MapPin className="h-5 w-5 text-blue-500" />
                인기 장소 TOP 10
              </h3>
              <Button variant="outline" size="sm" className="text-xs text-primary">
                전체보기
              </Button>
            </div>
            {chartsLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-muted-foreground">차트 로딩 중...</div>
              </div>
            ) : popularPlaces.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={popularPlaces.slice(0, 10)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      fontSize={12}
                    />
                    <YAxis />
                    <Tooltip 
                      formatter={(value: any) => [value, '방문 횟수']}
                      labelFormatter={(label: string) => `장소: ${label}`}
                    />
                    <Bar dataKey="count" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64">
                <div className="text-muted-foreground">데이터가 없습니다</div>
              </div>
            )}
          </Card>

          {/* 카테고리별 장소 분포 차트 */}
          <Card className="border-border bg-card p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-green-500" />
                카테고리별 장소 분포
              </h3>
              <Button variant="outline" size="sm" className="text-xs text-primary">
                전체보기
              </Button>
            </div>
            {chartsLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-muted-foreground">차트 로딩 중...</div>
              </div>
            ) : categoryStats.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryStats}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ category, percent }: any) => `${category} ${((percent as number) * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {categoryStats.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={`hsl(${index * 60}, 70%, 50%)`} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: any) => [value, '장소 수']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64">
                <div className="text-muted-foreground">데이터가 없습니다</div>
              </div>
            )}
          </Card>
        </div>
    </div>
  )
}

export default Main