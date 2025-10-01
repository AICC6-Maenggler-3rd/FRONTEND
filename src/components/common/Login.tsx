import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Link } from 'react-router-dom';
import GoogleLogin from './GoogleLogin';
import KakaoLogin from './KakaoLogin';
import NaverLogin from './NaverLogin';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <Link
          to="/"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-10 transition-colors"
        >
          ← 메인 화면으로 돌아가기
        </Link>

        <Card className="shadow-xl">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-bold">로그인</CardTitle>
            <CardDescription className="text-base mt-4">
              소셜 계정으로 빠르게 시작하세요.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="w-full">
              <GoogleLogin />
            </div>

            <div className="w-full">
              <KakaoLogin />
            </div>

            <div className="w-full">
              <NaverLogin />
            </div>

            <div className="text-center pt-4">
              <p className="text-sm text-muted-foreground">
                로그인하면{' '}
                <Link to="/terms" className="text-blue-700 hover:underline">
                  이용약관
                </Link>{' '}
                및{' '}
                <Link to="/privacy" className="text-blue-700 hover:underline">
                  개인정보처리방침
                </Link>
                에 동의하게 됩니다.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
