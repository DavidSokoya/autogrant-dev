"use client";
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/authcontext';
import { db } from '@/lib/firebase';
import { doc, getDoc, collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, Timestamp, updateDoc } from 'firebase/firestore';
import { ChevronRight, Check, X, Download } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface UserProfile {
  walletBalance?: number;
  bankAccountNumber?: string;
  taxIdNumber?: string;
  businessName?: string;
  legalBusinessName?: string;
  businessType?: string;
  industry?: string;
  businessWebsite?: string;
  yearFounded?: string;
  businessDescription?: string;
  businessEmail?: string;
  businessNumber?: string;
  countryOfOperation?: string;
  cityRegion?: string;
  businessAddress?: string;
  socialEnvironmentalImpact?: string;
  targetAudience?: string;
  keyAchievements?: string;
  missionStatement?: string;
  businessOwnerName?: string;
  ownerPhoneNumber?: string;
  ownerNationality?: string;
  roleTitle?: string;
  gender?: string;
  numberOfFounders?: string;
  ownershipPercentage?: string;
  totalRevenue?: string;
  monthlyRevenue?: string;
  numberOfEmployees?: string;
  fundingRaised?: string;
  fundingRound?: string;
  usersCustomers?: string;
  partnerships?: string;
  registeredBusiness?: string;
  registrationNumber?: string;
  grantAmountNeeded?: string;
  businessStage?: string;
  primaryFundingGoal?: string;
}

interface Transaction {
  id: string;
  date: Timestamp | null; // Can be null temporarily
  type: 'Withdrawal' | 'Deposit';
  amount: number;
  status: 'Completed' | 'Cancelled' | 'Pending';
  description: string;
}

const WalletInterface = () => {
  const { user } = useAuth();
  const router = useRouter();

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const profileRef = doc(db, 'users', user.uid);
    const transactionsQuery = query(collection(db, `users/${user.uid}/transactions`), orderBy('date', 'desc'));

    const unsubscribeProfile = onSnapshot(profileRef, (docSnap) => {
        if (docSnap.exists()) {
            setUserProfile(docSnap.data() as UserProfile);
        }
        setLoading(false);
    });

    const unsubscribeTransactions = onSnapshot(transactionsQuery, (snapshot) => {
      const transData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Transaction[];
      setTransactions(transData);
    });

    return () => {
        unsubscribeProfile();
        unsubscribeTransactions();
    };
  }, [user]);

  const isAccountVerified = !!userProfile?.bankAccountNumber;
  const areMilestonesAdded = true;
  const isTinAdded = !!userProfile?.taxIdNumber;
  const isFullyVerified = isAccountVerified && areMilestonesAdded && isTinAdded;

  const handleWithdrawal = async () => {
    if (!user) return;
    if (!isFullyVerified) {
      toast.error("Please complete all verification steps to withdraw.");
      return;
    }
    
    const amountToWithdraw = userProfile?.walletBalance || 0;
    if (amountToWithdraw <= 0) {
      toast.error("You have no balance to withdraw.");
      return;
    }

    const toastId = toast.loading("Processing withdrawal request...");
    try {
      const transactionsRef = collection(db, `users/${user.uid}/transactions`);
      await addDoc(transactionsRef, {
        date: serverTimestamp(),
        type: 'Withdrawal',
        amount: amountToWithdraw,
        status: 'Pending',
        description: 'Grant fund withdrawal'
      });
      
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, { walletBalance: 0 });

      toast.success(`Withdrawal request for $${amountToWithdraw.toFixed(2)} submitted.`, { id: toastId });
    } catch (error) {
      toast.error("Failed to submit withdrawal request.", { id: toastId });
      console.error(error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'text-[#4ABAD3] bg-[#4ABAD3]/10';
      case 'Cancelled': return 'text-red-600 bg-red-50';
      case 'Pending': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusDot = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-[#4ABAD3]';
      case 'Cancelled': return 'bg-red-500';
      case 'Pending': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };
  
  if (loading) {
    return <div className="p-6 text-center">Loading Wallet...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4 sm:p-6 max-w-7xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-1 sm:mb-2">My Wallet</h1>
          <p className="text-sm sm:text-base text-gray-600">Manage your grant disbursement</p>
        </div>

        {!isFullyVerified && (
          <div className="bg-gradient-to-r from-[#1A9B7C] to-[#1E9478] rounded-lg p-4 sm:p-6 mb-6 sm:mb-8 text-white">
            <h2 className="text-sm sm:text-base lg:text-lg font-semibold mb-3 sm:mb-4 leading-tight">
              BUSINESS VERIFICATION - Complete information below to access your grant funds
            </h2>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-start sm:items-center">
                  <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full ${isAccountVerified ? 'bg-white' : 'border-2 border-white'} flex items-center justify-center mr-3 flex-shrink-0 mt-0.5 sm:mt-0`}>
                      {isAccountVerified ? <Check className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-500" /> : <X className="w-3 h-3 sm:w-4 sm:h-4 text-white" />}
                  </div>
                  <span className="text-sm sm:text-base leading-relaxed">Add your business account number</span>
              </div>
              <div className="flex flex-col gap-2 sm:gap-0 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start sm:items-center">
                      <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full ${areMilestonesAdded ? 'bg-white' : 'border-2 border-white'} flex items-center justify-center mr-3 flex-shrink-0 mt-0.5 sm:mt-0`}>
                          {areMilestonesAdded ? <Check className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-500" /> : <X className="w-3 h-3 sm:w-4 sm:h-4 text-white" />}
                      </div>
                      <span className="text-sm sm:text-base leading-relaxed">Add your business milestones</span>
                  </div>
                  <button onClick={() => router.push('/dashboard/milestones')} className="flex items-center justify-center sm:justify-start text-white hover:opacity-80 transition-opacity text-sm sm:text-base ml-8 sm:ml-0 bg-white/20 sm:bg-transparent rounded-md py-2 px-3 sm:p-0 font-medium sm:font-normal">
                      <span className="mr-1">Add milestones</span><ChevronRight className="w-4 h-4" />
                  </button>
              </div>
              <div className="flex flex-col gap-2 sm:gap-0 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start sm:items-center">
                      <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full ${isTinAdded ? 'bg-white' : 'border-2 border-white'} flex items-center justify-center mr-3 flex-shrink-0 mt-0.5 sm:mt-0`}>
                          {isTinAdded ? <Check className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-500" /> : <X className="w-3 h-3 sm:w-4 sm:h-4 text-white" />}
                      </div>
                      <span className="text-sm sm:text-base leading-relaxed">Add your tax identification number</span>
                  </div>
                  <button onClick={() => router.push('/dashboard/business')} className="flex items-center justify-center sm:justify-start text-white hover:opacity-80 transition-opacity text-sm sm:text-base ml-8 sm:ml-0 bg-white/20 sm:bg-transparent rounded-md py-2 px-3 sm:p-0 font-medium sm:font-normal">
                      <span className="mr-1">Add TIN number</span><ChevronRight className="w-4 h-4" />
                  </button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">
            <div className="text-center sm:text-left">
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">Total Balance</h3>
              <div className="text-3xl sm:text-4xl font-semibold text-gray-900 mb-2 sm:mb-0">
                ${(userProfile?.walletBalance || 0).toFixed(2)}
              </div>
              {isFullyVerified && (<p className="text-emerald-600 text-xs sm:text-sm mt-1 sm:mt-2">Withdrawals are unlocked upon milestone completion</p>)}
            </div>
            <Button onClick={handleWithdrawal} disabled={!isFullyVerified} size="lg">
              <Download className="w-4 h-4 mr-2" />Withdraw
            </Button>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Transactions</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {transactions.length > 0 ? transactions.map((transaction) => (
              <div key={transaction.id} className="px-4 sm:px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="lg:hidden">
                    <div className="flex items-start justify-between mb-3"><div className="flex-1 min-w-0"><div className="text-sm font-medium text-gray-900 mb-1">{transaction.type}</div><div className="text-xs sm:text-sm text-gray-600 truncate">{transaction.description}</div></div><div className="flex flex-col items-end ml-4"><div className="text-sm font-medium text-gray-900 mb-1">${transaction.amount.toFixed(2)}</div><span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}><div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${getStatusDot(transaction.status)}`}></div>{transaction.status}</span></div></div>
                    <div className="flex items-center justify-between">
                        <div className="text-xs sm:text-sm text-gray-500">{transaction.date?.toDate().toLocaleString() || 'Pending...'}</div>
                        <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    </div>
                </div>
                <div className="hidden lg:grid lg:grid-cols-5 gap-4 items-center">
                  <div className="text-sm text-gray-900">{transaction.date?.toDate().toLocaleString() || 'Pending...'}</div>
                  <div className="text-sm text-gray-900">{transaction.type}</div>
                  <div className="text-sm font-medium text-gray-900">${transaction.amount.toFixed(2)}</div>
                  <div><span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}><div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${getStatusDot(transaction.status)}`}></div>{transaction.status}</span></div>
                  <div className="text-sm text-gray-600">{transaction.description}</div>
                </div>
              </div>
            )) : <div className="p-10 text-center text-gray-500">No transactions yet.</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletInterface;