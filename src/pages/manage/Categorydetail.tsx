import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  FolderTree,
  ArrowLeft
} from "lucide-react"
import { Link } from "react-router-dom"
import Sidebar from "./Sidebar"
import { 
  getCategoriesList, 
  createCategory, 
  updateCategory, 
  deleteCategory
} from "@/api/manage"
import { getPlacesByCategory } from "@/api/place"
import type { Category, CategoryCreateData } from "@/api/manage"
import type { Place } from "@/api/place"

const Categorydetail = () => {
  const [categories, setCategories] = useState<Category[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newCategory, setNewCategory] = useState<CategoryCreateData>({ name: '', status: 'active' })
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showPlaceModal, setShowPlaceModal] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [places, setPlaces] = useState<Place[]>([])
  const [placesLoading, setPlacesLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalPlaces, setTotalPlaces] = useState(0)
  const itemsPerPage = 10

  // 실제 API에서 카테고리 목록 조회
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        setError(null)
        console.log('카테고리 목록 조회 시작...')
        const response = await getCategoriesList()
        console.log('카테고리 목록 조회 응답:', response)
        
        // 응답 데이터 구조 확인
        if (response && response.categories) {
          console.log('카테고리 개수:', response.categories.length)
          setCategories(response.categories)
        } else {
          console.log('응답에 categories가 없습니다:', response)
          setCategories([])
        }
      } catch (err) {
        console.error('카테고리 목록 조회 실패:', err)
        setError('카테고리 목록을 불러오는데 실패했습니다.')
        // 오류 발생 시 빈 배열로 설정
        setCategories([])
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddCategory = async () => {
    if (!newCategory.name.trim()) {
      alert('카테고리 이름을 입력해주세요.')
      return
    }

    try {
      const response = await createCategory(newCategory)
      // 새 카테고리를 목록에 추가
      setCategories([...categories, response.category])
      setNewCategory({ name: '', status: 'active' })
      setShowAddForm(false)
      alert(response.message)
    } catch (error: any) {
      console.error('카테고리 생성 실패:', error)
      alert(error.response?.data?.detail || '카테고리 생성에 실패했습니다.')
    }
  }

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category)
    setNewCategory({ name: category.name, status: 'active' })
    setShowAddForm(true)
  }

  const handleUpdateCategory = async () => {
    if (!editingCategory || !newCategory.name.trim()) {
      alert('카테고리 이름을 입력해주세요.')
      return
    }

    try {
      await updateCategory(editingCategory.category_id, newCategory)
      // 카테고리 목록 업데이트
      setCategories(categories.map(cat => 
        cat.category_id === editingCategory.category_id 
          ? { ...cat, name: newCategory.name, status: 'active' }
          : cat
      ))
      setEditingCategory(null)
      setNewCategory({ name: '', status: 'active' })
      setShowAddForm(false)
      alert('카테고리가 성공적으로 수정되었습니다.')
    } catch (error: any) {
      console.error('카테고리 수정 실패:', error)
      alert(error.response?.data?.detail || '카테고리 수정에 실패했습니다.')
    }
  }

  const handleDeleteCategory = async (categoryId: number) => {
    if (!window.confirm('정말로 이 카테고리를 삭제하시겠습니까?')) {
      return
    }

    try {
      await deleteCategory(categoryId)
      setCategories(categories.filter(cat => cat.category_id !== categoryId))
      alert('카테고리가 성공적으로 삭제되었습니다.')
    } catch (error: any) {
      console.error('카테고리 삭제 실패:', error)
      alert(error.response?.data?.detail || '카테고리 삭제에 실패했습니다.')
    }
  }


  const handleCancelEdit = () => {
    setEditingCategory(null)
    setNewCategory({ name: '', status: 'active' })
    setShowAddForm(false)
  }

  const handlePlaceCountClick = async (category: Category) => {
    try {
      setSelectedCategory(category)
      setShowPlaceModal(true)
      setPlacesLoading(true)
      setCurrentPage(1)
      
      // 실제 API에서 카테고리별 장소 목록 조회
      const response = await getPlacesByCategory(category.category_id, 1, itemsPerPage)
      setPlaces(response.places || [])
      setTotalPlaces(response.total_count || 0)
      setTotalPages(Math.ceil((response.total_count || 0) / itemsPerPage))
    } catch (error) {
      console.error('장소 목록 조회 실패:', error)
      alert('장소 목록을 불러오는데 실패했습니다.')
      setPlaces([])
      setTotalPlaces(0)
      setTotalPages(1)
    } finally {
      setPlacesLoading(false)
    }
  }

  const handleClosePlaceModal = () => {
    setShowPlaceModal(false)
    setSelectedCategory(null)
    setPlaces([])
    setCurrentPage(1)
    setTotalPages(1)
    setTotalPlaces(0)
  }

  const handlePageChange = async (page: number) => {
    if (!selectedCategory) return
    
    try {
      setPlacesLoading(true)
      const response = await getPlacesByCategory(selectedCategory.category_id, page, itemsPerPage)
      setPlaces(response.places || [])
      setCurrentPage(page)
    } catch (error) {
      console.error('장소 목록 조회 실패:', error)
      alert('장소 목록을 불러오는데 실패했습니다.')
    } finally {
      setPlacesLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">카테고리 목록을 불러오는 중...</p>
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
              <h1 className="text-3xl font-bold text-foreground">카테고리 관리</h1>
              <p className="text-muted-foreground"></p>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={() => setShowAddForm(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                새 카테고리 추가
              </Button>
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
                  placeholder="카테고리 이름이나 설명으로 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Badge variant="secondary" className="gap-1">
                <FolderTree className="h-3 w-3" />
                총 {filteredCategories.length}개
              </Badge>
            </div>
          </Card>

          {/* 새 카테고리 추가/수정 폼 */}
          {showAddForm && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">
                {editingCategory ? '카테고리 수정' : '새 카테고리 추가'}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">카테고리 이름</label>
                  <Input
                    placeholder="카테고리 이름을 입력하세요"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={editingCategory ? handleUpdateCategory : handleAddCategory}>
                    {editingCategory ? '수정' : '추가'}
                  </Button>
                  <Button variant="outline" onClick={handleCancelEdit}>취소</Button>
                </div>
              </div>
            </Card>
          )}

          {/* 카테고리 목록 */}
          <div className="space-y-4">
            {filteredCategories.length === 0 ? (
              <Card className="p-8 text-center">
                <FolderTree className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">카테고리가 없습니다</h3>
                <p className="text-muted-foreground mb-4">새 카테고리를 추가하거나 검색어를 변경해보세요</p>
                <Button onClick={() => setShowAddForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  첫 카테고리 추가
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredCategories.map((category) => (
                  <Card key={category.category_id} className="p-4 hover:shadow-md transition-shadow">
                    <div className="space-y-3">
                      {/* 카테고리 헤더 */}
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base font-semibold text-foreground truncate" title={category.name}>
                            {category.name}
                          </h3>
                        </div>
                      </div>

                      {/* 카테고리 정보 */}
                      <div className="space-y-2">
                        {/* 장소 수 섹션 */}
                        <div 
                          className="relative overflow-hidden rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 p-4 cursor-pointer hover:from-indigo-600 hover:to-purple-700 transition-all"
                          onClick={() => handlePlaceCountClick(category)}
                        >
                          <div className="relative z-10">
                            <div className="flex items-center justify-between">
                              <div className="text-white">
                                <p className="text-xs font-medium opacity-90">장소 수</p>
                                <p className="text-2xl font-bold">{category.place_count}</p>
                              </div>
                              <div className="text-white/20">
                                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                </svg>
                              </div>
                            </div>
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
                        </div>
                      </div>

                      {/* 액션 버튼들 */}
                      <div className="flex items-center gap-1 pt-2 border-t border-border/50">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEditCategory(category)}
                          className="h-8 px-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteCategory(category.category_id)}
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
        </div>
      </div>

      {/* 장소 목록 모달 */}
      <Dialog open={showPlaceModal} onOpenChange={handleClosePlaceModal}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FolderTree className="h-5 w-5" />
              {selectedCategory?.name} 장소 목록
            </DialogTitle>
          </DialogHeader>
          
          <div className="max-h-96 overflow-y-auto">
            {placesLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span className="ml-2 text-muted-foreground">장소 목록을 불러오는 중...</span>
              </div>
            ) : places.length === 0 ? (
              <div className="text-center py-8">
                <FolderTree className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">장소가 없습니다</h3>
                <p className="text-muted-foreground">이 카테고리에 등록된 장소가 없습니다.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {places.map((place) => (
                  <Card key={place.place_id} className="p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground mb-1">{place.name}</h4>
                        <p className="text-sm text-muted-foreground mb-2">{place.address}</p>
                        {place.description && (
                          <p className="text-xs text-muted-foreground line-clamp-2">{place.description}</p>
                        )}
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span>타입: {place.type}</span>
                          <span>•</span>
                          <span>조회수: {place.count}</span>
                          {place.open_hour && place.close_hour && (
                            <>
                              <span>•</span>
                              <span>운영시간: {place.open_hour} - {place.close_hour}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Badge variant="default" className="text-xs">
                          {place.type}
                        </Badge>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex justify-between items-center pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              총 {totalPlaces}개의 장소 (페이지 {currentPage} / {totalPages})
            </div>
            <Button variant="outline" onClick={handleClosePlaceModal}>
              닫기
            </Button>
          </div>
          
          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 pt-4 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                이전
              </Button>
              
              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(pageNum)}
                      className="w-8 h-8 p-0"
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                다음
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Categorydetail