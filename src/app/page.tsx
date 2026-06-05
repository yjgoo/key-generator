import { KeyGenerators } from '@/components/KeyGenerators';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { Introduction } from '@/components/Introduction';
import { FAQ } from '@/components/FAQ';
import { Footer } from '@/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      <main>
        <Hero />
        <KeyGenerators />
        <Introduction />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}
