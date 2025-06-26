"use client";

import { Search, Bell, ChevronDown, User, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useState, useRef, useEffect } from "react";
import { Badge } from "../ui/badge";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Lightbulb,
  FileText,
  Milestone,
  Wallet,
  Building2,
  HelpCircle,
} from "lucide-react";
import { useAuth } from "@/context/authcontext";
import { getAuth, signOut } from "firebase/auth";

interface TopBarProps {
  className?: string;
  showSearch?: boolean;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
}

export default function TopBar({ className, showSearch = true }: TopBarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const auth = getAuth();

  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [notifications, setNotifications] = useState<Notification[]>([
    { id: "1", title: "New Grant Available", message: "Small Business Innovation Research grant is now open", time: "2 hours ago", isRead: false },
    { id: "2", title: "Application Status Update", message: "Your Tech Startup Grant application is under review", time: "1 day ago", isRead: false },
    { id: "3", title: "Milestone Reminder", message: "Quarterly report due in 3 days", time: "2 days ago", isRead: true }
  ]);

  const notificationRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Opportunities", href: "/dashboard/opportunities", icon: Lightbulb },
    { name: "My Grants", href: "/dashboard/my-grants", icon: FileText },
    { name: "Milestones", href: "/dashboard/milestones", icon: Milestone },
    { name: "Wallet", href: "/dashboard/wallet", icon: Wallet },
    { name: "Business Profile", href: "/dashboard/business", icon: Building2 },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
    { name: "Support", href: "/dashboard/support", icon: HelpCircle },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationDropdownOpen(false);
      }
      if (userRef.current && !userRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    try {
        await signOut(auth);
        router.push('/'); 
    } catch (error) {
        console.error("Error signing out: ", error);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const markAsRead = (id: string) => setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
  const markAllAsRead = () => setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
  };
  const closeAllDropdowns = () => {
    setIsNotificationDropdownOpen(false);
    setIsUserDropdownOpen(false);
  };

  return (
    <header className={cn("flex h-14 items-center gap-4 border-b bg-background px-4 md:px-6", className)}>
      <div className="flex items-center gap-2 font-semibold md:hidden">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="rounded-full flex items-center justify-center">
            <img src="/logo.png" alt="AutoGrant Logo" className="w-6 h-6"/>
          </div>
          <span className="text-lg">AutoGrant</span>
        </Link>
      </div>
      {showSearch && (
        <div className="hidden md:block w-full max-w-md">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search grants, opportunities..." className="w-full appearance-none bg-background pl-8 shadow-none" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </form>
        </div>
      )}
      <div className="flex items-center gap-2 ml-auto">
        <div className="relative" ref={notificationRef}>
          <Button variant="ghost" size="icon" className="relative h-8 w-8" onClick={() => { setIsNotificationDropdownOpen(!isNotificationDropdownOpen); setIsUserDropdownOpen(false); }}>
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (<Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">{unreadCount}</Badge>)}
          </Button>
          {isNotificationDropdownOpen && (
            <div className="absolute right-0 mt-2 w-55 md:w-80 max-w-[380px] bg-white border border-gray-200 rounded-md shadow-lg z-50 transform -translate-x-1/2 md:translate-x-0 left-1/2 md:left-auto">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold">Notifications</h3>
                  {unreadCount > 0 && (<Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-xs h-auto p-1">Mark all read</Button>)}
                </div>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.map((notification) => (
                  <div key={notification.id} className={cn("p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer", !notification.isRead && "bg-blue-50")} onClick={() => markAsRead(notification.id)}>
                    <div className="flex items-start space-x-3">
                      <div className={cn("w-2 h-2 rounded-full mt-2", !notification.isRead ? "bg-blue-500" : "bg-gray-300")} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                        <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                        <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {notifications.length === 0 && (<div className="p-4 text-center text-gray-500 text-sm">No notifications</div>)}
            </div>
          )}
        </div>
        <div className="relative" ref={userRef}>
          <Button variant="ghost" className="flex items-center space-x-2 h-9 border rounded-full" onClick={() => { setIsUserDropdownOpen(!isUserDropdownOpen); setIsNotificationDropdownOpen(false); }}>
            <div className="w-7 h-7 bg-green-500 rounded-full flex items-center justify-center">
              <User className="w-3 h-3 text-white" />
            </div>
            <ChevronDown className="w-3 h-3 text-gray-600" />
          </Button>
          {isUserDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-50">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 truncate">{user?.displayName || 'User'}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                  </div>
                </div>
              </div>
              <div className="py-2 max-h-80 overflow-y-auto">
                {navItems.map((item) => (
                  <Link key={item.href} href={item.href} onClick={closeAllDropdowns}
                    className={cn("flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-100 transition-colors", pathname === item.href ? "bg-green-50 text-green-600 font-medium" : "text-gray-700")}>
                    <item.icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                ))}
              </div>
              <div className="border-t border-gray-200 py-2">
                <button onClick={handleSignOut} className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                  <LogOut className="w-4 h-4 mr-3" />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}