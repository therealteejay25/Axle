'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import Axle from '@/components/Axle';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="h-screen w-screen flex bg-linear-to-b min-h-screen from-background to-[#090D0A]">
      <Sidebar collapsed={sidebarCollapsed} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={() => setSidebarCollapsed(!sidebarCollapsed)} />
        
        <main className="flex overflow-auto justify-center w-full">
          <div className="container w-full mx-auto h-full p-6">
            {children}
          </div>
            <Axle />
        </main>
      </div>
    </div>
  );
}
