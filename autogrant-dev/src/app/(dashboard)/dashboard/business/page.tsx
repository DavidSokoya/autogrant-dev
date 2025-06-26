"use client";
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/authcontext';
import { useProfile } from '@/context/ProfileContext';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { FileText, Upload, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

type BusinessData = {
  businessName: string;
  legalBusinessName: string;
  businessType: string;
  industry: string;
  businessWebsite: string;
  yearFounded: string;
  businessDescription: string;
  businessEmail: string;
  businessNumber: string;
  countryOfOperation: string;
  cityRegion: string;
  businessAddress: string;
  socialEnvironmentalImpact: string;
  targetAudience: string;
  keyAchievements: string;
  missionStatement: string;
  businessOwnerName: string;
  ownerPhoneNumber: string;
  ownerNationality: string;
  roleTitle: string;
  gender: string;
  numberOfFounders: string;
  ownershipPercentage: string;
  totalRevenue: string;
  monthlyRevenue: string;
  numberOfEmployees: string;
  fundingRaised: string;
  fundingRound: string;
  usersCustomers: string;
  partnerships: string;
  registeredBusiness: string;
  registrationNumber: string;
  grantAmountNeeded: string;
  businessStage: string;
  primaryFundingGoal: string;
};

const BusinessPage = () => {
  const { user } = useAuth();
  const { selectedProfile, loading: profileLoading } = useProfile();
  
  const [currentTab, setCurrentTab] = useState('Business Overview');
  const [businessData, setBusinessData] = useState<BusinessData | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!user || !selectedProfile) {
      setBusinessData(null);
      return;
    }

    const fetchData = async () => {
      const docRef = doc(db, 'users', user.uid, 'businessProfiles', selectedProfile.id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const completeData: BusinessData = {
          businessName: data.businessName || '', legalBusinessName: data.legalBusinessName || '', businessType: data.businessType || '', industry: data.industry || '',
          businessWebsite: data.businessWebsite || '', yearFounded: data.yearFounded || '', businessDescription: data.businessDescription || '', businessEmail: data.businessEmail || '',
          businessNumber: data.businessNumber || '', countryOfOperation: data.countryOfOperation || '', cityRegion: data.cityRegion || '', businessAddress: data.businessAddress || '',
          socialEnvironmentalImpact: data.socialEnvironmentalImpact || '', targetAudience: data.targetAudience || '', keyAchievements: data.keyAchievements || '',
          missionStatement: data.missionStatement || '', businessOwnerName: data.businessOwnerName || '', ownerPhoneNumber: data.ownerPhoneNumber || '',
          ownerNationality: data.ownerNationality || '', roleTitle: data.roleTitle || '', gender: data.gender || '', numberOfFounders: data.numberOfFounders || '',
          ownershipPercentage: data.ownershipPercentage || '', totalRevenue: data.totalRevenue || '', monthlyRevenue: data.monthlyRevenue || '',
          numberOfEmployees: data.numberOfEmployees || '', fundingRaised: data.fundingRaised || '', fundingRound: data.fundingRound || '', usersCustomers: data.usersCustomers || '',
          partnerships: data.partnerships || '', registeredBusiness: data.registeredBusiness || '', registrationNumber: data.registrationNumber || '',
          grantAmountNeeded: data.grantAmountNeeded || '', businessStage: data.businessStage || '', primaryFundingGoal: data.primaryFundingGoal || ''
        };
        setBusinessData(completeData);
      } else {
        toast.error("Could not find the selected business profile.");
      }
    };

    fetchData();
  }, [user, selectedProfile]);

  const updateBusinessData = (field: keyof BusinessData, value: string) => {
    if (businessData) {
      setBusinessData(prev => ({ ...prev!, [field]: value }));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedProfile || !businessData) {
      toast.error("No profile selected or data is missing.");
      return;
    }
    setIsSaving(true);
    const toastId = toast.loading("Saving your profile...");
    try {
      const profileDocRef = doc(db, 'users', user.uid, 'businessProfiles', selectedProfile.id);
      await setDoc(profileDocRef, { 
        ...businessData,
        updatedAt: serverTimestamp(),
       }, { merge: true });
      toast.success("Profile saved successfully!", { id: toastId });
    } catch (error) {
      console.error("Error saving profile: ", error);
      toast.error("Failed to save profile.", { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = ['Business Overview', 'Business Details', 'Ownership Details', 'Financials', 'Business Needs', 'Documents'];
  const currentTabIndex = tabs.indexOf(currentTab);

  const handleNext = () => {
    if (currentTabIndex < tabs.length - 1) setCurrentTab(tabs[currentTabIndex + 1]);
  };

  const handlePrev = () => {
    if (currentTabIndex > 0) setCurrentTab(tabs[currentTabIndex - 1]);
  };
  
  const FormNavigation = () => (
    <div className="flex justify-between items-center mt-8 pt-6 border-t">
      <div>
        {currentTabIndex > 0 && (
          <Button type="button" variant="outline" onClick={handlePrev}>
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
        )}
      </div>
      <div className="flex items-center space-x-4">
        <Button type="submit" disabled={isSaving} className="bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400">
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
        {currentTabIndex < tabs.length - 1 && (
          <Button type="button" variant="outline" onClick={handleNext}>
            Next
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );

  const renderBusinessOverview = () => (
    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-8">
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
          <div className="flex-shrink-0"><div className="w-16 sm:w-20 h-16 sm:h-20 bg-gray-800 rounded-lg flex items-center justify-center"><span className="text-white text-xl sm:text-2xl font-bold ">DC</span></div></div>
          <div className="flex-grow">
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-1">Business logo</h3>
            <p className="text-xs sm:text-sm text-gray-500 mb-3">Support PNGs, JPEGs and GIFs under 10mb</p>
            <button type="button" className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600 hover:text-gray-800"><Upload className="w-3 h-3 sm:w-4 sm:h-4" /><span>Upload new photo</span></button>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div><label className="block text-sm font-medium text-gray-700 mb-2">Business Name*</label><input type="text" value={businessData!.businessName} onChange={(e) => updateBusinessData('businessName', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="Acme Tech Solutions"/></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-2">Legal Business Name (if different/registered)</label><input type="text" value={businessData!.legalBusinessName} onChange={(e) => updateBusinessData('legalBusinessName', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="Acme Tech Groups"/></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-2">Business Type*</label><div className="relative"><select value={businessData!.businessType} onChange={(e) => updateBusinessData('businessType', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white appearance-none"><option value="">Select business type</option><option value="LLC">LLC</option><option value="Corporation">Corporation</option><option value="Partnership">Partnership</option><option value="Sole Proprietorship">Sole Proprietorship</option><option value="Non-Profit">Non-Profit</option></select><ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" /></div></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-2">Industry*</label><div className="relative"><select value={businessData!.industry} onChange={(e) => updateBusinessData('industry', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white appearance-none"><option value="">Select industry</option><option value="Fintech">Fintech</option><option value="Healthcare">Healthcare</option><option value="Education">Education</option><option value="Technology">Technology</option><option value="Manufacturing">Manufacturing</option><option value="Retail">Retail</option><option value="Agriculture">Agriculture</option><option value="Energy">Energy</option></select><ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" /></div></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-2">Business Website</label><input type="url" value={businessData!.businessWebsite} onChange={(e) => updateBusinessData('businessWebsite', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="https://acme.io"/></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-2">Year Founded*</label><input type="number" value={businessData!.yearFounded} onChange={(e) => updateBusinessData('yearFounded', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="2023" min="1900" max={new Date().getFullYear()}/></div>
      </div>
      <div className="mt-6"><label className="block text-sm font-medium text-gray-700 mb-2">Business description*</label><textarea value={businessData!.businessDescription} onChange={(e) => updateBusinessData('businessDescription', e.target.value)} rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none" placeholder="We help small businesses automate bookkeeping.."/></div>
      <FormNavigation />
    </div>
  );

  const renderBusinessDetails = () => (
    !businessData ? null : <div className="bg-white rounded-lg shadow-sm p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div><label className="block text-sm font-medium text-gray-700 mb-2">Business Email*</label><input type="email" value={businessData.businessEmail} onChange={(e) => updateBusinessData('businessEmail', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="hello@acme.io"/></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-2">Business Number*</label><input type="tel" value={businessData.businessNumber} onChange={(e) => updateBusinessData('businessNumber', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="+1 555 123 4567"/></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-2">Country of Operation*</label><div className="relative"><select value={businessData.countryOfOperation} onChange={(e) => updateBusinessData('countryOfOperation', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white appearance-none"><option value="">Select country</option><option value="Nigeria">Nigeria</option><option value="Ghana">Ghana</option><option value="Kenya">Kenya</option><option value="South Africa">South Africa</option></select><ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" /></div></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-2">City/Region*</label><div className="relative"><select value={businessData.cityRegion} onChange={(e) => updateBusinessData('cityRegion', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white appearance-none"><option value="">Select city/region</option><option value="Lagos">Lagos</option><option value="Abuja">Abuja</option><option value="Kano">Kano</option><option value="Port Harcourt">Port Harcourt</option></select><ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" /></div></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-2">Business Address</label><input type="text" value={businessData.businessAddress} onChange={(e) => updateBusinessData('businessAddress', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="123 5th Avenue, Lagos, Nigeria"/></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-2">Social/Environmental Impact</label><input type="text" value={businessData.socialEnvironmentalImpact} onChange={(e) => updateBusinessData('socialEnvironmentalImpact', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="Reduced emissions by 20% in rural areas..."/></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-2">Target Audience/Customers*</label><input type="text" value={businessData.targetAudience} onChange={(e) => updateBusinessData('targetAudience', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="SMEs in sub-Saharan Africa"/></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-2">Key Achievements*</label><input type="text" value={businessData.keyAchievements} onChange={(e) => updateBusinessData('keyAchievements', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="Launched MVP, reached 1,000 users"/></div>
      </div>
      <div className="mt-6"><label className="block text-sm font-medium text-gray-700 mb-2">Mission Statement*</label><textarea value={businessData.missionStatement} onChange={(e) => updateBusinessData('missionStatement', e.target.value)} rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none" placeholder="We aim to democratize access to clean energy..."/></div>
      <FormNavigation />
    </div>
  );

  const renderOwnershipDetails = () => (
    !businessData ? null : <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><label className="block text-sm font-medium text-gray-700 mb-2">Business Owner Name*</label><input type="text" value={businessData.businessOwnerName} onChange={(e) => updateBusinessData('businessOwnerName', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="Jane Doe"/></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">Phone number</label><input type="tel" value={businessData.ownerPhoneNumber} onChange={(e) => updateBusinessData('ownerPhoneNumber', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="+1 555 123 4567"/></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">Owner Nationality</label><div className="relative"><select value={businessData.ownerNationality} onChange={(e) => updateBusinessData('ownerNationality', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white appearance-none"><option value="">Select nationality</option><option value="Nigeria">Nigeria</option><option value="Ghana">Ghana</option><option value="Kenya">Kenya</option><option value="South Africa">South Africa</option></select><ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" /></div></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">Role/Title*</label><div className="relative"><select value={businessData.roleTitle} onChange={(e) => updateBusinessData('roleTitle', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white appearance-none"><option value="">Select role</option><option value="CEO">CEO</option><option value="CTO">CTO</option><option value="COO">COO</option><option value="Founder">Founder</option></select><ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" /></div></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">Gender*</label><div className="relative"><select value={businessData.gender} onChange={(e) => updateBusinessData('gender', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white appearance-none"><option value="">Select gender</option><option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option><option value="Prefer not to say">Prefer not to say</option></select><ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" /></div></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">How many founders*</label><input type="text" value={businessData.numberOfFounders} onChange={(e) => updateBusinessData('numberOfFounders', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="e.g., 2"/></div>
        </div>
        <div className="mt-6"><label className="block text-sm font-medium text-gray-700 mb-2">% Ownership by Founder(s)</label><textarea value={businessData.ownershipPercentage} onChange={(e) => updateBusinessData('ownershipPercentage', e.target.value)} rows={6} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none" placeholder="If multiple founders, list them with their % of ownership"/></div>
        <FormNavigation />
    </div>
  );

  const renderFinancials = () => (
    !businessData ? null : <div className="bg-white rounded-lg shadow-sm p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div><label className="block text-sm font-medium text-gray-700 mb-2">How much revenue have you made so far?*</label><input type="text" value={businessData.totalRevenue} onChange={(e) => updateBusinessData('totalRevenue', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="$150,000"/></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-2">How much revenue do you make every month?</label><input type="text" value={businessData.monthlyRevenue} onChange={(e) => updateBusinessData('monthlyRevenue', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="$12,500"/></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-2">Number of Employees*</label><div className="relative"><select value={businessData.numberOfEmployees} onChange={(e) => updateBusinessData('numberOfEmployees', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white appearance-none"><option value="">Select number</option><option value="1-5">1-5</option><option value="6-10">6-10</option><option value="11-25">11-25</option><option value="26-50">26-50</option><option value="50+">50+</option></select><ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" /></div></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-2">Funding Raised (if any)*</label><div className="relative"><select value={businessData.fundingRaised} onChange={(e) => updateBusinessData('fundingRaised', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white appearance-none"><option value="">Select option</option><option value="Yes">Yes</option><option value="No">No</option></select><ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" /></div></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-2">Funding round*</label><div className="relative"><select value={businessData.fundingRound} onChange={(e) => updateBusinessData('fundingRound', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white appearance-none"><option value="">Select round</option><option value="Haven't raised yet">Haven't raised yet</option><option value="Pre-seed">Pre-seed</option><option value="Seed">Seed</option><option value="Series A">Series A</option><option value="Series B">Series B</option></select><ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" /></div></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-2">How many users or customers have you acquired?</label><input type="text" value={businessData.usersCustomers} onChange={(e) => updateBusinessData('usersCustomers', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="12"/></div>
      </div>
      <div className="mt-6"><label className="block text-sm font-medium text-gray-700 mb-2">Key partnerships or agreements</label><textarea value={businessData.partnerships} onChange={(e) => updateBusinessData('partnerships', e.target.value)} rows={6} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none" placeholder="We have partnered with..."/></div>
      <FormNavigation />
    </div>
  );

  const renderBusinessNeeds = () => (
    !businessData ? null : <div className="bg-white rounded-lg shadow-sm p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div><label className="block text-sm font-medium text-gray-700 mb-2">Registered Business?</label><div className="relative"><select value={businessData.registeredBusiness} onChange={(e) => updateBusinessData('registeredBusiness', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white appearance-none"><option value="">Select option</option><option value="Yes">Yes</option><option value="No">No</option></select><ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" /></div></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-2">Registration Number</label><input type="text" value={businessData.registrationNumber} onChange={(e) => updateBusinessData('registrationNumber', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="CAC1234567"/></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-2">Grant Amount Needed</label><input type="text" value={businessData.grantAmountNeeded} onChange={(e) => updateBusinessData('grantAmountNeeded', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="e.g., $50,000"/></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-2">Business stage</label><div className="relative"><select value={businessData.businessStage} onChange={(e) => updateBusinessData('businessStage', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white appearance-none"><option value="">Select stage</option><option value="Haven't raised yet">Haven't raised yet</option><option value="Pre-seed">Pre-seed</option><option value="Seed">Seed</option><option value="Series A">Series A</option><option value="Series B">Series B</option></select><ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" /></div></div>
      </div>
      <div className="mt-6"><label className="block text-sm font-medium text-gray-700 mb-2">Primary Funding Goal</label><textarea value={businessData.primaryFundingGoal} onChange={(e) => updateBusinessData('primaryFundingGoal', e.target.value)} rows={6} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none" placeholder="e.g., Product development, market expansion..."/></div>
      <FormNavigation />
    </div>
  );

  const renderDocuments = () => (
    <div className="bg-white rounded-lg shadow-sm p-8">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Upload Documents</h3>
      <p className="text-sm text-gray-600 mb-6">This feature for uploading files to Firebase Storage is coming soon!</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div><h3 className="text-lg font-medium text-gray-900 mb-4">Business Registration Certificate (CAC)</h3><div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center"><FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" /><div className="space-y-2"><p className="text-sm font-medium text-gray-900">Drag and drop file here</p><p className="text-xs text-gray-500">PDF, DOCX, PNG, JPG</p><Button type="button" variant="outline" size="sm">Choose File</Button><p className="text-xs text-gray-400 mt-1">Max size: 5MB</p></div></div></div>
        <div><h3 className="text-lg font-medium text-gray-900 mb-4">Pitch Deck</h3><div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center"><FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" /><div className="space-y-2"><p className="text-sm font-medium text-gray-900">Drag and drop file here</p><p className="text-xs text-gray-500">PDF, PPTX</p><Button type="button" variant="outline" size="sm">Choose File</Button><p className="text-xs text-gray-400 mt-1">Max size: 10MB</p></div></div></div>
      </div>
      <FormNavigation />
    </div>
  );

  const renderTabContent = () => {
    switch (currentTab) {
      case 'Business Overview': return renderBusinessOverview();
      case 'Business Details': return renderBusinessDetails();
      case 'Ownership Details': return renderOwnershipDetails();
      case 'Financials': return renderFinancials();
      case 'Business Needs': return renderBusinessNeeds();
      case 'Documents': return renderDocuments();
      default: return renderBusinessOverview();
    }
  };

  if (profileLoading) {
      return (
          <div className="flex justify-center items-center h-screen">
              <p>Loading profiles...</p>
          </div>
      );
  }
  
  if (!selectedProfile) {
    return (
        <div className="p-6 text-center">
            <h2 className="text-xl font-semibold">No Business Profile Selected</h2>
            <p className="mt-2 text-gray-600">Please select or create a business profile from the sidebar to begin.</p>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <form onSubmit={handleSave}>
        <div className="p-4 sm:p-6">
          <div className="mb-4 sm:mb-6">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">{businessData?.businessName || 'Business Profile'}</h1>
            <p className="text-sm sm:text-base text-gray-600">This information will be used by the AutoGrant AI to help you fill grant applications.</p>
          </div>
          <div className="mb-4 sm:mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex overflow-x-auto">
                {tabs.map((tab) => (
                  <button key={tab} type="button" onClick={() => setCurrentTab(tab)}
                    className={`py-2 px-3 sm:px-4 border-b-2 text-xs sm:text-sm font-medium whitespace-nowrap ${currentTab === tab ? 'border-teal-500 text-teal-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                    {tab}
                  </button>
                ))}
              </nav>
            </div>
          </div>
          <div className="space-y-4 sm:space-y-6">
            {renderTabContent()}
          </div>
        </div>
      </form>
      <style jsx>{`.hide-scrollbar::-webkit-scrollbar { display: none; } .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
    </div>
  );
};