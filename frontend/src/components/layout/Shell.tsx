import type { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';

export default function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-8">
        {children}
      </main>
      <Footer />
    </div>
  );
}
