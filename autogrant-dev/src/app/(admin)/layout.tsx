"use client"
import React, {useState, useEffect}from 'react';
import { LayoutDashboard, Trophy, Search, Bell, User, ChevronDown, Menu, X, Plus, Users } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import { useAuth } from '@/context/authcontext';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import toast from 'react-hot-toast'

// Define interfaces for props
interface SidebarProps {
  onClose: () => void;
}

interface MenuItem {
  icon: React.ElementType;
  label: string;
  href: string;
}

interface TopBarProps {
  className?: string;
  onMenuClick: () => void;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
}

type UserProfile = {
    role: 'user' | 'admin';
};
// Sidebar Component
const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const pathname = usePathname();
  
  const menuItems: MenuItem[] = [
    {
      icon: LayoutDashboard,
      label: 'Dashboard',
      href: '/admin'
    },
    {
      icon: Trophy,
      label: 'Manage Grants',
      href: '/admin/manage-grants'
    },
    {
      icon: Users, 
      label: 'Manage Applications',
      href: '/admin/manage-applications'
    },
    {
      icon: Plus,
      label: 'Create Grant',
      href: '/admin/create-grant'
    }
  ];

  // Function to check if a menu item is active
  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="w-64 h-full bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="rounded-full flex items-center justify-center">
            <img
              src="/logo.png"
              alt="AutoGrant Logo"
              className="w-6 h-6"
            />
          </div>
          <span className="text-lg">AutoGrant</span>
        </Link>
        <button 
          onClick={onClose}
          className="lg:hidden p-2 text-gray-500 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            
            return (
              <li key={index}>
                <Link
                  href={item.href}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};


const AdminAuthLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [isVerifiedAdmin, setIsVerifiedAdmin] = useState(false);
  
  useEffect(() => {
    // If auth is done loading, check the user's role
    if (!authLoading) {
      if (!user) {
        // Not logged in, redirect to home/login
        toast.error("Please log in to continue.");
        router.push('/'); 
        return;
      }

      // User is logged in, now check their role from Firestore
      const checkAdminStatus = async () => {
        const userDocRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
          const userProfile = docSnap.data() as UserProfile;
          if (userProfile.role === 'admin') {
            setIsVerifiedAdmin(true); // It's an admin!
          } else {
            // It's a regular user, deny access
            toast.error("You do not have permission to access this page.");
            router.push('/dashboard');
          }
        } else {
          // Profile doesn't exist, deny access
           toast.error("User profile not found.");
           router.push('/dashboard');
        }
      };

      checkAdminStatus();
    }
  }, [user, authLoading, router]);

  // While we're checking auth or verifying the admin role, show a loading screen.
  if (authLoading || !isVerifiedAdmin) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <p>Verifying access...</p>
      </div>
    );
  }

  // If all checks pass, render the layout with the page content
  return children;
};




// TopBar Component
const TopBar: React.FC<TopBarProps> = ({ className = '', onMenuClick }) => {
  return (
    <header className={`bg-white border-b border-gray-200 px-4 py-4 lg:px-6 ${className}`}>
      <div className="flex items-center justify-between">
        {/* Menu Button (Mobile) */}
        <button 
          className="p-2 -ml-2 lg:hidden text-gray-600 hover:text-gray-900"
          onClick={onMenuClick}
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Search Bar */}
        <div className="flex-1 max-w-md mx-4 hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            />
          </div>
        </div>

        {/* Right Side Actions - Only User Profile */}
        <div className="flex items-center">
          <div className="flex items-center space-x-2 md:space-x-3">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-gray-600" />
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400 hidden md:block" />
          </div>
        </div>
      </div>
    </header>
  );
};




// Dashboard Layout Component
function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <AdminAuthLayout>
      <div className="flex h-screen overflow-hidden bg-gray-50">
        {/* Mobile Sidebar Overlay */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 lg:hidden"
            onClick={closeMobileMenu}
          />
        )}

        {/* Sidebar */}
        <div className={`
          fixed inset-y-0 left-0 z-30 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <Sidebar onClose={closeMobileMenu} />
        </div>
        
        {/* Main content area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <TopBar 
            onMenuClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          />
          
          <main className="flex-1 overflow-auto bg-white md:bg-gray-50">
            <div className="container mx-auto px-4 py-6 max-w-7xl">
              {children}
            </div>
          </main>
        </div>
      </div>
      </AdminAuthLayout>
    );

};

export default DashboardLayout;

   