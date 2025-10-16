import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { FileText, Users, FolderTree, BarChart3} from "lucide-react"
import { getDashboardData } from '@/api/manage'



const Main = () => {
  const [userCount, setUserCount] = useState<number>(0)
  const [placesCount, setPlacesCount] = useState<number>(0)
  const [categoriesCount, setCategoriesCount] = useState<number>(0)
  const [snsAccountsCount, setSnsAccountsCount] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(true)

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

    fetchDashboardData()
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

    </div>
  )
}

export default Main