'use client';

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { AlertTriangle, Check, X, Shield } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { deleteUser, logout } from '@/api/auth';

type WithdrawalStep = 'confirmation' | 'reason' | 'complete';

const withdrawalReasons = [
  '서비스를 더이상 이용하지 않음',
  '다른 여행 서비스를 이용하게 됨',
  '개인정보 보호 우려',
  '서비스 품질 불만족',
  '사용법이 어려움',
  '기타 ( )',
];

export default function WithdrawalPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] =
    useState<WithdrawalStep>('confirmation');
  const [checkedItems, setCheckedItems] = useState<boolean[]>([
    false,
    false,
    false,
  ]);
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleCheckboxChange = (index: number, checked: boolean) => {
    const newCheckedItems = [...checkedItems];
    newCheckedItems[index] = checked;
    setCheckedItems(newCheckedItems);
  };

  const allItemsChecked = checkedItems.every((item) => item);

  const handleWithdrawalComplete = async () => {
    if (!selectedReason) {
      console.error('탈퇴 사유를 선택해 주세요.');
      return;
    }

    await handleDelete();
  };

  const reasonToSend = selectedReason.includes('( )') ? '' : selectedReason;

  const handleDelete = async () => {
    try {
      await deleteUser(reasonToSend);
      console.log('회원 탈퇴 API 호출 성공');
      setCurrentStep('complete');
      setShowCompleteModal(true);
    } catch (error) {
      console.error('회원 탈퇴 중 오류 발생:', error);
      setErrorMessage('회원 탈퇴에 실패했습니다.');
    }
  };

  const handleModalClose = async () => {
    // 먼저 페이지 이동을 수행하여 회원 탈퇴 페이지가 보이지 않도록 함
    navigate('/');

    // 모달 닫기
    setShowCompleteModal(false);

    try {
      await logout();
      console.log('탈퇴 후 백엔드 로그아웃 성공');
    } catch (error) {
      console.log('탈퇴 후 백엔드 로그아웃 실패:', error);
    }

    // 로그인 정보 초기화
    localStorage.removeItem('userInfo');

    // 브라우저 쿠키 삭제
    document.cookie.split(';').forEach(function (c) {
      document.cookie = c
        .replace(/^ +/, '')
        .replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
    });

    // 로그아웃 이벤트 발생시켜 header 상태 업데이트
    window.dispatchEvent(new CustomEvent('logout'));
  };

  const handleBackToProfile = () => {
    navigate('/mypage');
  };

  return (
    <div className="min-h-screen bg-white">
      <main className="flex-grow mr-10 pt-16 pb-14">
        <div className="container max-w-4xl mx-auto px-4 py-0">
          {/* Back to Profile Link */}
          <button
            onClick={handleBackToProfile}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors"
          >
            {/* Back Button */}
            <Link
              to="/mypage"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-10 mt-10 transition-colors"
            >
              ← 마이페이지로 돌아가기
            </Link>
          </button>

          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              ❌ 회원 탈퇴
            </h1>
            <p className="text-muted-foreground mt-4">
              서비스 탈퇴를 진행하기 전에 아래 내용을 확인해 주세요.
            </p>
          </div>

          {currentStep === 'confirmation' && (
            <div className="space-y-6">
              {/* Confirmation Section */}
              <Card className="p-6 border-2">
                <div className="flex items-start gap-3 mb-4">
                  <Shield className="w-5 h-5 text-primary mt-1.5" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">
                      탈퇴 전 확인사항{' '}
                      <span className="text-destructive">(필수)</span>
                    </h3>
                    <p className="text-sm text-muted-foreground mb-8">
                      아래 내용을 모두 확인하고 체크해 주세요.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="check1"
                      checked={checkedItems[0]}
                      onCheckedChange={(checked: boolean) =>
                        handleCheckboxChange(0, checked)
                      }
                    />
                    <Label htmlFor="check1" className="text-sm leading-relaxed">
                      탈퇴 신청 후에는 서비스 이용이 제한되며, 보관 기간 종료 후
                      계정 정보가 완전히 삭제됩니다.
                    </Label>
                  </div>

                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="check2"
                      checked={checkedItems[1]}
                      onCheckedChange={(checked: boolean) =>
                        handleCheckboxChange(1, checked)
                      }
                    />
                    <Label htmlFor="check2" className="text-sm leading-relaxed">
                      탈퇴 후 180일간은 법적 의무에 따라 일부 정보가 보관될 수
                      있습니다.
                    </Label>
                  </div>

                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="check3"
                      checked={checkedItems[2]}
                      onCheckedChange={(checked: boolean) =>
                        handleCheckboxChange(2, checked)
                      }
                    />
                    <Label htmlFor="check3" className="text-sm leading-relaxed">
                      탈퇴 후 일주일 내 로그인 시 재가입이 가능합니다.
                    </Label>
                  </div>
                </div>

                {/* Warning Box */}
                <div className="mt-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-destructive mt-0.5" />
                    <div className="ml-1">
                      <p className="text-sm font-medium text-destructive mb-1 mt-0.5">
                        이 작업은 되돌릴 수 없습니다.
                      </p>
                      <p className="text-sm text-destructive/80">
                        탈퇴를 진행하면 모든 데이터가 즉시 삭제되며, 복구할 수
                        없습니다.
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={handleBackToProfile}
                  className="flex-1 bg-transparent"
                >
                  이전으로
                </Button>
                <Button
                  onClick={() => setCurrentStep('reason')}
                  disabled={!allItemsChecked}
                  className="flex-1 bg-destructive hover:bg-destructive/90 text-black"
                >
                  탈퇴 완료
                </Button>
              </div>
            </div>
          )}

          {currentStep === 'reason' && (
            <div className="space-y-6">
              {/* Warning Section */}
              <Card className="p-4 bg-destructive/10 border border-destructive/20">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-destructive mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-destructive mb-2">
                      탈퇴 전 확인사항
                    </h3>
                    <ul className="text-sm text-destructive/80 space-y-1">
                      <li>• 탈퇴 시 모든 개인정보와 여행 기록이 삭제됩니다.</li>
                      <li>• 삭제된 정보는 복구할 수 없습니다.</li>
                      <li>• 탈퇴 후 30일간 재가입이 제한됩니다.</li>
                    </ul>
                  </div>
                </div>
              </Card>

              {/* Reason Selection */}
              <Card className="p-6 border-2">
                <div className="flex items-start gap-3 mb-4">
                  <Shield className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">
                      탈퇴 사유 <span className="text-destructive">(필수)</span>
                    </h3>
                    <p className="text-sm text-muted-foreground mb-8">
                      서비스 개선을 위해 탈퇴 사유를 선택해 주세요.
                    </p>
                  </div>
                </div>

                <RadioGroup
                  value={selectedReason}
                  onValueChange={setSelectedReason}
                  className="space-y-4"
                >
                  {withdrawalReasons.map((reason, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <RadioGroupItem value={reason} id={`reason-${index}`} />
                      <Label htmlFor={`reason-${index}`} className="text-sm">
                        {reason}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </Card>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep('confirmation')}
                  className="flex-1"
                >
                  취소
                </Button>
                <Button
                  onClick={handleWithdrawalComplete}
                  disabled={!selectedReason}
                  className="flex-1 bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                >
                  탈퇴 진행
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
      {/* Completion Modal */}
      <Dialog
        open={showCompleteModal}
        onOpenChange={(open) => {
          if (!open) {
            handleModalClose();
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center text-center p-6">
            <button
              onClick={handleModalClose}
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="mb-6 justify-between">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-primary-foreground font-bold text-lg">
                  I
                </span>
              </div>
              <h2 className="text-xl font-bold text-foreground">InPick</h2>
            </div>

            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-6">
              <Check className="w-8 h-8 text-primary-foreground" />
            </div>

            <div className="space-y-2">
              <p className="text-lg font-semibold text-foreground">
                탈퇴가 완료되었습니다.
              </p>
              <p className="text-muted-foreground">이용해 주셔서 감사합니다.</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
