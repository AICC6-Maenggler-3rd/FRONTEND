import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import {
  Users,
  FolderTree,
  Building2,
  Share2,
  FileText,
} from "lucide-react"

const Sidebar = () => {
  return (
    <div className="w-80 flex-shrink-0 bg-background border-r border-border">
      <div className="p-6">
        
       
        {/* 네비게이션 메뉴 */}
        <nav className="space-y-2">
          <Link to="/manage/memberdetail">
            <Button 
              variant="outline" 
              className="w-full justify-start gap-3 text-foreground hover:bg-accent hover:text-accent-foreground h-11 px-4"
            >
              <Users className="h-5 w-5" />
              <span className="font-medium">회원 관리</span>
            </Button>
          </Link>
          
          <Link to="/manage/categorydetail">
            <Button 
              variant="outline" 
              className="w-full justify-start gap-3 text-foreground hover:bg-accent hover:text-accent-foreground h-11 px-4"
            >
              <FolderTree className="h-5 w-5" />
              <span className="font-medium">카테고리 관리</span>
            </Button>
          </Link>
          
          <Link to="/manage/accommodationdetail">
            <Button 
              variant="outline" 
              className="w-full justify-start gap-3 text-foreground hover:bg-accent hover:text-accent-foreground h-11 px-4"
            >
              <Building2 className="h-5 w-5" />
              <span className="font-medium">숙소 관리</span>
            </Button>
          </Link>
          
          <Link to="/manage/snsaccount">
            <Button 
              variant="outline" 
              className="w-full justify-start gap-3 text-foreground hover:bg-accent hover:text-accent-foreground h-11 px-4"
            >
              <Share2 className="h-5 w-5" />
              <span className="font-medium">SNS 계정 관리</span>
            </Button>
          </Link>
          
          <div className="border-t border-border my-4"></div>
          
          <Link to="/">
            <Button 
              variant="outline" 
              className="w-full justify-start gap-3 text-foreground hover:bg-accent hover:text-accent-foreground h-11 px-4"
              onClick={() => { (document.activeElement as HTMLElement)?.blur() }}
            >
              <FileText className="h-5 w-5" />
              <span className="font-medium">프론트 페이지</span>
            </Button>
          </Link>
        </nav>
      </div>
    </div>
  )
}

export default Sidebar
