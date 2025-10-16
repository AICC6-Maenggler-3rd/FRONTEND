import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Sidebar from "./Sidebar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, ArrowLeft } from "lucide-react"
import { getUsersList } from "@/api/manage"

interface User {
  user_id: number
  email: string
  name: string
  status: string
  role: string
  provider: string
  created_at: string
  last_login_at: string
}

export default function MembersPage() {
  const navigate = useNavigate()
  const [users, setUsers] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
        const usersData = await getUsersList()
        setUsers(usersData)
        if (usersData.length > 0) {
          setSelectedUser(usersData[0])
        }
      } catch (err) {
        setError('사용자 목록을 불러오는데 실패했습니다.')
        console.error('사용자 목록 조회 실패:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  // 검색 필터링
  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  )
  
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">사용자 목록을 불러오는 중...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>다시 시도</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex gap-6 p-6">
        <Sidebar />

        <div className="flex-1">
          <Card className="border-border bg-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-foreground">회원 관리</h1>
              <Button 
                variant="outline" 
                onClick={() => navigate('/manageIndex')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                대시보드로 돌아가기
              </Button>
            </div>

            <div className="flex gap-6">
              {/* User List Section */}
              <div className="flex-1">
                {/* Search Bar */}
                <div className="flex gap-2 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="검색"
                      value={searchQuery}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                      className="pl-9 bg-background border-border"
                    />
                  </div>
                  <Button className="bg-primary hover:bg-primary/90">검색</Button>
                </div>

                {/* User List */}
                <Card className="border-border bg-background">
                  <div className="divide-y divide-border">
                    {filteredUsers.length === 0 ? (
                      <div className="p-4 text-center text-muted-foreground">
                        {searchQuery ? '검색 결과가 없습니다.' : '사용자가 없습니다.'}
                      </div>
                    ) : (
                      filteredUsers.map((user) => (
                        <div
                          key={user.user_id}
                          className={`p-4 flex items-center justify-between cursor-pointer transition-colors ${
                            selectedUser?.user_id === user.user_id ? "bg-secondary" : "hover:bg-secondary/50"
                          }`}
                          onClick={() => setSelectedUser(user)}
                        >
                          <div className="flex flex-col">
                            <span className="text-foreground font-medium">{user.email}</span>
                            <span className="text-sm text-muted-foreground">{user.name}</span>
                          </div>
                          <div className="flex gap-2">
                            {user.status === "deactive" && (
                              <Badge variant="destructive" className="text-xs">
                                비활성
                              </Badge>
                            )}
                            {user.role === "admin" && (
                              <Badge variant="secondary" className="text-xs">
                                관리자
                              </Badge>
                            )}
                            <Badge variant="outline" className="text-xs">
                              {user.provider}
                            </Badge>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </Card>
              </div>
  
              {/* Detail Panel */}
              <div className="w-120">
                <Card className="border-border bg-background p-6 h-fit min-h-[500px]">
                  {selectedUser ? (
                    <>
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-foreground">상세 정보</h2>
                        {selectedUser.status === "deactive" && (
                          <Badge variant="destructive" className="text-xs">
                            비활성화된 계정
                          </Badge>
                        )}
                      </div>

                      <div className="space-y-6">
                        {/* Account */}
                        <div>
                          <label className="text-sm text-muted-foreground mb-2 block">계정</label>
                          <Input value={selectedUser.email} readOnly className="bg-background border-border" />
                        </div>

                        {/* Name */}
                        <div>
                          <label className="text-sm text-muted-foreground mb-2 block">이름</label>
                          <Input value={selectedUser.name} readOnly className="bg-background border-border" />
                        </div>

                        {/* Account Type */}
                        <div>
                          <label className="text-sm text-muted-foreground mb-2 block">계정 종류</label>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-foreground capitalize">{selectedUser.provider}</span>
                            <div className="text-right">
                              <div className="text-xs text-muted-foreground">마지막 접속</div>
                              <div className="text-sm text-foreground">
                                {new Date(selectedUser.last_login_at).toLocaleString('ko-KR')}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Role */}
                        <div>
                          <label className="text-sm text-muted-foreground mb-2 block">권한</label>
                          <Input 
                            value={selectedUser.role === "admin" ? "관리자" : "일반 사용자"} 
                            readOnly 
                            className="bg-background border-border" 
                          />
                        </div>

                        {/* Created Date */}
                        <div>
                          <label className="text-sm text-muted-foreground mb-2 block">가입일</label>
                          <Input 
                            value={new Date(selectedUser.created_at).toLocaleDateString('ko-KR')} 
                            readOnly 
                            className="bg-background border-border" 
                          />
                        </div>

                        {/* Status */}
                        <div>
                          <label className="text-sm text-muted-foreground mb-2 block">상태</label>
                          <div className="flex items-center justify-between">
                            <Input 
                              value={selectedUser.status === "active" ? "활성" : "비활성"} 
                              readOnly 
                              className="flex-1 bg-background border-border" 
                            />
                            <Button variant="outline" className="ml-2 border-border bg-transparent">
                              활동 로그 보기
                            </Button>
                          </div>
                        </div>

                        {/* Activation Status */}
                        <div>
                          <label className="text-sm text-muted-foreground mb-2 block">계정 관리</label>
                          <Button className="w-full bg-destructive hover:bg-destructive/90">
                            {selectedUser.status === "active" ? "계정 비활성화" : "계정 활성화"}
                          </Button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center text-muted-foreground py-8">
                      사용자를 선택해주세요
                    </div>
                  )}
                </Card>
              </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    )
  }
  