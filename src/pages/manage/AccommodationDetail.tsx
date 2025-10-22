import { useState, useEffect, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Search, 
  Building2,
  ArrowLeft,
  MapPin,
  Phone,
  Calendar,
  Edit,
  Trash2
} from "lucide-react"
import { Link } from "react-router-dom"
import Sidebar from "./Sidebar"
import { 
  updateAccommodation,
  deleteAccommodation,
  createAccommodation,
  type AccommodationUpdateData,
  type AccommodationCreateData
} from "@/api/accommodation"
import type { Accommodation } from "@/api/accommodation"
import { searchAccommodation, getAccommodationList } from "@/api/manage"


const AccommodationDetail = () => {
  const [accommodations, setAccommodations] = useState<Accommodation[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [editingAccommodation, setEditingAccommodation] = useState<Accommodation | null>(null)
  const [showEditForm, setShowEditForm] = useState(false)
  const [editFormData, setEditFormData] = useState<AccommodationUpdateData>({})

  // 숙소 목록 조회 함수
  const fetchAccommodations = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      console.log('숙소 목록 조회 시작...')
      
      let response
      if (searchTerm.trim()) {
        response = await searchAccommodation(searchTerm, currentPage, 12)
      } else {
        response = await getAccommodationList(currentPage, 12)
      }
      
      console.log('숙소 목록 조회 응답:', response)
      
      if (response && response.data) {
        console.log('숙소 개수:', response.data.length)
        console.log('첫 번째 숙소 데이터:', response.data[0])
        setAccommodations(response.data)
        setTotalPages(response.total_pages)
        // 총 숙소 개수 계산 (total_pages * limit)
        const totalAccommodations = response.total_pages * 12
        setTotalCount(totalAccommodations)
      } else {
        console.log('응답에 data가 없습니다:', response)
        setAccommodations([])
      }
    } catch (err) {
      console.error('숙소 목록 조회 실패:', err)
      setError('숙소 목록을 불러오는데 실패했습니다.')
      setAccommodations([])
    } finally {
      setLoading(false)
    }
  }, [currentPage, searchTerm])

  // 숙소 목록 조회
  useEffect(() => {
    fetchAccommodations()
  }, [fetchAccommodations])

  const filteredAccommodations = accommodations.filter(accommodation =>
    accommodation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    accommodation.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    accommodation.type.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // 숙소 수정 함수
  const handleEditAccommodation = (accommodation: Accommodation) => {
    setEditingAccommodation(accommodation)
    setEditFormData({
      name: accommodation.name,
      address: accommodation.address,
      address_la: accommodation.address_la,
      address_lo: accommodation.address_lo,
      type: accommodation.type,
      phone: accommodation.phone,
      image_url: accommodation.image_url || ''
    })
    setShowEditForm(true)
  }

  // 숙소 수정/추가 저장
  const handleUpdateAccommodation = async () => {
    if (!editFormData.name || !editFormData.address || !editFormData.type || !editFormData.phone) {
      alert('필수 항목을 모두 입력해주세요.')
      return
    }

    try {
      if (editingAccommodation) {
        // 수정
        await updateAccommodation(editingAccommodation.accommodation_id, editFormData)
        alert('숙소가 성공적으로 수정되었습니다.')
      } else {
        // 추가
        const createData: AccommodationCreateData = {
          name: editFormData.name!,
          address: editFormData.address!,
          address_la: editFormData.address_la || 0,
          address_lo: editFormData.address_lo || 0,
          type: editFormData.type!,
          phone: editFormData.phone!,
          image_url: editFormData.image_url || undefined
        }
        await createAccommodation(createData)
        alert('숙소가 성공적으로 추가되었습니다.')
      }
      
      // 목록 새로고침
      await fetchAccommodations()
      
      setEditingAccommodation(null)
      setShowEditForm(false)
      setEditFormData({})
    } catch (error: any) {
      console.error('숙소 처리 실패:', error)
      alert(error.response?.data?.detail || '숙소 처리에 실패했습니다.')
    }
  }

  // 숙소 삭제 함수
  const handleDeleteAccommodation = async (accommodation: Accommodation) => {
    if (!window.confirm(`"${accommodation.name}" 숙소를 삭제하시겠습니까?`)) {
      return
    }

    try {
      await deleteAccommodation(accommodation.accommodation_id)
      
      // 목록 새로고침
      await fetchAccommodations()
      
      alert('숙소가 성공적으로 삭제되었습니다.')
    } catch (error: any) {
      console.error('숙소 삭제 실패:', error)
      alert(error.response?.data?.detail || '숙소 삭제에 실패했습니다.')
    }
  }

  // 수정 취소
  const handleCancelEdit = () => {
    setEditingAccommodation(null)
    setShowEditForm(false)
    setEditFormData({})
  }






  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">숙소 목록을 불러오는 중...</p>
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

        <div className="flex-1 space-y-6">
          {/* 헤더 */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">숙소 관리</h1>
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

          {/* 검색 및 필터 */}
          <Card className="p-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="숙소 이름, 주소, 타입으로 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Badge variant="secondary" className="gap-1">
                <Building2 className="h-3 w-3" />
                총 {totalCount}개
              </Badge>
            </div>
          </Card>


          {/* 숙소 수정/추가 폼 */}
          {showEditForm && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">
                {editingAccommodation ? '숙소 수정' : '새 숙소 추가'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">숙소 이름</label>
                  <Input
                    placeholder="숙소 이름을 입력하세요"
                    value={editFormData.name || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">숙소 타입</label>
                  <Input
                    placeholder="호텔, 펜션, 게스트하우스 등"
                    value={editFormData.type || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, type: e.target.value })}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-foreground mb-2 block">주소</label>
                  <Input
                    placeholder="주소를 입력하세요"
                    value={editFormData.address || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">위도 (Latitude)</label>
                  <Input
                    type="number"
                    step="any"
                    placeholder="37.5665"
                    value={editFormData.address_la || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, address_la: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">경도 (Longitude)</label>
                  <Input
                    type="number"
                    step="any"
                    placeholder="126.9780"
                    value={editFormData.address_lo || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, address_lo: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">전화번호</label>
                  <Input
                    placeholder="02-1234-5678"
                    value={editFormData.phone || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-foreground mb-2 block">이미지 URL</label>
                  <Input
                    placeholder="https://example.com/image.jpg"
                    value={editFormData.image_url || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, image_url: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-6">
                <Button onClick={handleUpdateAccommodation}>
                  {editingAccommodation ? '수정' : '추가'}
                </Button>
                <Button variant="outline" onClick={handleCancelEdit}>취소</Button>
              </div>
            </Card>
          )}

          {/* 숙소 목록 */}
          <div className="space-y-4">
            {filteredAccommodations.length === 0 ? (
              <Card className="p-8 text-center">
                <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">숙소가 없습니다</h3>
                <p className="text-muted-foreground mb-4">검색어를 변경해보세요</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredAccommodations.map((accommodation) => (
                  <Card key={accommodation.accommodation_id} className="p-4 hover:shadow-md transition-shadow">
                    <div className="space-y-3">
                      {/* 숙소 헤더 */}
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base font-semibold text-foreground truncate" title={accommodation.name}>
                            {accommodation.name}
                          </h3>
                          <Badge variant="default" className="mt-1 text-xs">
                            {accommodation.type}
                          </Badge>
                        </div>
                      </div>

                      {/* 숙소 정보 */}
                      <div className="space-y-2">
                        <div className="flex items-start gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <span className="line-clamp-2">{accommodation.address}</span>
                        </div>
                        
                        {accommodation.phone && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Phone className="h-4 w-4" />
                            <span>{accommodation.phone}</span>
                          </div>
                        )}
                        

                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>등록일: {formatDate(accommodation.created_at)}</span>
                        </div>
                      </div>

                      {/* 액션 버튼들 */}
                      <div className="flex items-center gap-1 pt-2 border-t border-border/50">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEditAccommodation(accommodation)}
                          className="h-8 px-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeleteAccommodation(accommodation)}
                          className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>

                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                이전
              </Button>
              <span className="text-sm text-muted-foreground">
                {currentPage} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                다음
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AccommodationDetail
