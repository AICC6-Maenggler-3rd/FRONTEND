import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { FileText, Users, FolderTree, Building2} from "lucide-react"
import { getDashboardData, getAccommodationsStats } from '@/api/manage'
import { CreateCategoryModal } from '@/components/manage/CreateCategoryModal'
import { UserManagementModal } from '@/components/manage/UserManagementModal'
import { SnsAccountsModal } from '@/components/manage/SnsAccountsModal'
import { AccommodationsModal } from '@/components/manage/AccommodationsModal'

const Dashboard = () => {
  const [userCount, setUserCount] = useState<number>(0)
  const [placesCount, setPlacesCount] = useState<number>(0)
  const [categoriesCount, setCategoriesCount] = useState<number>(0)
  const [snsAccountsCount, setSnsAccountsCount] = useState<number>(0)
  const [accommodationsCount, setAccommodationsCount] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(true)
  const [isCreateCategoryModalOpen, setIsCreateCategoryModalOpen] = useState<boolean>(false)
  const [isUserManagementModalOpen, setIsUserManagementModalOpen] = useState<boolean>(false)
  const [isSnsAccountsModalOpen, setIsSnsAccountsModalOpen] = useState<boolean>(false)
  const [isAccommodationsModalOpen, setIsAccommodationsModalOpen] = useState<boolean>(false)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        const data = await getDashboardData()
        setUserCount(data.users_count)
        setPlacesCount(data.places_count)
        setCategoriesCount(data.categories_count)
        setSnsAccountsCount(data.sns_accounts_count)
        
        // 숙소 데이터 별도 조회
        const accommodationsData = await getAccommodationsStats()
        console.log('숙소 데이터:', accommodationsData)
        setAccommodationsCount(accommodationsData.total_count)
      } catch (error) {
        console.error('대시보드 데이터 조회 실패:', error)
        setUserCount(0)
        setPlacesCount(0)
        setCategoriesCount(0)
        setSnsAccountsCount(0)
        setAccommodationsCount(0)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const refreshUsers = async () => {
    try {
      const data = await getDashboardData()
      setUserCount(data.users_count)
    } catch (error) {
      console.error('사용자 수 새로고침 실패:', error)
    }
  }

  const refreshSnsAccounts = async () => {
    try {
      const data = await getDashboardData()
      setSnsAccountsCount(data.sns_accounts_count)
    } catch (error) {
      console.error('SNS 계정 수 새로고침 실패:', error)
    }
  }

  const handleCategoryCreateSuccess = () => {
    const refreshDashboardData = async () => {
      try {
        const data = await getDashboardData()
        setCategoriesCount(data.categories_count)
      } catch (error) {
        console.error('대시보드 데이터 새로고침 실패:', error)
      }
    }
    refreshDashboardData()
  }

  const handleUserManagementSuccess = () => {
    refreshUsers()
  }

  const handleSnsAccountsSuccess = () => {
    refreshSnsAccounts()
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* 대시보드 카드들을 그리드로 배치 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
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
              <p className="text-sm text-muted-foreground">숙소</p>
              <p className="text-3xl font-semibold text-foreground mt-2">
                {loading ? '로딩 중...' : accommodationsCount.toLocaleString()}
              </p>
            </div>
            <div className="rounded-full bg-orange-500/10 p-3">
              <Building2 className="h-6 w-6 text-orange-500" />
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
              <Users className="h-6 w-6 text-green-500" />
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
                  onClick={() => { (document.activeElement as HTMLElement)?.blur(); setIsUserManagementModalOpen(true) }}
                >
                  <Users className="h-6 w-6" />
                  <span className="text-sm">회원 관리</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-24 flex-col gap-2 border-border hover:bg-secondary bg-transparent"
                  onClick={() => { (document.activeElement as HTMLElement)?.blur(); setIsCreateCategoryModalOpen(true) }}
                >
                  <FolderTree className="h-6 w-6" />
                  <span className="text-sm">카테고리 생성</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-24 flex-col gap-2 border-border hover:bg-secondary bg-transparent"
                  onClick={() => { (document.activeElement as HTMLElement)?.blur(); setIsAccommodationsModalOpen(true) }}
                >
                  <Building2 className="h-6 w-6" />
                  <span className="text-sm">숙소 설정</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-24 flex-col gap-2 border-border hover:bg-secondary bg-transparent"
                  onClick={() => { (document.activeElement as HTMLElement)?.blur(); setIsSnsAccountsModalOpen(true) }}
                >
                  <FileText className="h-6 w-6" />
                  <span className="text-sm">SNS 계정</span>
                </Button>
              </div>
            </Card>
        </div>

        {/* 카테고리 생성 모달 */}
        <CreateCategoryModal
          isOpen={isCreateCategoryModalOpen}
          onClose={() => setIsCreateCategoryModalOpen(false)}
          onSuccess={handleCategoryCreateSuccess}
        />

        {/* 회원 관리 모달 */}
        <UserManagementModal
          isOpen={isUserManagementModalOpen}
          onClose={() => setIsUserManagementModalOpen(false)}
          onSuccess={handleUserManagementSuccess}
        />

        {/* SNS 계정 모달 */}
        <SnsAccountsModal
          isOpen={isSnsAccountsModalOpen}
          onClose={() => setIsSnsAccountsModalOpen(false)}
          onSuccess={handleSnsAccountsSuccess}
        />

        {/* 숙소 목록 모달 */}
        <AccommodationsModal
          isOpen={isAccommodationsModalOpen}
          onClose={() => setIsAccommodationsModalOpen(false)}
        />
    </div>
  )
}

export default Dashboard
