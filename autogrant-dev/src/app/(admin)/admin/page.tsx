"use client";
import React, { useState, useEffect } from 'react';
import { Users, Trophy, FileText, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, limit, QueryDocumentSnapshot } from 'firebase/firestore';

interface Grant {
  id: string;
  grantName: string;
  organization: string;
  amount: string;
  status: string;
}

interface Stats {
  totalUsers: number;
  totalGrants: number;
  totalApplications: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<Stats>({ totalUsers: 0, totalGrants: 0, totalApplications: 2 });
  const [recentGrants, setRecentGrants] = useState<Grant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const usersQuery = query(collection(db, "users"));
        const grantsQuery = query(collection(db, "grants"));
        const recentGrantsQuery = query(collection(db, "grants"), orderBy("createdAt", "desc"), limit(5));

        const [userSnapshot, grantSnapshot, recentGrantsSnapshot] = await Promise.all([
          getDocs(usersQuery),
          getDocs(grantsQuery),
          getDocs(recentGrantsQuery)
        ]);

        setStats({
          totalUsers: userSnapshot.size,
          totalGrants: grantSnapshot.size,
          totalApplications: 2,
        });
        
        const grantsData = recentGrantsSnapshot.docs.map((doc: QueryDocumentSnapshot) => ({
          id: doc.id,
          ...doc.data()
        })) as Grant[];
        setRecentGrants(grantsData);

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Here is a live overview of platform activity.</p>
        </div>
        <Link href="/admin/create-grant" className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center space-x-2">
          <Trophy className="w-4 h-4" />
          <span>Create Grant</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 text-sm font-medium">Total Users</h3>
            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center"><Users className="w-5 h-5 text-emerald-600" /></div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">{loading ? '...' : stats.totalUsers}</div>
          <div className="flex items-center text-sm"><TrendingUp className="w-4 h-4 text-emerald-500 mr-1" /><span className="text-emerald-500">All registered users</span></div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 text-sm font-medium">Total Grants</h3>
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center"><Trophy className="w-5 h-5 text-blue-600" /></div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">{loading ? '...' : stats.totalGrants}</div>
          <div className="flex items-center text-sm"><TrendingUp className="w-4 h-4 text-emerald-500 mr-1" /><span className="text-emerald-500">All created grants</span></div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 text-sm font-medium">Total Applications</h3>
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center"><FileText className="w-5 h-5 text-purple-600" /></div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">{stats.totalApplications}</div> 
          <div className="flex items-center text-sm"><TrendingUp className="w-4 h-4 text-emerald-500 mr-1" /><span className="text-emerald-500">Coming soon</span></div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Grants</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grant Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Organization</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan={4} className="text-center py-5">Loading...</td></tr>
              ) : recentGrants.length > 0 ? (
                recentGrants.map((grant) => (
                  <tr key={grant.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{grant.grantName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{grant.organization}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{grant.amount}</td>
                    <td className="px-6 py-4 whitespace-nowrap"><span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold`}>{grant.status}</span></td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={4} className="text-center py-5">No recent grants found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;