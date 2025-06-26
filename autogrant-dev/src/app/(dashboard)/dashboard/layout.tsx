"use client";

import React, { useEffect } from 'react';
import { useAuth } from '@/context/authcontext';
import { useRouter } from 'next/navigation';
import Sidebar from "@/components/dashboard/sidebar";
import TopBar from "@/components/dashboard/topbar";
import { ProfileProvider } from "@/context/ProfileContext";

// A simple loading component for the whole screen
const FullScreenLoader = () => (
    <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <p>Loading Dashboard...</p>
    </div>
);

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  if (authLoading || !user) {
    return <FullScreenLoader />;
  }
  
  return (
    <ProfileProvider>
      <div className="flex h-screen overflow-hidden bg-gray-50">
        <Sidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <TopBar className="md:flex" />
          <main className="flex-1 overflow-auto bg-white md:bg-gray-50">
            <div className="h-full md:pt-0">
              {children}
            </div>
          </main>
        </div>
      </div>
    </ProfileProvider>
  );
}