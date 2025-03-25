
import { ReactNode, useState } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar 
        isOpen={isSidebarOpen} 
        toggleSidebar={toggleSidebar} 
      />
      
      <div className="flex-1 flex flex-col ml-0 md:ml-[280px]">
        <Header toggleSidebar={toggleSidebar} />
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
