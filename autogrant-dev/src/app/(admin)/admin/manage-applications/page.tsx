"use client";
import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, Timestamp } from 'firebase/firestore';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface Application {
    id: string;
    grantName: string;
    grantId: string;
    applicantName: string;
    applicantEmail: string;
    submittedAt: Timestamp;
    status: 'submitted' | 'in-review' | 'approved' | 'rejected';
}

const statusOptions: Application['status'][] = ['submitted', 'in-review', 'approved', 'rejected'];

const getStatusColor = (status: string) => {
    switch (status) {
        case 'approved': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
        case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
        case 'in-review': return 'bg-blue-100 text-blue-800 border-blue-200';
        case 'submitted': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
};

const ManageApplicationsPage = () => {
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        const appsQuery = query(collection(db, "applications"), orderBy("submittedAt", "desc"));
        
        const unsubscribe = onSnapshot(appsQuery, (snapshot) => {
            const appsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Application[];
            setApplications(appsData);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching applications:", error);
            toast.error("Failed to fetch applications.");
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleStatusChange = async (appId: string, newStatus: Application['status']) => {
        const appRef = doc(db, "applications", appId);
        const toastId = toast.loading("Updating status...");
        try {
            await updateDoc(appRef, { status: newStatus });
            toast.success("Status updated successfully!", { id: toastId });
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error("Failed to update status.", { id: toastId });
        }
    };

    const filteredApplications = applications.filter(app => {
        if (filter === 'all') return true;
        return app.status === filter;
    });

    if (loading) {
        return <div className="p-6 text-center">Loading all applications...</div>;
    }

    return (
        <div>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Manage Applications</h1>
                    <p className="text-gray-600 mt-1">Review and update the status of user applications.</p>
                </div>
                <div>
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="w-full md:w-auto appearance-none rounded-md px-3 py-2 border border-gray-300 bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    >
                        <option value="all">All Statuses</option>
                        {statusOptions.map(option => (
                            <option key={option} value={option} className="capitalize">{option.replace('-', ' ')}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[640px]">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicant</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grant Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted On</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredApplications.length > 0 ? filteredApplications.map((app) => (
                                <tr key={app.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{app.applicantName}</div>
                                        <div className="text-sm text-gray-500">{app.applicantEmail}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                        <Link href={`/grants/${app.grantId}`} className="hover:underline hover:text-emerald-600" target="_blank">
                                            {app.grantName}
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {app.submittedAt?.toDate().toLocaleString() ?? 'Pending...'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <select
                                            value={app.status}
                                            onChange={(e) => handleStatusChange(app.id, e.target.value as Application['status'])}
                                            className={cn(`w-full appearance-none rounded-md px-3 py-1.5 border-none focus:ring-2 focus:ring-emerald-500 capitalize`, getStatusColor(app.status))}
                                        >
                                            {statusOptions.map(option => (
                                                <option key={option} value={option}>{option.replace('-', ' ')}</option>
                                            ))}
                                        </select>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={4} className="text-center py-10 text-gray-500">No applications found for the selected filter.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ManageApplicationsPage;