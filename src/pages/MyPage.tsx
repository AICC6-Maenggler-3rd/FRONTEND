import { Header } from '@/layouts/header';
import { Footer } from '@/layouts/footer';
import MyPageComponent from '@/pages/users/MyPage';

export default function MyPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <MyPageComponent />
      </main>
      <Footer />
    </div>
  );
}
