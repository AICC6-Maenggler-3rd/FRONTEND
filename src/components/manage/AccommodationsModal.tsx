import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Search, Building2 } from 'lucide-react'
import { getAccommodationList } from '@/api/manage'
import type { Accommodation } from '@/api/accommodation'

interface AccommodationsModalProps {
  isOpen: boolean
  onClose: () => void
}

export const AccommodationsModal = ({ isOpen, onClose }: AccommodationsModalProps) => {
  const [items, setItems] = useState<Accommodation[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [query, setQuery] = useState('')

  useEffect(() => {
    if (isOpen) fetchList(page)
  }, [isOpen, page, query])

  const fetchList = async (pageNum: number) => {
    try {
      setLoading(true)
      const res = await getAccommodationList(pageNum, 12)
      setItems(res.data || [])
      setTotalPages(res.total_pages || 1)
    } catch {
      setError('숙소 목록을 불러오지 못했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const filtered = useMemo(() => {
    if (!query.trim()) return items
    const q = query.toLowerCase()
    return items.filter(i => i.name.toLowerCase().includes(q) || i.address.toLowerCase().includes(q))
  }, [items, query])

  const handleSearch = async () => {
    setPage(1)
    await fetchList(1)
  }

  const movePage = async (next: number) => {
    const newPage = Math.min(Math.max(1, next), totalPages)
    setPage(newPage)
    await fetchList(newPage)
  }

  const handleClose = () => {
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="z-[60] sm:max-w-[900px] max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-orange-100 rounded-full">
              <Building2 className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <DialogTitle>숙소 목록</DialogTitle>
              <DialogDescription>
                등록된 숙소 목록을 확인할 수 있습니다.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {loading ? (
          <div className="py-12 text-center">로딩 중...</div>
        ) : error ? (
          <div className="py-12 text-center text-destructive">{error}</div>
        ) : (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
            <Card className="p-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="숙소명 또는 주소 검색"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Button onClick={handleSearch}>검색</Button>
              </div>
            </Card>

            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs text-muted-foreground">이름</th>
                      <th className="px-4 py-2 text-left text-xs text-muted-foreground">주소</th>
                      <th className="px-4 py-2 text-left text-xs text-muted-foreground">유형</th>
                      <th className="px-4 py-2 text-left text-xs text-muted-foreground">전화</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filtered.map((a) => (
                      <tr key={a.accommodation_id} className="hover:bg-muted/50">
                        <td className="px-4 py-2 text-sm">{a.name}</td>
                        <td className="px-4 py-2 text-sm">{a.address}</td>
                        <td className="px-4 py-2 text-sm">{a.type}</td>
                        <td className="px-4 py-2 text-sm">{a.phone}</td>
                      </tr>
                    ))}
                    {filtered.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-4 py-8 text-center text-sm text-muted-foreground">검색 결과가 없습니다.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* 페이지네이션 */}
              {totalPages > 1 && (
                <div className="px-4 py-3 border-t border-border flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">페이지 {page} / {totalPages}</div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => movePage(page - 1)} disabled={page === 1}>이전</Button>
                    <Button variant="outline" size="sm" onClick={() => movePage(page + 1)} disabled={page === totalPages}>다음</Button>
                  </div>
                </div>
              )}
            </Card>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
