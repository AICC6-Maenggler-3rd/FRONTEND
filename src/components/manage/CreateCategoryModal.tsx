import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { createCategory } from '@/api/manage'
import { FolderTree } from 'lucide-react'

interface CreateCategoryModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export const CreateCategoryModal = ({ isOpen, onClose, onSuccess }: CreateCategoryModalProps) => {
  const [categoryName, setCategoryName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!categoryName.trim()) {
      setError('카테고리명을 입력해주세요.')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      await createCategory({
        name: categoryName.trim(),
        status: 'active'
      })
      
      // 성공 시 폼 초기화 및 모달 닫기
      setCategoryName('')
      onSuccess()
      onClose()
    } catch (error: any) {
      console.error('카테고리 생성 실패:', error)
      setError(error.response?.data?.detail || '카테고리 생성에 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    if (!isLoading) {
      setCategoryName('')
      setError('')
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-100 rounded-full">
              <FolderTree className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <DialogTitle>새 카테고리 생성</DialogTitle>
              <DialogDescription>
                새로운 카테고리를 생성합니다. 카테고리명은 중복될 수 없습니다.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="categoryName" className="text-sm font-medium">
              카테고리명
            </label>
            <Input
              id="categoryName"
              type="text"
              placeholder="카테고리명을 입력하세요"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              disabled={isLoading}
              className={error ? 'border-red-500' : ''}
            />
            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              취소
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !categoryName.trim()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? '생성 중...' : '카테고리 생성'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
