import { KeyGenerators } from '@/components/KeyGenerators';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { Introduction } from '@/components/Introduction';
import { FAQ } from '@/components/FAQ';
import { Footer } from '@/components/Footer';
import { AdSlot } from '@/components/AdSlot';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      <main>
        <Hero />
        <KeyGenerators />
        <Introduction />
        <AdSlot placement="inline-banner" />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}
