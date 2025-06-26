"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Search, MoreVertical, Plus, Edit, Trash2, Eye } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { collection, getDocs, deleteDoc, doc, orderBy, query } from 'firebase/firestore';
import toast from 'react-hot-toast';

interface Grant {
  id: string;
  grantName: string;
  organization: string;
  amount: string;
  currency: string;
  status: 'Open' | 'Closed' | 'Draft' | 'Review';
}

const ManageGrantsPage = () => {
  const router = useRouter();
  const [grants, setGrants] = useState<Grant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDropdown, setShowDropdown] = useState<string | null>(null);
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    const fetchGrants = async () => {
      setLoading(true);
      try {
        const grantsQuery = query(collection(db, "grants"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(grantsQuery);
        const grantsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Grant[];
        setGrants(grantsData);
      } catch (error) {
        console.error("Error fetching grants: ", error);
        toast.error("Failed to fetch grants.");
      } finally {
        setLoading(false);
      }
    };
    fetchGrants();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const openDropdownId = showDropdown;
      if (openDropdownId && dropdownRefs.current[openDropdownId] && !dropdownRefs.current[openDropdownId]?.contains(event.target as Node)) {
        setShowDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDropdown]);

  const handleDeleteGrant = async (grantId: string) => {
    if (!window.confirm("Are you sure you want to delete this grant?")) return;
    const loadingToast = toast.loading("Deleting grant...");
    try {
      await deleteDoc(doc(db, "grants", grantId));
      setGrants(prev => prev.filter(g => g.id !== grantId));
      toast.success("Grant deleted successfully!", { id: loadingToast });
    } catch (error) {
      toast.error("Failed to delete grant.", { id: loadingToast });
    }
    setShowDropdown(null);
  };

  const handleEditGrant = (grantId: string) => {
    router.push(`/admin/edit-grant/${grantId}`);
  };

  const handleViewGrant = (grantId: string) => {
    router.push(`/grants/${grantId}`);
  };

  const filteredGrants = grants.filter(g =>
    g.grantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.organization.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredGrants.length / itemsPerPage);
  const currentGrants = filteredGrants.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
        setCurrentPage(page);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  if (loading) {
    return <div className="p-6 text-center">Loading grants...</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Grants</h1>
          <p className="text-gray-600 mt-1">Manage all grants on AutoGrant</p>
        </div>
        <Link href="/admin/create-grant" className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Add Grant</span>
        </Link>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for grants..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            />
          </div>
        </div>
        
        <div>
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grant Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Organization</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentGrants.length > 0 ? (
                currentGrants.map((grant) => (
                  <tr key={grant.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{grant.grantName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{grant.organization}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{`${grant.amount} ${grant.currency}`}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{grant.status}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 relative">
                      <button className="text-gray-400 hover:text-gray-600 p-1" onClick={() => setShowDropdown(showDropdown === grant.id ? null : grant.id)}>
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      {showDropdown === grant.id && (
                        <div 
                          ref={el => { dropdownRefs.current[grant.id] = el; }}
                          className="absolute right-8 top-full mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-20"
                        >
                          <div className="py-1">
                            <button onClick={() => handleViewGrant(grant.id)} className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left">
                              <Eye className="w-4 h-4" /><span>View Details</span>
                            </button>
                            <button onClick={() => handleEditGrant(grant.id)} className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left">
                              <Edit className="w-4 h-4" /><span>Edit Grant</span>
                            </button>
                            <button onClick={() => handleDeleteGrant(grant.id)} className="flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left">
                              <Trash2 className="w-4 h-4" /><span>Delete Grant</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-gray-500">No grants found. Add a new grant to get started.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* --- PAGINATION CONTROLS --- */}
        {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                <button 
                    onClick={handlePrevious} 
                    disabled={currentPage === 1} 
                    className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:text-gray-900 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                    <span>← Prev</span>
                </button>
                
                <div className="flex items-center space-x-2">
                    {[...Array(totalPages)].map((_, index) => {
                    const pageNum = index + 1;
                    return (
                        <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-8 h-8 text-sm rounded ${
                            currentPage === pageNum
                            ? 'bg-emerald-600 text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                        >
                        {pageNum}
                        </button>
                    );
                    })}
                </div>
                
                <button 
                    onClick={handleNext} 
                    disabled={currentPage === totalPages} 
                    className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:text-gray-900 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                    <span>Next →</span>
                </button>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default ManageGrantsPage;