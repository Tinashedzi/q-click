import { ReactNode } from 'react';
import Header from './Header';
import TabNav from './TabNav';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <TabNav />
      <main className="pt-14 md:pt-[6.25rem] pb-20 md:pb-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;
