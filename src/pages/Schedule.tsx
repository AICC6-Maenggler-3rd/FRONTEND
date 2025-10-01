import { Header } from '@/layouts/header';
import { Footer } from '@/layouts/footer';
import ScheduleDetailPage from '@/components/common/Schedule';

export default function SchedulePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <ScheduleDetailPage />
      </main>
      <Footer />
    </div>
  );
}
