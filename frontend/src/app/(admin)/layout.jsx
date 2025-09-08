import React from 'react';
import DashboardSidebar from '../components/sidebar/page';
import { Toaster } from 'sonner';

export default function RootLayout({ children }) {
  return (
    <>
      <div className="flex h-screen">
        <DashboardSidebar role="admin" title="Best Wishes" subtitle />
        <div className="flex-1 p-8 overflow-auto">
          {children}
        </div>
      </div>
      <Toaster position="top-center" richColors closeButton />
    </>
  );
}
