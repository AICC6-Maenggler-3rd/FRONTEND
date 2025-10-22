import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"
import Sidebar from "./Sidebar"
import SnsAccountList from "@/components/manage/SnsAccountList"

interface SnsAccount {
  nickname: string;
  places_count: number;
  last_activity?: string;
}

const Snsaccount = () => {
  const handleAccountSelect = (account: SnsAccount) => {
    // TODO: 계정 상세 정보 모달 또는 페이지로 이동
    console.log('선택된 계정:', account);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex gap-6 p-6">
        <Sidebar />

        <div className="flex-1 space-y-6">
          {/* 헤더 */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">SNS 계정 관리</h1>
              <p className="text-muted-foreground">인스타그램 계정 연동 및 관리</p>
            </div>
            <div className="flex items-center gap-2">
              <Link to="/manageIndex">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  뒤로가기
                </Button>
              </Link>
            </div>
          </div>

          {/* 메인 콘텐츠 */}
          <SnsAccountList onAccountSelect={handleAccountSelect} />
        </div>
      </div>
    </div>
  )
}

export default Snsaccount