"use client";
import { useMemo } from "react";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';


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

export function ProfileCompletionCard({ profile }: { profile: UserProfile | null }) {
  const router = useRouter();

  // Calculate the completion percentage 
  const percentage = useMemo(() => {
    if (!profile) return 0;

    // List of fields to check for completion.
    const fields = [
      'firstName', 'lastName', 'businessName', 'businessNumber', 
      'businessEmail', 'website', 'industry', 'roleInCompany', 'businessDescription'
    ];
    
    // ow many of the fields are filled 
    const completedFields = fields.filter(field => !!profile[field as keyof UserProfile]).length;
    
    // Calculate the percentage
    return Math.round((completedFields / fields.length) * 100);
  }, [profile]);

  // If the profile is 100% complete, don't show this card at all.
  if (percentage === 100) {
    return null;
  }
  
  // SVG calculation values
  const radius = 40;
  const stroke = 10;
  const normalizedRadius = radius - stroke / 2;
  const circumference = Math.PI * normalizedRadius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="w-full bg-white rounded-md border overflow-hidden">
      <div className="w-full h-3 bg-emerald-600 rounded-t-md" />
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 ">
        <div className="flex items-start gap-4 p-6">
          <div className="flex-shrink-0 p-2 rounded-full bg-gray-100">
            <User className="h-6 w-6 text-gray-600" />
          </div>
          <div>
            <p className="text-base font-medium text-gray-800">
              Your profile is not yet complete. You need a complete profile to get full access to AutoGrant AI assistance.
            </p>
          
            <Button 
              size="sm" 
              variant="link" 
              className="px-0 text-emerald-600 hover:text-emerald-700"
              onClick={() => router.push('/dashboard/business')}
            >
              Complete Your Profile →
            </Button>
          </div>
        </div>
        <div className="flex-shrink-0 w-full md:w-36 flex flex-col gap-2 items-center justify-center relative md:-bottom-3 md:right-4">
          <svg width="140" height="70" viewBox="0 0 100 50" className="overflow-hidden">
            <path d="M 10,50 A 40,40 0 0,1 90,50" fill="none" stroke="#e5e7eb" strokeWidth={stroke} />
            <path d="M 10,50 A 40,40 0 0,1 90,50" fill="none" stroke="#059669" strokeWidth={stroke} strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" />
            <text x="50" y="45" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#111827">
              {percentage}%
            </text>
          </svg>
        </div>
      </div>
    </div>
  );
}