"use client"
import React, { useState, useEffect } from 'react';
import { Search, Filter, X, Bookmark, BookmarkCheck, Menu, ChevronDown, Settings, HelpCircle, BarChart3, Target, Wallet, User } from 'lucide-react';

import { useAuth } from '@/context/authcontext';
import { db } from '@/lib/firebase';
import { collection, query, where, orderBy, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import toast from 'react-hot-toast';

interface Opportunity {
  id: string;
  title: string;
  description: string;
  status: string;
  region: string;
  stage: string;
  grantSize: string;
  aiMatch: string;
  deadline: string;
  logo: string;
  logoFallback: string;
}

interface FormData {
  companyName: string;
  businessEmail: string;
  companySize: string;
  industry: string;
  grantPurpose: string;
}

const OpportunitiesPage = () => {

  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('Most recent');
  const [filterBy, setFilterBy] = useState('Industry');
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [savedOpportunities, setSavedOpportunities] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  

  const [formData, setFormData] = useState<FormData>({
    companyName: 'Acme Menar LLC',
    businessEmail: 'hello@acme.io',
    companySize: '50-100 employees',
    industry: 'Clean energy',
    grantPurpose: 'We are building ...'
  });

  useEffect(() => {
    setLoading(true);
    const fetchOpenGrants = async () => {
      try {
        const q = query(
          collection(db, "grants"), 
          where("status", "==", "Open"),
          orderBy("createdAt", "desc")
        );

        const querySnapshot = await getDocs(q);
        const grantsData = querySnapshot.docs.map(doc => {
          const data = doc.data();
          
          return {
            id: doc.id,
            title: data.grantName || 'Untitled Grant',
            description: data.shortDescription || '',
            status: data.status || 'N/A',
            grantSize: `${data.amount} ${data.currency}` || '$0',
            deadline: data.applicationDeadline ? new Date(data.applicationDeadline).toLocaleDateString() : 'N/A',
            region: data.geographicScope || 'Global',
            stage: 'All Stage',
            aiMatch: '80%',
            logo: '/api/placeholder/48/48',
            logoFallback: '💰'
          };
        }) as Opportunity[];
        setOpportunities(grantsData);
      } catch (error) {
        console.error("Error fetching grants: ", error);
        toast.error("Could not load opportunities. You may need to create a Firestore index.");
      } finally {
        setLoading(false);
      }
    };
    fetchOpenGrants();
  }, []);


  const submitApplication = async () => {
    if (!user || !selectedOpportunity) {
      toast.error("Error: User or grant not found.");
      return;
    }

    setIsSubmitting(true);
    const loadingToast = toast.loading("Submitting application...");

    try {
      const applicationData = {
        userId: user.uid,
        applicantName: user.displayName || 'Unnamed User',
        applicantEmail: user.email,
        grantId: selectedOpportunity.id,
        grantName: selectedOpportunity.title,
        status: 'submitted',
        submittedAt: serverTimestamp(),
        applicationForm: formData, 
      };

      await addDoc(collection(db, "applications"), applicationData);
      
      toast.success("Application submitted successfully!", { id: loadingToast });
      closeModal();
    } catch (error) {
      console.error("Error submitting application: ", error);
      toast.error("Failed to submit application.", { id: loadingToast });
    } finally {
      setIsSubmitting(false);
    }
  };
  
useEffect(() => {
    setLoading(true);
    const fetchOpenGrants = async () => {
      try {
        const q = query(
          collection(db, "grants"), 
          where("status", "==", "Open"),
          orderBy("createdAt", "desc")
        );

        const querySnapshot = await getDocs(q);
        const grantsData = querySnapshot.docs.map(doc => {
          const data = doc.data();
        
          return {
            id: doc.id,
            title: data.grantName || 'Untitled Grant',
            description: data.shortDescription || '',
            status: data.status || 'N/A',
            grantSize: `${data.amount} ${data.currency}` || '$0',
            deadline: data.applicationDeadline ? new Date(data.applicationDeadline).toLocaleDateString() : 'N/A',
            region: data.geographicScope || 'Global',
            stage: 'All Stage',
            aiMatch: '80%',
            logo: '/api/placeholder/48/48',
            logoFallback: '💰'
          };
        }) as Opportunity[];
        setOpportunities(grantsData);
      } catch (error) {
        console.error("Error fetching grants: ", error);
        toast.error("Could not load opportunities. You may need to create a Firestore index.");
      } finally {
        setLoading(false);
      }
    };
    fetchOpenGrants();
  }, []);
  

  const filteredOpportunities = opportunities.filter(opp =>
    opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    opp.description.toLowerCase().includes(searchQuery.toLowerCase())
  );


   const toggleSaved = async (opportunityId: string) => {
    if (!user) {
      toast.error("You must be logged in to save grants.");
      return;
    }
  }
  const handleApply = (opportunity: Opportunity) => {
    setSelectedOpportunity(opportunity);
  };

  const closeModal = () => {
    setSelectedOpportunity(null);
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };


  const sidebarItems = [
    { icon: BarChart3, label: 'Dashboard', active: false },
    { icon: Target, label: 'Opportunities', active: true },
    { icon: User, label: 'My Grants', active: false },
    { icon: Target, label: 'Milestones', active: false },
    { icon: Wallet, label: 'Wallet', active: false },
  ];

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-12 md:py-20 px-4">
      <div className="w-24 h-24 md:w-32 md:h-32 mb-6 md:mb-8 relative">
        <img
          src="/empty.png"
          alt="No results found"
          className="w-full h-full object-contain"
        />
      </div>
      <h3 className="text-xl md:text-2xl font-semibold mb-2 text-gray-800 text-center">😞 No matching grants found</h3>
      <p className="text-gray-600 text-center max-w-md text-sm md:text-base px-4">
        We couldn't find any grants that match your search right now.<br />
        Try adjusting your filters or check back soon — new opportunities are added regularly.
      </p>
    </div>
  );

  return (
    <div className="bg-gray-50 flex">

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          <div className="px-4 lg:px-6 py-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Opportunities</h1>
              <p className="text-gray-600">Search for opportunities that fits your business</p>
            </div>

            <div className="flex items-center gap-6 mb-6">
              <span className="text-gray-900 font-medium">Browse all</span>
              <span className="text-gray-500">Saved {savedOpportunities.size}</span>
            </div>

            {/* Search and Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Search for opportunities and grants that perfectly fits your business goals"
                  className="w-full pl-4 pr-4 py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors">
                Search
              </button>
            </div>

            {/* Sort and Filter Controls */}
            <div className="flex flex-row sm:items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="text-gray-700 font-medium">Sort by:</span>
                <div className="relative">
                  <select 
                    className="appearance-none bg-white border border-gray-300 rounded-lg px-3 py-2 pr-8 text-sm text-teal-600 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option>Most recent</option>
                    <option>Deadline</option>
                    <option>Grant Size</option>
                    <option>AI Match</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-teal-600 pointer-events-none" />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-gray-700 font-medium">Filter:</span>
                <div className="relative">
                  <select 
                    className="appearance-none bg-white border border-gray-300 rounded-lg px-3 py-2 pr-8 text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    value={filterBy}
                    onChange={(e) => setFilterBy(e.target.value)}
                  >
                    <option>Industry</option>
                    <option>Region</option>
                    <option>Grant Size</option>
                    <option>Stage</option>
                  </select>
                  <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Opportunities List */}
            {filteredOpportunities.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="space-y-4">
                {filteredOpportunities.map((opportunity) => (
                  <div key={opportunity.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-sm transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-lg">{opportunity.logoFallback}</span>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-gray-900 text-lg">{opportunity.title}</h3>
                          <button
                            onClick={() => toggleSaved(opportunity.id)}
                            className="p-1 hover:bg-gray-100 rounded transition-colors"
                          >
                            {savedOpportunities.has(opportunity.id) ? (
                              <BookmarkCheck className="w-5 h-5 text-teal-600 fill-current" />
                            ) : (
                              <Bookmark className="w-5 h-5 text-gray-400" />
                            )}
                          </button>
                        </div>
                        
                        <p className="text-gray-600 mb-3 text-sm leading-relaxed">{opportunity.description}</p>
                        
                        <div className="flex items-center gap-2 mb-4">
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">{opportunity.status}</span>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-2 mb-4">
                          <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded">{opportunity.region}</span>
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">{opportunity.stage}</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-6 text-sm">
                            <span className="text-gray-700">Grant size: <strong>{opportunity.grantSize}</strong></span>
                            <span className="text-teal-600 font-medium">AI Match: {opportunity.aiMatch}</span>
                            <span className="text-red-600">Closes {opportunity.deadline}</span>
                          </div>
                          
                          <button
                            onClick={() => handleApply(opportunity)}
                            className="bg-black text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors text-sm"
                          >
                            Apply
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Application Modal */}
      {selectedOpportunity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center p-0 sm:p-4 z-50">
          <div className="bg-white rounded-t-lg sm:rounded-lg w-full max-w-6xl max-h-[95vh] overflow-y-auto animate-slide-up">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white rounded-t-lg">
              <h2 className="text-2xl font-bold text-gray-900">Apply</h2>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              <div className="flex flex-col xl:flex-row gap-8">
                {/* Left side - Form */}
                <div className="flex-1">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-lg">{selectedOpportunity.logoFallback}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-lg">{selectedOpportunity.title}</h3>
                      <p className="text-gray-600 text-sm mt-1 leading-relaxed">{selectedOpportunity.description}</p>
                      <span className="inline-block px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded mt-2">
                        {selectedOpportunity.status}
                      </span>
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
                      <span>Grant size: <strong>{selectedOpportunity.grantSize}</strong></span>
                      <span>Deadline <strong className="text-red-600">{selectedOpportunity.deadline}</strong></span>
                    </div>
                    <button className="flex items-center gap-2 text-teal-600 font-medium text-sm hover:text-teal-700 transition-colors">
                      <span>✨</span>
                      Autofill with AI
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                        <input
                          type="text"
                          value={formData.companyName}
                          onChange={(e) => handleInputChange('companyName', e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Business Email</label>
                        <input
                          type="email"
                          value={formData.businessEmail}
                          onChange={(e) => handleInputChange('businessEmail', e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Company Size</label>
                        <input
                          type="text"
                          value={formData.companySize}
                          onChange={(e) => handleInputChange('companySize', e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                        <input
                          type="text"
                          value={formData.industry}
                          onChange={(e) => handleInputChange('industry', e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">What do you intend to do with the grant?</label>
                      <textarea
                        rows={4}
                        value={formData.grantPurpose}
                        onChange={(e) => handleInputChange('grantPurpose', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                      />
                    </div>

                    <button
                      onClick={submitApplication}
                      className="bg-teal-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-teal-700 transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                </div>

                {/* Right side - Score */}
                <div className="xl:w-80 w-full">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Score</h4>
                    <div className="text-center">
                      <div className="text-5xl font-bold text-teal-600 mb-2">{selectedOpportunity.aiMatch}</div>
                      <div className="text-lg font-medium text-gray-900 mb-2">Good</div>
                      <p className="text-sm text-gray-600">Your business aligns well with this grant opportunity</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .animate-slide-up {
          animation: slideUp 0.3s ease-out;
        }
        
        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        
        @media (min-width: 640px) {
          .animate-slide-up {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
};

export default OpportunitiesPage;