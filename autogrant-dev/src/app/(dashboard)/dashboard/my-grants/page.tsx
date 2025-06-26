"use client";
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useAuth } from '@/context/authcontext';
import { db } from '@/lib/firebase';
import { collection, query, where, orderBy, getDocs, deleteDoc, doc, writeBatch, Timestamp } from 'firebase/firestore';
import { Search, ChevronDown, ChevronLeft, ChevronRight, MoreHorizontal, Eye, FileX, Edit3, Trash2 } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { ProfileCompletionCard } from '@/components/dashboard/profile-completion-card';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface Application {
  id: string; 
  grantId: string;
  grantName: string;
  organization?: string;
  amount?: string;
  deadline?: string;
  aiScore?: number;
  status: 'submitted' | 'in-review' | 'won' | 'missed' | 'withdrawn' | 'draft';
  submittedAt: Timestamp;
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

function ActionDropdown({ grant, onAction }: { grant: Application, onAction: (action: string, grantId: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getAvailableActions = () => {
    const baseActions = [{ icon: Eye, label: 'View Details', action: 'view' }];
    if (grant.status === 'submitted' || grant.status === 'in-review') {
      baseActions.push({ icon: FileX, label: 'Withdraw', action: 'withdraw' });
    }
    if (grant.status === 'draft' || grant.status === 'withdrawn') {
      baseActions.push({ icon: Trash2, label: 'Delete', action: 'delete' });
    }
    return baseActions;
  };
  const actions = getAvailableActions();

  return (
    <div className="relative" ref={dropdownRef}>
      <Button variant="ghost" size="sm" className="w-8 h-8 p-0" onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}>
        <MoreHorizontal className="w-4 h-4" />
      </Button>
      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-10">
          {actions.map(({ icon: Icon, label, action }) => (
            <button key={action} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-2 first:rounded-t-md last:rounded-b-md"
              onClick={() => { onAction(action, grant.id); setIsOpen(false); }}>
              <Icon className="w-4 h-4" />{label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function MyGrantsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplications, setSelectedApplications] = useState<string[]>([]);
  const [isSelectAll, setIsSelectAll] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('Most recent');
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5; 

  const sortOptions = ['Most recent', 'Oldest first', 'Status'];

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    const fetchApplications = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, "applications"), where("userId", "==", user.uid), orderBy("submittedAt", "desc"));
        const querySnapshot = await getDocs(q);
        const appsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Application[];
        setApplications(appsData);
      } catch (error) {
        console.error("Error fetching applications:", error);
        toast.error("Could not load your applications.");
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, [user]);

  const sortedAndFilteredApplications = useMemo(() => {
    return [...applications]
      .filter(app => app.grantName.toLowerCase().includes(searchTerm.toLowerCase()) || app.organization?.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => {
        switch (sortBy) {
          case 'Oldest first': return a.submittedAt.toMillis() - b.submittedAt.toMillis();
          case 'Status': return a.status.localeCompare(b.status);
          default: return b.submittedAt.toMillis() - a.submittedAt.toMillis();
        }
      });
  }, [applications, searchTerm, sortBy]);

  const totalPages = Math.ceil(sortedAndFilteredApplications.length / ITEMS_PER_PAGE);
  const paginatedApplications = sortedAndFilteredApplications.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  useEffect(() => {
    if (paginatedApplications.length === 0 && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
    const currentIds = new Set(paginatedApplications.map(app => app.id));
    if(selectedApplications.length > 0 && ![...selectedApplications].every(id => currentIds.has(id))) {
      setIsSelectAll(false);
    }
  }, [currentPage, paginatedApplications, selectedApplications]);

  const handleSelectAll = (checked: boolean) => {
    setIsSelectAll(checked);
    setSelectedApplications(checked ? paginatedApplications.map(app => app.id) : []);
  };

  const handleSelectApplication = (appId: string, checked: boolean) => {
    setSelectedApplications(prev => {
        const newSelection = checked ? [...prev, appId] : prev.filter(id => id !== appId);
        if (paginatedApplications.length > 0 && newSelection.length === paginatedApplications.length) {
          setIsSelectAll(true);
        } else {
          setIsSelectAll(false);
        }
        return newSelection;
    });
  };
  
  const handleSortSelect = (option: string) => {
    setSortBy(option);
    setSortDropdownOpen(false);
  };
  
  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
      setIsSelectAll(false);
      setSelectedApplications([]);
      window.scrollTo(0, 0);
    }
  };
  const handlePrevious = () => handlePageChange(currentPage - 1);
  const handleNext = () => handlePageChange(currentPage + 1);

  const handleBulkAction = async (action: string) => {
    if (selectedApplications.length === 0) { toast.error("Please select applications first."); return; }
    if (action === 'delete') {
      if (!window.confirm(`Are you sure you want to delete ${selectedApplications.length} applications?`)) return;
      const batch = writeBatch(db);
      selectedApplications.forEach(id => batch.delete(doc(db, "applications", id)));
      const toastId = toast.loading("Deleting applications...");
      await batch.commit();
      setApplications(prev => prev.filter(app => !selectedApplications.includes(app.id)));
      setSelectedApplications([]);
      setIsSelectAll(false);
      toast.success("Applications deleted.", { id: toastId });
    }
  };

  const handleSingleAction = async (action: string, appId: string) => {
    if (action === 'delete' || action === 'withdraw') {
      const confirmationText = action === 'delete' ? 'delete' : 'withdraw from';
      if (!window.confirm(`Are you sure you want to ${confirmationText} this application?`)) return;
      const toastId = toast.loading("Processing...");
      try {
        await deleteDoc(doc(db, "applications", appId));
        setApplications(prev => prev.filter(app => app.id !== appId));
        toast.success("Application removed.", { id: toastId });
      } catch (error) {
        toast.error("Action failed.", { id: toastId });
      }
    }
    if (action === 'view') {
        const app = applications.find(a => a.id === appId);
        if(app?.grantId) router.push(`/grants/${app.grantId}`);
    }
  };

  if (loading) return <div className="p-6 text-center">Loading your grant applications...</div>;

  return (
    <div className="flex flex-col p-4 md:p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Grants</h1>
          <p className="text-muted-foreground text-base md:text-lg">Manage your grant application, check AI review and more</p>
        </div> 
      </div>
      <ProfileCompletionCard profile={null} />
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h2 className="text-xl font-semibold">Manage your grants</h2>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input type="text" placeholder="Search grants..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 w-full sm:w-64"/>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Sort by:</span>
              <div className="relative">
                <Button variant="outline" size="sm" className="h-8 w-40 justify-between" onClick={() => setSortDropdownOpen(!sortDropdownOpen)}>
                  {sortBy} <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
                {sortDropdownOpen && (
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                    {sortOptions.map((option) => (
                      <button key={option} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 first:rounded-t-md last:rounded-b-md" onClick={() => handleSortSelect(option)}>
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {selectedApplications.length > 0 && (
          <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-md">
            <span className="text-sm font-medium text-blue-900">{selectedApplications.length} application{selectedApplications.length > 1 ? 's' : ''} selected</span>
            <div className="flex items-center gap-2"> 
              <Button size="sm" variant="outline" onClick={() => handleBulkAction('delete')}><Trash2 className="w-4 h-4 mr-1" />Delete</Button>
            </div>
          </div>
        )}
        <div className="rounded-md border overflow-hidden">
          <div>
            <table className="w-full">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground w-[40px]"><Checkbox checked={isSelectAll} onCheckedChange={(checked) => handleSelectAll(checked as boolean)}/></th>
                  <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground">Grant Name</th>
                  <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground hidden md:table-cell">Organization</th>
                  <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground">Amount</th>
                  <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                  <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground hidden lg:table-cell">AI score</th>
                  <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground hidden xl:table-cell">Deadline</th>
                  <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground w-[50px]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedApplications.length > 0 ? paginatedApplications.map((app) => (
                  <tr key={app.id} className="border-b hover:bg-muted/50 transition-colors">
                    <td className="p-4 align-middle"><Checkbox checked={selectedApplications.includes(app.id)} onCheckedChange={(checked) => handleSelectApplication(app.id, checked as boolean)}/></td>
                    <td className="p-4 align-middle">
                      <div className="font-medium">{app.grantName}</div>
                      <div className="text-sm text-muted-foreground md:hidden">{app.organization || 'N/A'}</div>
                    </td>
                    <td className="p-4 align-middle hidden md:table-cell">{app.organization || 'N/A'}</td>
                    <td className="p-4 align-middle font-medium">{app.amount || 'N/A'}</td>
                    <td className="p-4 align-middle"><StatusBadge status={app.status} /></td>
                    <td className="p-4 align-middle hidden lg:table-cell font-medium">{app.aiScore ? `${app.aiScore}%` : 'N/A'}</td>
                    <td className="p-4 align-middle hidden xl:table-cell">{app.deadline ? new Date(app.deadline).toLocaleDateString() : 'N/A'}</td>
                    <td className="p-4 align-middle"><ActionDropdown grant={app} onAction={handleSingleAction} /></td>
                  </tr>
                )) : (
                  <tr><td colSpan={8} className="text-center py-10 text-gray-500">You have not applied for any grants yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-4">
            <Button variant="outline" size="sm" onClick={handlePrevious} disabled={currentPage === 1} className="flex items-center gap-1 disabled:opacity-50">
              <ChevronLeft className="w-4 h-4" />Prev
            </Button>
            <div className="flex items-center space-x-2">
              {[...Array(totalPages)].map((_, index) => {
                const pageNum = index + 1;
                return (
                  <Button key={pageNum} size="sm" variant={currentPage === pageNum ? 'default' : 'outline'} className="w-8 h-8 p-0" onClick={() => handlePageChange(pageNum)}>
                    {pageNum}
                  </Button>
                );
              })}
            </div>
            <Button variant="outline" size="sm" onClick={handleNext} disabled={currentPage === totalPages} className="flex items-center gap-1 disabled:opacity-50">
              Next<ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}