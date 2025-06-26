"use client";
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useAuth } from '@/context/authcontext';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, Timestamp, orderBy } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { Plus, MoreVertical, X, ChevronDown, ChevronLeft, ChevronRight, Eye, FileX, Edit3, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';


interface Application {
  id: string; 
  grantName: string;
}

interface Milestone {
  id: string; 
  title: string;
  description: string;
  progress: number;
  status: 'Completed' | 'Pending' | 'In Progress';
  createdAt: Timestamp;
}

interface FormData {
  title: string;
  description: string;
  progress: number;
}


function ActionDropdown({ milestone, onAction }: { milestone: Milestone, onAction: (action: string, milestoneId: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getAvailableActions = () => {
    const baseActions = [{ icon: Edit3, label: 'Edit', action: 'edit' }];
    if (milestone.status === 'Pending' || milestone.status === 'In Progress') {
        baseActions.push({ icon: Trash2, label: 'Delete', action: 'delete' });
    }
    return baseActions;
  };

  const actions = getAvailableActions();

  return (
    <div className="relative" ref={dropdownRef}>
      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}>
        <MoreVertical className="w-4 h-4" />
      </Button>
      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-10">
          {actions.map(({ icon: Icon, label, action }) => (
            <button
              key={action}
              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-2 first:rounded-t-md last:rounded-b-md"
              onClick={() => {
                onAction(action, milestone.id);
                setIsOpen(false);
              }}>
              <Icon className="w-4 h-4" />{label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const MilestonesPage: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  
  const [applications, setApplications] = useState<Application[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState({ apps: true, milestones: false });

  const [showGrantDropdown, setShowGrantDropdown] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingMilestone, setEditingMilestone] = useState<Milestone | null>(null);
  const [showStatusDropdown, setShowStatusDropdown] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({ title: '', description: '', progress: 0 });

  const statusOptions: Array<Milestone['status']> = ['Pending', 'In Progress', 'Completed'];

  useEffect(() => {
    if (!user) {
      setLoading(prev => ({...prev, apps: false}));
      return;
    };
    const q = query(collection(db, "applications"), where("userId", "==", user.uid));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const appsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Application[];
      setApplications(appsData);
      if (!selectedApplication && appsData.length > 0) {
        setSelectedApplication(appsData[0]);
      } else if (appsData.length === 0) {
        setSelectedApplication(null);
      }
      setLoading(prev => ({...prev, apps: false}));
    });
    return () => unsubscribe();
  }, [user, selectedApplication]);

  useEffect(() => {
    if (!selectedApplication) {
        setMilestones([]);
        return;
    };
    setLoading(prev => ({...prev, milestones: true}));
    const milestonesRef = collection(db, 'applications', selectedApplication.id, 'milestones');
    const q = query(milestonesRef, orderBy('createdAt', 'asc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const milestonesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Milestone[];
      setMilestones(milestonesData);
      setLoading(prev => ({...prev, milestones: false}));
    });
    return () => unsubscribe();
  }, [selectedApplication]);

  const handleGrantSelect = (app: Application): void => {
    setSelectedApplication(app);
    setShowGrantDropdown(false);
  };

  const handleStatusChange = async (milestoneId: string, newStatus: Milestone['status']): Promise<void> => {
    if (!selectedApplication) return;
    const milestoneRef = doc(db, 'applications', selectedApplication.id, 'milestones', milestoneId);
    await updateDoc(milestoneRef, { status: newStatus });
    setShowStatusDropdown(null);
  };

  const handleAddMilestone = (): void => {
    setEditingMilestone(null);
    setFormData({ title: '', description: '', progress: 0 });
    setShowModal(true);
  };

  const handleEditMilestone = (milestone: Milestone): void => {
    setEditingMilestone(milestone);
    setFormData({ title: milestone.title, description: milestone.description, progress: milestone.progress });
    setShowModal(true);
  };

  const handleDeleteMilestone = async (milestoneId: string): Promise<void> => {
    if (!selectedApplication || !window.confirm("Are you sure?")) return;
    const milestoneRef = doc(db, 'applications', selectedApplication.id, 'milestones', milestoneId);
    await toast.promise(deleteDoc(milestoneRef), {
      loading: 'Deleting...',
      success: 'Milestone deleted!',
      error: 'Could not delete.',
    });
  };

  const handleSingleAction = (action: string, milestoneId: string) => {
      const milestone = milestones.find(m => m.id === milestoneId);
      if (!milestone) return;

      if (action === 'edit') {
          handleEditMilestone(milestone);
      } else if (action === 'delete') {
          handleDeleteMilestone(milestoneId);
      }
  };

  const handleSave = async (): Promise<void> => {
    if (!formData.title || !formData.description || !selectedApplication) {
      toast.error("Title and description are required.");
      return;
    }
    const toastId = toast.loading(editingMilestone ? "Updating milestone..." : "Adding milestone...");
    try {
      if (editingMilestone) {
        const milestoneRef = doc(db, 'applications', selectedApplication.id, 'milestones', editingMilestone.id);
        await updateDoc(milestoneRef, { ...formData, updatedAt: serverTimestamp() });
      } else {
        const milestonesRef = collection(db, 'applications', selectedApplication.id, 'milestones');
        await addDoc(milestonesRef, {
          ...formData,
          status: formData.progress === 100 ? 'Completed' : formData.progress > 0 ? 'In Progress' : 'Pending',
          createdAt: serverTimestamp()
        });
      }
      toast.success("Success!", { id: toastId });
      handleModalClose();
    } catch (error) {
      toast.error("An error occurred.", { id: toastId });
      console.error(error);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string | number): void => {
    setFormData({ ...formData, [field]: value });
  };

  const handleModalClose = (): void => {
    setShowModal(false);
    setFormData({ title: '', description: '', progress: 0 });
    setEditingMilestone(null);
  };
  
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-700';
      case 'Pending': return 'bg-yellow-100 text-yellow-700';
      case 'In Progress': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };
  
  const getStatusIcon = (status: string): string => '▼';

  if (loading.apps) {
      return <div className="p-6 text-center">Loading your grants...</div>
  }
  
  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <div className="mb-6 md:mb-8">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2">Milestones</h1>
        <p className="text-sm md:text-base text-gray-600">Set business milestones for your grant applications.</p>
      </div>

      <div className="mb-4 md:mb-6 relative">
        <div className="bg-teal-600 text-white px-4 py-3 rounded-lg flex items-center justify-between cursor-pointer hover:bg-teal-700 transition-colors"
          onClick={() => setShowGrantDropdown(!showGrantDropdown)}>
          <span className="font-medium text-sm md:text-base truncate pr-2">
            {selectedApplication ? selectedApplication.grantName : 'Select a Grant Application'}
          </span>
          <ChevronDown className={`w-5 h-5 flex-shrink-0 transition-transform ${showGrantDropdown ? 'rotate-180' : ''}`} />
        </div>
        
        {showGrantDropdown && (
          <div className="absolute top-14 left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-20">
            {applications.length > 0 ? applications.map((app) => (
              <button key={app.id} onClick={() => handleGrantSelect(app)}
                className={`w-full text-left px-4 py-3 text-sm md:text-base hover:bg-gray-50 transition-colors ${selectedApplication?.id === app.id ? 'bg-teal-50 text-teal-700' : 'text-gray-700'}`}>
                {app.grantName}
              </button>
            )) : <div className="p-4 text-center text-sm text-gray-500">You have no applications.</div>}
          </div>
        )}
      </div>

      <div className="hidden md:block bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-700">
            <div className="col-span-3">Milestones</div>
            <div className="col-span-4">Description</div>
            <div className="col-span-2">Progress(% met)</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-1 text-right">Actions</div>
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {loading.milestones ? <div className="p-6 text-center">Loading milestones...</div> : milestones.length > 0 ? milestones.map((milestone) => (
            <div key={milestone.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
              <div className="grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-3"><span className="font-medium text-gray-900">{milestone.title}</span></div>
                  <div className="col-span-4"><span className="text-gray-600">{milestone.description}</span></div>
                  <div className="col-span-2"><span className="text-gray-900">{milestone.progress}%</span></div>
                  <div className="col-span-2 relative"><button onClick={() => setShowStatusDropdown(showStatusDropdown === milestone.id ? null : milestone.id)} className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer hover:opacity-80 transition-opacity ${getStatusColor(milestone.status)}`}><span className="mr-1">{getStatusIcon(milestone.status)}</span>{milestone.status}<ChevronDown className="w-3 h-3 ml-1" /></button>{showStatusDropdown === milestone.id && (<div className="absolute top-8 left-0 w-36 bg-white border border-gray-200 rounded-md shadow-lg z-10">{statusOptions.map((status) => (<button key={status} onClick={() => handleStatusChange(milestone.id, status)} className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center ${milestone.status === status ? 'bg-gray-50' : ''}`}><span className="mr-2">{getStatusIcon(status)}</span>{status}</button>))}</div>)}</div>
                  <div className="col-span-1 flex justify-end"><ActionDropdown milestone={milestone} onAction={handleSingleAction} /></div>
              </div>
            </div>
          )) : <div className="p-10 text-center text-gray-500">No milestones for this grant yet.</div>}
        </div>
        {selectedApplication && (<div className="px-6 py-4 border-t border-gray-200"><button onClick={handleAddMilestone} className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"><Plus className="w-4 h-4 mr-2" />Add milestone</button></div>)}
      </div>
      
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 md:p-6 pb-4 border-b border-gray-200"><h3 className="text-lg font-semibold text-gray-900">{editingMilestone ? 'Edit Milestone' : 'Add Milestone'}</h3><button onClick={handleModalClose} className="p-2 hover:bg-gray-100 cursor-pointer rounded-full transition-colors"><X className="w-5 h-5 text-gray-500" /></button></div>
            <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="flex flex-col overflow-hidden">
              <div className="p-4 md:p-6 space-y-4 overflow-y-auto">
                <div><label className="block text-sm font-medium text-gray-700 mb-2">Milestone title*</label><input type="text" value={formData.title} onChange={(e) => handleInputChange('title', e.target.value)} className="w-full px-3 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="Enter milestone title"/></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-2">Milestone description*</label><textarea value={formData.description} onChange={(e) => handleInputChange('description', e.target.value)} className="w-full px-3 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none" rows={3} placeholder="Enter milestone description"/></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-2">Percentage met*</label><div className="relative"><select value={formData.progress} onChange={(e) => handleInputChange('progress', parseInt(e.target.value))} className="w-full px-3 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent appearance-none bg-white"><option value={0}>0%</option>{[...Array(100)].map((_, i) => <option key={i+1} value={i+1}>{i+1}%</option>)}</select><div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none"><ChevronDown className="w-5 h-5 text-gray-400" /></div></div></div>
              </div>
              <div className="p-4 md:p-6 pt-4 space-y-3 bg-gray-50 border-t">
                <Button type="submit" disabled={!formData.title || !formData.description} className="w-full">Save</Button>
                <Button type="button" variant="outline" onClick={handleModalClose} className="w-full">Cancel</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MilestonesPage;