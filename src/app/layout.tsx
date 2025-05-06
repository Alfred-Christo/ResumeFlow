import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import ThemeToggle from '@/components/ui/theme-toggle';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'ResumeFlow',
  description: 'Create and evaluate your resume with AI-powered tools.',
  icons: {
    icon: '/favicon.ico', // Assuming a favicon might be added later
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="antialiased flex flex-col min-h-screen bg-background text-foreground">
        <div id="floating-bg-shapes">
          <svg className="fg-shape" style={{top: '8%', left: '5%', width: 180, height: 180}} viewBox="0 0 180 180">
            <ellipse cx="90" cy="90" rx="80" ry="60" fill="hsl(170, 60%, 80%)" />
          </svg>
          <svg className="fg-shape" style={{top: '60%', left: '80%', width: 120, height: 120}} viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="55" fill="hsl(210, 60%, 90%)" />
          </svg>
          <svg className="fg-shape" style={{top: '70%', left: '15%', width: 100, height: 100}} viewBox="0 0 100 100">
            <rect x="10" y="10" width="80" height="80" rx="40" fill="hsl(210, 80%, 95%)" />
          </svg>
          <svg className="fg-shape" style={{top: '30%', left: '60%', width: 140, height: 140}} viewBox="0 0 140 140">
            <polygon points="70,10 130,130 10,130" fill="hsl(170, 60%, 85%)" />
          </svg>
          {/* Additional floating shapes for more visual interest */}
          <svg className="fg-shape" style={{top: '15%', left: '75%', width: 90, height: 90}} viewBox="0 0 90 90">
            <ellipse cx="45" cy="45" rx="40" ry="30" fill="hsl(200, 80%, 92%)" />
          </svg>
          <svg className="fg-shape" style={{top: '80%', left: '50%', width: 110, height: 110}} viewBox="0 0 110 110">
            <circle cx="55" cy="55" r="50" fill="hsl(170, 70%, 95%)" />
          </svg>
          <svg className="fg-shape" style={{top: '40%', left: '35%', width: 70, height: 70}} viewBox="0 0 70 70">
            <rect x="10" y="10" width="50" height="50" rx="25" fill="hsl(210, 70%, 98%)" />
          </svg>
          <svg className="fg-shape" style={{top: '55%', left: '25%', width: 80, height: 80}} viewBox="0 0 80 80">
            <polygon points="40,10 70,70 10,70" fill="hsl(170, 60%, 90%)" />
          </svg>
        </div>
        <Header />
        <div className="flex justify-end w-full max-w-7xl mx-auto mt-2 mb-[-2.5rem] z-10 relative">
          <ThemeToggle />
        </div>
        <main className="flex-grow container mx-auto px-4 py-8">
          {children}
        </main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
