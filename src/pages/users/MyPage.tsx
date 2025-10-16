import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { getUserInfo } from '@/api/auth';

interface UserInfo {
  name: string;
  email: string;
  provider: string;
  userId: string;
}

export default function ProfilePage() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 사용자 정보 로딩
  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        // API를 통해 실제 사용자 정보 가져오기
        const userData = await getUserInfo();
        console.log('API에서 받은 사용자 정보:', userData);
        console.log('userData.user:', userData?.user);

        if (userData && userData.user) {
          const user = userData.user;
          console.log('매핑할 사용자 데이터:', user);
          setUserInfo({
            name: user.name || '사용자',
            email: user.email || '',
            provider: user.provider || '알 수 없음',
            userId: user.id || '',
          });
          console.log('설정된 사용자 정보:', {
            name: user.name || '사용자',
            email: user.email || '',
            provider: user.provider || '알 수 없음',
            userId: user.id || '',
          });
        } else {
          // API에서 정보를 가져올 수 없는 경우 localStorage 확인
          const savedUserInfo = localStorage.getItem('userInfo');
          if (savedUserInfo) {
            setUserInfo(JSON.parse(savedUserInfo));
          } else {
            setUserInfo(null);
          }
        }
      } catch (error) {
        console.error('사용자 정보 로딩 실패:', error);
        // API 실패 시 localStorage에서 정보 확인
        try {
          const savedUserInfo = localStorage.getItem('userInfo');
          if (savedUserInfo) {
            setUserInfo(JSON.parse(savedUserInfo));
          } else {
            setUserInfo(null);
          }
        } catch (localError) {
          console.error('localStorage 읽기 실패:', localError);
          setUserInfo(null);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadUserInfo();
  }, []);

  // UI에 표시할 정보 배열 생성
  const profileInfo = userInfo
    ? [
        { label: '이름', value: `${userInfo.name} 님` },
        { label: '연동된 계정', value: userInfo.provider },
        { label: '이메일', value: userInfo.email },
      ]
    : [
        { label: '이름', value: '로그인 필요' },
        { label: '연동된 계정', value: '-' },
        { label: '이메일', value: '-' },
      ];
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 pt-16 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Back Button */}
          <Link
            to="/"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mt-10 mb-10 transition-colors"
          >
            ← 홈으로 돌아가기
          </Link>
          {/* Profile Overview */}
          <Card className="bg-white text-black">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl mb-2 text-black">
                  👤 회원 정보
                </CardTitle>
                <div className="mt-2 mb-4 text-right">
                  <Link to="/users/delete">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-500 hover:text-red-500"
                    >
                      {' '}
                      회원 탈퇴
                    </Button>
                  </Link>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0 ml-8">
              {isLoading ? (
                <div className="py-8 px-8 text-center">
                  <div className="text-muted-foreground">
                    사용자 정보를 불러오는 중...
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-[120px_1fr]">
                  <div className="border-r border-border py-5 px-2 space-y-5">
                    {profileInfo.map((item) => (
                      <div
                        key={item.label}
                        className="text-sm font-semibold text-muted-foreground"
                      >
                        {item.label}
                      </div>
                    ))}
                  </div>
                  <div className="py-4 px-8 space-y-4">
                    {profileInfo.map((item) => (
                      <div key={item.label} className="text-sm">
                        <input
                          value={item.value}
                          disabled={true}
                          className="text-base w-full bg-transparent border-none outline-none"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Schedule Management */}
          <Card className="bg-sky-50 border-none">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2 text-black">
                📅 일정 관리
              </CardTitle>
              <CardDescription className="mt-4">
                나의 여행 일정을 확인하고 관리하세요
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Link to="/schedule/1" className="block">
                  <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold">제주</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-black">
                          제주도 힐링 여행
                        </h4>
                        <p className="text-sm text-black">
                          2025.03.15 - 2025.03.18 (3박 4일)
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-800 mt-2">
                            • 4개 일정
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground mt-1">
                        → 상세보기
                      </div>
                    </div>
                  </div>
                </Link>

                <Link to="/schedule/2" className="block">
                  <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-secondary to-accent rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold">부산</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-black">
                          부산 맛집 투어
                        </h4>
                        <p className="text-sm text-black">
                          2025.02.20 - 2025.02.23 (3박 4일)
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-800 mt-2">
                            • 6개 일정
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground mt-1">
                        → 상세보기
                      </div>
                    </div>
                  </div>
                </Link>

                <Link to="/schedule/3" className="block">
                  <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-accent to-primary rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold">경주</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-black">
                          경주 역사 탐방
                        </h4>
                        <p className="text-sm text-black">
                          2025.01.10 - 2025.01.12 (2박 3일)
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-800 mt-2">
                            • 5개 일정
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground mt-1">
                        → 상세보기
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 text-right">
                    <Button variant="outline" size="sm" className="text-black">
                      {' '}
                      + 더보기
                    </Button>
                  </div>
                </Link>

                <div className="p-4 border-2 border-dashed border-muted rounded-lg text-center">
                  <div className="text-black mb-2">
                    새로운 여행을 계획해 보세요.
                  </div>
                  <Button variant="outline" size="sm" className="text-black">
                    ➕ 새 일정 만들기
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
