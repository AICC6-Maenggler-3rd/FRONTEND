import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { Card } from "@/components/ui/card"
import {
  Users,
  FolderTree,
  Shield,
  Globe,
  Share2,
  FileText,
} from "lucide-react"

const Sidebar = () => {
  return (
    <div>
      {/* Main Content */}
      <div>
        {/* Left Sidebar Navigation */}
        <div className="w-64 flex-shrink-0">
          <Card className="border-border bg-card p-4">
            <nav className="space-y-2">
              <Link to="/manage/memberdetail">
                <Button variant="outline" className="w-full justify-start gap-3 text-foreground hover:bg-secondary">
                  <Users className="h-4 w-4" />
                  회원 관리
                </Button>
              </Link>
              <Button variant="outline" className="w-full justify-start gap-3 text-foreground hover:bg-secondary">
                <FolderTree className="h-4 w-4" />
                카테고리 관리
              </Button>
              <Button variant="outline" className="w-full justify-start gap-3 text-foreground hover:bg-secondary">
                <Shield className="h-4 w-4" />
                관리자 계정 관리
              </Button>
              <Button variant="outline" className="w-full justify-start gap-3 text-foreground hover:bg-secondary">
                <Globe className="h-4 w-4" />
                사이트 관리
              </Button>
              <Button variant="outline" className="w-full justify-start gap-3 text-foreground hover:bg-secondary">
                <Share2 className="h-4 w-4" />
                SNS 계정 관리
              </Button>

              <div className="border-t border-border pt-4 mt-4">
                <Button variant="outline" className="w-full justify-start gap-3 text-foreground hover:bg-secondary">
                  <FileText className="h-4 w-4" />
                  프론트 페이지
                </Button>
                
              </div>
            </nav>
          </Card>
        </div> 
      </div>
    </div>
   
  )
}

export default Sidebar
