import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Sidebar from "./Sidebar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, ArrowLeft } from "lucide-react"
import { getUsersList, deleteUser, toggleUserStatus, getUserActivityLogs } from "@/api/manage"

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

interface ActivityLog {
  id: number
  action: string
  description: string
  ip_address: string
  user_agent: string
  created_at: string
}

// 계정 종류별 로고 컴포넌트
const ProviderLogo = ({ provider }: { provider: string }) => {
  const getProviderInfo = (provider: string) => {
    switch (provider.toLowerCase()) {
      case 'naver':
        return {
          color: 'bg-green-500',
          icon: 'N',
          shape: 'rounded-sm'
        }
      case 'kakao':
        return {
          color: 'bg-yellow-400',
          icon: 'K',
          shape: 'rounded-lg'
        }
      case 'google':
        return {
          color: 'bg-blue-500',
          icon: 'G',
          shape: 'rounded'
        }
      default:
        return {
          color: 'bg-gray-500',
          icon: provider.charAt(0).toUpperCase(),
          shape: 'rounded'
        }
    }
  }

  const providerInfo = getProviderInfo(provider)

  return (
    <div className="flex items-center gap-2">
      <div className={`w-6 h-6 ${providerInfo.color} ${providerInfo.shape} flex items-center justify-center text-white font-bold text-xs`}>
        {providerInfo.icon}
      </div>
      <span className="text-sm text-foreground capitalize">{provider}</span>
    </div>
  )
}

export default function MembersPage() {
  const navigate = useNavigate()
  const [users, setUsers] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
  const [showActivityLogs, setShowActivityLogs] = useState(false)
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([])
  const [logsLoading, setLogsLoading] = useState(false)

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

  // 계정 상태 변경 함수
  const handleToggleStatus = async () => {
    if (!selectedUser) return
    
    try {
      setActionLoading(true)
      await toggleUserStatus(selectedUser.user_id)
      
      // 사용자 목록 새로고침
      const usersData = await getUsersList()
      setUsers(usersData)
      
      // 현재 선택된 사용자 정보 업데이트
      const updatedUser = usersData.find((u: User) => u.user_id === selectedUser.user_id)
      if (updatedUser) {
        setSelectedUser(updatedUser)
      }
    } catch (err) {
      setError('계정 상태 변경에 실패했습니다.')
      console.error('계정 상태 변경 실패:', err)
    } finally {
      setActionLoading(false)
    }
  }

  // 계정 삭제 함수
  const handleDeleteUser = async () => {
    if (!selectedUser) return
    
    try {
      setActionLoading(true)
      await deleteUser(selectedUser.user_id)
      
      // 사용자 목록에서 제거
      const updatedUsers = users.filter((u: User) => u.user_id !== selectedUser.user_id)
      setUsers(updatedUsers)
      
      // 선택된 사용자 초기화
      setSelectedUser(updatedUsers.length > 0 ? updatedUsers[0] : null)
      setShowDeleteConfirm(false)
    } catch (err) {
      setError('계정 삭제에 실패했습니다.')
      console.error('계정 삭제 실패:', err)
    } finally {
      setActionLoading(false)
    }
  }

  // 활동 로그 조회 함수
  const handleShowActivityLogs = async () => {
    if (!selectedUser) return
    
    try {
      setLogsLoading(true)
      const response = await getUserActivityLogs(selectedUser.user_id)
      setActivityLogs(response.activity_logs || [])
      setShowActivityLogs(true)
    } catch (err) {
      setError('활동 로그를 불러오는데 실패했습니다.')
      console.error('활동 로그 조회 실패:', err)
    } finally {
      setLogsLoading(false)
    }
  }
  
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
                뒤로가기
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

                        {/* Account Type and Last Login */}
                        <div className="flex gap-4">
                          <div className="flex-1">
                            <label className="text-sm text-muted-foreground mb-2 block">계정 종류</label>
                            <div className="h-10 px-3 py-2 bg-background border border-border rounded-md flex items-center">
                              <ProviderLogo provider={selectedUser.provider} />
                            </div>
                          </div>
                          <div className="flex-1">
                            <label className="text-sm text-muted-foreground mb-2 block">마지막 접속</label>
                            <Input 
                              value={new Date(selectedUser.last_login_at).toLocaleString('ko-KR')} 
                              readOnly 
                              className="bg-background border-border" 
                            />
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
                            <Button 
                              variant="outline" 
                              className="ml-2 border-border bg-transparent"
                              onClick={handleShowActivityLogs}
                              disabled={logsLoading}
                            >
                              {logsLoading ? "로딩 중..." : "활동 로그 보기"}
                            </Button>
                          </div>
                        </div>

                        {/* Activation Status */}
                        <div>
                          <label className="text-sm text-muted-foreground mb-2 block">계정 관리</label>
                          <div className="flex gap-2">
                            <Button 
                              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
                              onClick={handleToggleStatus}
                              disabled={actionLoading}
                            >
                              {actionLoading ? "처리 중..." : selectedUser.status === "active" ? "계정 비활성화" : "계정 활성화"}
                            </Button>
                            <Button 
                              className="flex-1 bg-red-500 hover:bg-red-600 text-white"
                              onClick={() => setShowDeleteConfirm(true)}
                              disabled={actionLoading}
                            >
                              계정 삭제
                            </Button>
                          </div>
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

        {/* 활동 로그 모달 */}
        {showActivityLogs && selectedUser && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-background border border-border rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">
                  {selectedUser.name}의 활동 로그
                </h3>
                <Button 
                  variant="outline" 
                  onClick={() => setShowActivityLogs(false)}
                  className="text-sm"
                >
                  닫기
                </Button>
              </div>
              
              <div className="flex-1 overflow-y-auto">
                {activityLogs.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    활동 로그가 없습니다.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {activityLogs.map((log) => (
                      <Card key={log.id} className="p-4 border-border bg-background">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline" className="text-xs">
                                {log.action}
                              </Badge>
                              <span className="text-sm text-muted-foreground">
                                {new Date(log.created_at).toLocaleString('ko-KR')}
                              </span>
                            </div>
                            <p className="text-sm text-foreground mb-2">{log.description}</p>
                            <div className="text-xs text-muted-foreground space-y-1">
                              <div>IP: {log.ip_address}</div>
                              <div className="truncate">User Agent: {log.user_agent}</div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 삭제 확인 다이얼로그 */}
        {showDeleteConfirm && selectedUser && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-background border border-border rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-foreground mb-4">계정 삭제 확인</h3>
              <p className="text-muted-foreground mb-6">
                <strong>{selectedUser.name}</strong> ({selectedUser.email}) 계정을 삭제하시겠습니까?<br/>
                <span className="text-destructive text-sm">이 작업은 되돌릴 수 없습니다.</span>
              </p>
              <div className="flex gap-2 justify-end">
                <Button 
                  variant="outline" 
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={actionLoading}
                >
                  취소
                </Button>
                <Button 
                  className="bg-destructive hover:bg-destructive/90"
                  onClick={handleDeleteUser}
                  disabled={actionLoading}
                >
                  {actionLoading ? "삭제 중..." : "삭제"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }
  