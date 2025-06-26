"use client";
import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/context/authcontext";
import { db } from "@/lib/firebase";
import { doc, getDoc, collection, query, where, getDocs, Timestamp } from "firebase/firestore";
import { FileText, Clock, AlertTriangle, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { StatCard } from "@/components/dashboard/stat-card";
import { ProfileCompletionCard } from "@/components/dashboard/profile-completion-card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

type UserProfile = {
  firstName: string;
  lastName: string;
  businessName: string;
  businessNumber: string;
  businessEmail: string;
  website: string;
  industry: string;
  roleInCompany: string;
  businessDescription: string;
};

interface Application {
  id: string;
  grantName: string;
  organization?: string;
  amount?: string;
  status: 'submitted' | 'in-review' | 'won' | 'missed' | 'withdrawn' | 'draft';
  aiScore?: number;
  deadline?: string;
}

function StatusBadge({ status }: { status: Application['status'] }) {
  const getStatusStyles = () => {
    switch (status) {
      case 'won': return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'missed': return 'text-red-700 bg-red-50 border-red-200';
      case 'submitted': case 'in-review': return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'draft': case 'withdrawn': return 'text-gray-700 bg-gray-50 border-gray-200';
      default: return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };
  const statusText = status.replace('-', ' ');
  return (
    <span className={cn('inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize', getStatusStyles())}>
      <span className={cn('mr-1.5 h-1.5 w-1.5 rounded-full',
        status === 'won' ? 'bg-emerald-600' :
        status === 'missed' ? 'bg-red-600' :
        status.includes('review') || status.includes('submitted') ? 'bg-amber-600' :
        'bg-gray-600'
      )} />
      {statusText}
    </span>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      
      try {
        const profileRef = doc(db, "users", user.uid);
        const appsQuery = query(collection(db, "applications"), where("userId", "==", user.uid));
        
        const [profileSnap, appsSnap] = await Promise.all([
          getDoc(profileRef),
          getDocs(appsQuery)
        ]);

        // Set profile data
        if (profileSnap.exists()) {
          setUserProfile(profileSnap.data() as UserProfile);
        } else {
          setError("No profile data found. Please complete your onboarding.");
        }

        // Set applications data
        const appsData = appsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Application[];
        setApplications(appsData);

      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load your dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  const stats = useMemo(() => {
    const total = applications.length;
    const active = applications.filter(app => app.status === 'submitted' || app.status === 'in-review').length;
    const missed = applications.filter(app => app.status === 'missed').length;
    return { total, active, missed };
  }, [applications]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full p-4">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col p-4 md:p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Welcome, {userProfile?.firstName || 'User'}!
          </h1>
          <p className="text-muted-foreground text-base md:text-lg">Here is an overview of your progress</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button className="bg-emerald-600 hover:bg-emerald-700">View Grants</Button>
          <Button variant="outline">Check Progress</Button>
        </div>
      </div>

      <ProfileCompletionCard profile={userProfile} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard 
          title="Total Applications" 
          value={stats.total.toString()}
          status="All time" 
          trend="up" 
          icon={<FileText className="h-5 w-5 text-emerald-600" />}
          iconBg="bg-emerald-50"
        />
        <StatCard 
          title="Active Applications" 
          value={stats.active.toString()}
          status="Submitted or In Review" 
          trend="up" 
          icon={<Clock className="h-5 w-5 text-emerald-600" />}
          iconBg="bg-emerald-50"
        />
        <StatCard 
          title="Missed" 
          value={stats.missed.toString()}
          status="Past application deadlines" 
          trend="down"
          icon={<AlertTriangle className="h-5 w-5 text-red-500" />}
          iconBg="bg-red-50"
        />
      </div>

      <div className="flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Recent Applications</h2>
        </div>
        <div className="rounded-md border overflow-hidden">
          <div>
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="h-10 px-4 text-left ... w-[40px]"><Checkbox /></th>
                  <th className="h-10 px-4 text-left ...">Grant Name</th>
                  <th className="h-10 px-4 text-left ...">Organization</th>
                  <th className="h-10 px-4 text-left ...">Amount</th>
                  <th className="h-10 px-4 text-left ...">Status</th>
                  <th className="h-10 px-4 text-left ...">AI score</th>
                  <th className="h-10 px-4 text-left ...">Deadline</th>
                </tr>
              </thead>
              <tbody>
                {applications.length > 0 ? applications.slice(0, 5).map((app) => (
                  <tr key={app.id} className="border-b hover:bg-muted/50 transition-colors">
                    <td className="p-4 align-middle"><Checkbox /></td>
                    <td className="p-4 align-middle font-medium">{app.grantName}</td>
                    <td className="p-4 align-middle">{app.organization || 'N/A'}</td>
                    <td className="p-4 align-middle">{app.amount || 'N/A'}</td>
                    <td className="p-4 align-middle"><StatusBadge status={app.status} /></td>
                    <td className="p-4 align-middle">{app.aiScore ? `${app.aiScore}%` : 'N/A'}</td>
                    <td className="p-4 align-middle">{app.deadline ? new Date(app.deadline).toLocaleDateString() : 'N/A'}</td>
                  </tr>
                )) : (
                    <tr>
                        <td colSpan={7} className="text-center py-10 text-gray-500">
                            You haven't applied for any grants yet.
                        </td>
                    </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
