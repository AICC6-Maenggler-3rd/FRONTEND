import { useEffect, useRef, useState } from 'react'
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
import { Search, Users } from 'lucide-react'
import { getSnsAccounts, updateSnsAccount, deleteSnsAccount } from '@/api/manage'

interface SnsAccount {
  nickname: string
  places_count: number
  last_activity?: string
}

interface SnsAccountsModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export const SnsAccountsModal = ({ isOpen, onClose, onSuccess }: SnsAccountsModalProps) => {
  const [accounts, setAccounts] = useState<SnsAccount[]>([])
  const [filtered, setFiltered] = useState<SnsAccount[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [showEdit, setShowEdit] = useState(false)
  const [formLoading, setFormLoading] = useState(false)
  const [formNickname, setFormNickname] = useState('')
  const [editing, setEditing] = useState<SnsAccount | null>(null)
  const contentRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (isOpen) fetchList()
  }, [isOpen])

  useEffect(() => {
    const f = accounts.filter(a => a.nickname.toLowerCase().includes(search.toLowerCase()))
    setFiltered(f)
  }, [accounts, search])

  const fetchList = async () => {
    try {
      setLoading(true)
      const data = await getSnsAccounts()
      setAccounts(data.accounts || [])
    } catch {
      setError('SNS 계정 목록을 불러오지 못했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenEdit = (account: SnsAccount) => {
    setEditing(account)
    setFormNickname(account.nickname)
    setShowEdit(true)
  }

  const handleClose = () => {
    if (formLoading) return
    setSearch('')
    setShowEdit(false)
    setEditing(null)
    setFormNickname('')
    onClose()
  }

  const handleSubmit = async () => {
    if (!formNickname.trim()) return
    try {
      setFormLoading(true)
      if (showEdit && editing) {
        await updateSnsAccount(editing.nickname, formNickname.trim())
      }
      await fetchList()
      onSuccess()
      setShowEdit(false)
    } catch (e: any) {
      setError(e?.response?.data?.detail || '처리에 실패했습니다.')
    } finally {
      setFormLoading(false)
    }
  }

  const handleDelete = async (account: SnsAccount) => {
    if (!confirm(`'${account.nickname}' 계정을 삭제할까요?`)) return
    try {
      await deleteSnsAccount(account.nickname)
      await fetchList()
      onSuccess()
    } catch (e: any) {
      setError(e?.response?.data?.detail || '삭제에 실패했습니다.')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        ref={contentRef as any}
        tabIndex={-1}
        onOpenAutoFocus={(e) => {
          e.preventDefault()
          contentRef.current?.focus()
        }}
        className="z-[60] sm:max-w-[800px] max-h-[80vh] overflow-hidden"
      >
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-100 rounded-full">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <DialogTitle>SNS 계정</DialogTitle>
              <DialogDescription>
                SNS 계정을 수정/삭제할 수 있습니다.
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
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="닉네임 검색"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
            </Card>

            {showEdit && (
              <Card className="p-4">
                <div className="flex gap-2 items-end">
                  <div className="flex-1">
                    <label className="text-xs text-muted-foreground mb-1 block">인스타그램 닉네임</label>
                    <Input
                      placeholder="@username"
                      value={formNickname}
                      onChange={(e) => setFormNickname(e.target.value)}
                    />
                  </div>
                  <Button onClick={handleSubmit} disabled={formLoading}>
                    {formLoading ? '처리 중...' : '수정'}
                  </Button>
                  <Button variant="outline" onClick={() => setShowEdit(false)}>취소</Button>
                </div>
              </Card>
            )}

            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs text-muted-foreground">닉네임</th>
                      <th className="px-4 py-2 text-left text-xs text-muted-foreground">장소 수</th>
                      <th className="px-4 py-2 text-left text-xs text-muted-foreground">액션</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filtered.map((acc) => (
                      <tr key={acc.nickname}>
                        <td className="px-4 py-2 text-sm">@{acc.nickname}</td>
                        <td className="px-4 py-2 text-sm">{acc.places_count}</td>
                        <td className="px-4 py-2 text-sm">
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleOpenEdit(acc)}>수정</Button>
                            <Button variant="outline" size="sm" onClick={() => handleDelete(acc)}>삭제</Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
