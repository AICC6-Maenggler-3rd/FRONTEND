import { useState, useEffect, useCallback } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  MapPin,
  Calendar,
  TrendingUp
} from "lucide-react";
import { getSnsAccounts } from '@/api/manage';

interface SnsAccount {
  nickname: string;
  places_count: number;
  last_activity?: string;
}

interface SnsAccountListProps {
  onAccountSelect?: (account: SnsAccount) => void;
}

const SnsAccountList = ({ onAccountSelect }: SnsAccountListProps) => {
  const [accounts, setAccounts] = useState<SnsAccount[]>([]);
  const [filteredAccounts, setFilteredAccounts] = useState<SnsAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'nickname' | 'places_count'>('places_count');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPlacesCount, setTotalPlacesCount] = useState(0);
  const [snsPlacesCount, setSnsPlacesCount] = useState(0);

  const fetchSnsAccounts = async () => {
    try {
      setLoading(true);
      const accountsData = await getSnsAccounts();

      // API에서 이미 상세 정보를 제공하므로 그대로 사용
      setAccounts(accountsData.accounts || []);
      setTotalPlacesCount(accountsData.total_places_count || 0);
      setSnsPlacesCount(accountsData.sns_places_count || 0);
    } catch (error) {
      console.error('SNS 계정 목록 조회 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortAccounts = useCallback(() => {
    const filtered = accounts.filter(account =>
      account.nickname.toLowerCase().includes(searchTerm.toLowerCase())
    );

    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = (bValue as string).toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    setFilteredAccounts(filtered);
    setCurrentPage(1);
  }, [accounts, searchTerm, sortBy, sortOrder]);

  useEffect(() => {
    fetchSnsAccounts();
  }, []);

  useEffect(() => {
    filterAndSortAccounts();
  }, [filterAndSortAccounts]);

  const handleSort = (field: 'nickname' | 'places_count') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const handleAccountClick = (account: SnsAccount) => {
    if (onAccountSelect) {
      onAccountSelect(account);
    }
  };

  const formatKoreanDate = (dateString: string | undefined) => {
    if (!dateString) return '정보 없음';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '정보 없음';
      
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const hours = date.getHours();
      const minutes = date.getMinutes();
      
      return `${year}년 ${month}월 ${day}일 ${hours}시 ${minutes}분`;
    } catch {
      return '정보 없음';
    }
  };

  // 페이지네이션 계산
  const totalPages = Math.ceil(filteredAccounts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAccounts = filteredAccounts.slice(startIndex, endIndex);


  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">SNS 계정 목록을 불러오는 중...</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* 검색 및 필터 */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="SNS 계정 닉네임으로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant={sortBy === 'places_count' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleSort('places_count')}
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              장소 수 {sortBy === 'places_count' && (sortOrder === 'desc' ? '↓' : '↑')}
            </Button>
            <Button
              variant={sortBy === 'nickname' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleSort('nickname')}
            >
              닉네임 {sortBy === 'nickname' && (sortOrder === 'desc' ? '↓' : '↑')}
            </Button>
          </div>
        </div>
      </Card>

      {/* 통계 요약 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">총 계정 수</p>
              <p className="text-2xl font-bold">{accounts.length}</p>
            </div>
            <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
              <MapPin className="h-4 w-4 text-blue-600" />
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">SNS 등록 장소</p>
              <p className="text-2xl font-bold">
                {snsPlacesCount.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                전체 장소: {totalPlacesCount.toLocaleString()}개
              </p>
            </div>
            <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* 계정 목록 테이블 */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  SNS 계정
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  등록 장소 수
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  최근 활동
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {currentAccounts.map((account) => (
                <tr 
                  key={account.nickname} 
                  className="hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => handleAccountClick(account)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-8 w-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {account.nickname.charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-foreground">
                          @{account.nickname}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Instagram
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 text-muted-foreground mr-2" />
                      <span className="text-sm font-medium">{account.places_count}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      {formatKoreanDate(account.last_activity)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="px-6 py-3 border-t border-border">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                {startIndex + 1}-{Math.min(endIndex, filteredAccounts.length)} / {filteredAccounts.length}개 계정
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  이전
                </Button>
                <div className="flex gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
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
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  다음
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default SnsAccountList;
