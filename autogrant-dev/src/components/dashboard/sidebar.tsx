"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Lightbulb,
  FileText,
  Milestone,
  Wallet,
  Building2,
  Settings,
  HelpCircle,
  ChevronDown,
  Plus,
  X,
} from "lucide-react";
import { useState } from "react";
import { useProfile } from "@/context/ProfileContext";
import { useAuth } from "@/context/authcontext";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import toast from "react-hot-toast";

interface SidebarProps {
  className?: string;
}


interface BusinessProfile {
  id: string;
  businessName: string;
}

export default function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useAuth();
  const { profiles, selectedProfile, switchProfile, loading: loadingProfiles } = useProfile();

  const [isAddProfileModalOpen, setIsAddProfileModalOpen] = useState(false);
  const [newBusinessName, setNewBusinessName] = useState("");
  const [isCreatingProfile, setIsCreatingProfile] = useState(false);

  const handleAddProfile = async () => {
    if (!newBusinessName.trim() || !user) {
      toast.error("Business name cannot be empty.");
      return;
    }
    setIsCreatingProfile(true);
    const toastId = toast.loading("Creating profile...");
    
    try {
      const profilesCollectionRef = collection(db, `users/${user.uid}/businessProfiles`);
      const newProfileDoc = await addDoc(profilesCollectionRef, {
        businessName: newBusinessName.trim(),
        createdAt: serverTimestamp(),
      });
      
      const newProfile = { id: newProfileDoc.id, businessName: newBusinessName.trim() };
      switchProfile(newProfile);
      toast.success("Profile created!", { id: toastId });
      
      setNewBusinessName("");
      setIsAddProfileModalOpen(false);
    } catch (error) {
      console.error("Error creating profile:", error);
      toast.error("Failed to create profile.", { id: toastId });
    } finally {
      setIsCreatingProfile(false);
    }
  };

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Opportunities", href: "/dashboard/opportunities", icon: Lightbulb },
    { name: "My Grants", href: "/dashboard/my-grants", icon: FileText },
    { name: "Milestones", href: "/dashboard/milestones", icon: Milestone },
    { name: "Wallet", href: "/dashboard/wallet", icon: Wallet },
  ];

  const bottomNavItems = [
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
    { name: "Support", href: "/dashboard/support", icon: HelpCircle },
  ];

  return (
    <>
      <aside className={cn("hidden md:flex w-60 flex-col border-r border-border", className)}>
        <div className="flex h-full flex-col bg-background">
          <div className="flex h-14 items-center border-b px-4">
            <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
              <img src="/logo.png" alt="AutoGrant Logo" className="w-6 h-6"/>
              <span className="text-lg">AutoGrant</span>
            </Link>
          </div>
          <div className="flex-1 overflow-auto py-2">
            <nav className="grid gap-1 px-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                    pathname === item.href
                      ? "bg-accent text-green-600 font-semibold"
                      : "text-muted-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              ))}
            </nav>
            <div className="mt-6 px-4">
              <div className="text-xs font-semibold text-muted-foreground tracking-wider mb-2">
                BUSINESS PROFILE
              </div>
              
              {loadingProfiles ? (
                 <div className="text-sm text-muted-foreground">Loading Profiles...</div>
              ) : (
                <>
                  {selectedProfile && (
                     <Link
                        href={`/dashboard/business?profileId=${selectedProfile.id}`}
                        className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
                      >
                        <Building2 className="h-5 w-5" />
                        <span className="truncate">{selectedProfile.businessName}</span>
                    </Link>
                  )}
                  <div
                    onClick={() => setIsAddProfileModalOpen(true)}
                    className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
                  >
                    <Plus className="h-5 w-5" />
                    <span>Add new profile</span>
                  </div>
                  {profiles.length > 1 && (
                    <div className="mt-2 space-y-1">
                      {profiles
                        .filter(profile => profile.id !== selectedProfile?.id)
                        .map((profile) => (
                          <div
                            key={profile.id}
                            onClick={() => switchProfile(profile)}
                            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer text-muted-foreground"
                          >
                            <Building2 className="h-4 w-4" />
                            <span className="truncate">{profile.businessName}</span>
                          </div>
                        ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
          <div className="mt-auto p-2">
            <nav className="grid gap-1">
              {bottomNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                    pathname === item.href
                      ? "bg-accent text-green-600 font-semibold"
                      : "text-muted-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </aside>

      {isAddProfileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Add New Business Profile
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => {
                    setIsAddProfileModalOpen(false);
                    setNewBusinessName("");
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="px-6 py-4">
              <div className="space-y-2">
                <label htmlFor="businessName" className="text-sm font-medium text-gray-700">
                  Business Name
                </label>
                <Input
                  id="businessName"
                  placeholder="Enter business name..."
                  value={newBusinessName}
                  onChange={(e) => setNewBusinessName(e.target.value)}
                  onKeyPress={(e) => { if (e.key === 'Enter') handleAddProfile(); }}
                  className="w-full"
                />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddProfileModalOpen(false);
                  setNewBusinessName("");
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddProfile}
                disabled={!newBusinessName.trim() || isCreatingProfile}
                className="bg-green-600 hover:bg-green-700"
              >
                {isCreatingProfile ? "Creating..." : "Create Profile"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}