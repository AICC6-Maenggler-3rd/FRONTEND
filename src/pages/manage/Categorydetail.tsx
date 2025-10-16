import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  FolderTree,
  ArrowLeft
} from "lucide-react"
import { Link } from "react-router-dom"
import { 
  getCategoriesList, 
  createCategory, 
  updateCategory, 
  toggleCategoryStatus, 
  deleteCategory
} from "@/api/manage"
import type { Category, CategoryCreateData } from "@/api/manage"

const Categorydetail = () => {
  const [categories, setCategories] = useState<Category[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newCategory, setNewCategory] = useState<CategoryCreateData>({ name: '', status: 'active' })
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [error, setError] = useState<string | null>(null)

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
    setNewCategory({ name: category.name, status: category.status })
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
          ? { ...cat, name: newCategory.name, status: newCategory.status }
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

  const handleToggleStatus = async (categoryId: number) => {
    try {
      const response = await toggleCategoryStatus(categoryId)
      setCategories(categories.map(cat => 
        cat.category_id === categoryId 
          ? { ...cat, status: response.new_status }
          : cat
      ))
      alert(response.message)
    } catch (error: any) {
      console.error('카테고리 상태 변경 실패:', error)
      alert(error.response?.data?.detail || '카테고리 상태 변경에 실패했습니다.')
    }
  }

  const handleCancelEdit = () => {
    setEditingCategory(null)
    setNewCategory({ name: '', status: 'active' })
    setShowAddForm(false)
  }

  if (loading) {
    return (
      <div className="flex-1 space-y-6 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-muted-foreground">카테고리 목록을 불러오는 중...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex-1 space-y-6 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>다시 시도</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-6 p-6">
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
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">상태</label>
              <select
                value={newCategory.status}
                onChange={(e) => setNewCategory({ ...newCategory, status: e.target.value })}
                className="w-full px-3 py-2 border border-input bg-background rounded-md"
              >
                <option value="active">활성</option>
                <option value="inactive">비활성</option>
              </select>
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
      <div className="grid gap-4">
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
          filteredCategories.map((category) => (
            <Card key={category.category_id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-foreground">{category.name}</h3>
                    <Badge variant={category.status === "active" ? "default" : "secondary"}>
                      {category.status === "active" ? "활성" : "비활성"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>장소 {category.place_count}개</span>
                    <span>•</span>
                    <span>생성일: {new Date(category.created_at).toLocaleDateString('ko-KR')}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleStatus(category.category_id)}
                  >
                    {category.status === "active" ? "비활성화" : "활성화"}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleEditCategory(category)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteCategory(category.category_id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

export default Categorydetail