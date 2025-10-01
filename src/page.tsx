import { Header } from '@/layouts/header';
import App from '@/components/common/Intro';
import { Footer } from '@/layouts/footer';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <App />
      </main>
      <Footer />
    </div>
  );
}
