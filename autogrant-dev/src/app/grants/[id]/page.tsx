"use client";
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Calendar, DollarSign, Building, FileText, Users, Globe, Tag, Clock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Grant {
  id: string;
  grantName: string;
  organization: string;
  shortDescription: string;
  fullDescription: string;
  amount: string;
  currency: string;
  applicationDeadline: string;
  category: string;
  eligibility: string;
  requirements: string[];
  benefits: string[];
  website: string;
  tags: string[];
  status: string;
  targetAudience: string;
  geographicScope: string;
  fundingType: string;
}

const GrantDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const grantId = params.id as string;

  const [grant, setGrant] = useState<Grant | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!grantId) return;

    const fetchGrant = async () => {
      setLoading(true);
      const docRef = doc(db, 'grants', grantId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setGrant({ id: docSnap.id, ...docSnap.data() } as Grant);
      } else {
        console.log("No such document!");
        router.push('/404');
      }
      setLoading(false);
    };

    fetchGrant();
  }, [grantId, router]);

  const handleApplyClick = () => {
    if (!grant?.website) return;

    let fullUrl = grant.website;
    if (!fullUrl.startsWith('http://') && !fullUrl.startsWith('https://')) {
          fullUrl = `https://${fullUrl}`;
    }
    window.open(fullUrl, '_blank', 'noopener,noreferrer');
  };


  if (loading) {
    return <div className="flex justify-center items-center h-screen"><p>Loading Grant Details...</p></div>;
  }

  if (!grant) {
    return <div className="flex justify-center items-center h-screen"><p>Grant not found.</p></div>;
  }

  const DetailItem = ({ icon, label, value }: { icon: React.ElementType, label: string, value?: string | null }) => {
    if (!value) return null;
    const Icon = icon;
    return (
        <div className="flex items-start space-x-3">
            <Icon className="h-5 w-5 text-gray-500 mt-1 flex-shrink-0" />
            <div>
                <p className="text-sm font-medium text-gray-600">{label}</p>
                <p className="text-base text-gray-900">{value}</p>
            </div>
        </div>
    );
  };
  
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto max-w-4xl py-12 px-4">
        {/* Header Section */}
        <div className="mb-8">
          <p className="text-emerald-600 font-semibold">{grant.category}</p>
          <h1 className="text-4xl font-bold text-gray-900 mt-2">{grant.grantName}</h1>
          <p className="text-xl text-gray-600 mt-2">from {grant.organization}</p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column - Main Details */}
          <div className="md:col-span-2 space-y-8">
            <div className="bg-white p-6 rounded-lg border">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Grant Overview</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{grant.fullDescription || grant.shortDescription}</p>
            </div>

            {grant.benefits && grant.benefits.length > 0 && (
                 <div className="bg-white p-6 rounded-lg border">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Benefits & What's Offered</h2>
                    <ul className="space-y-3">
                        {grant.benefits.map((item, index) => (
                            <li key={index} className="flex items-start space-x-3">
                                <CheckCircle className="h-5 w-5 text-emerald-500 mt-1 flex-shrink-0" />
                                <span className="text-gray-700">{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            
            {grant.requirements && grant.requirements.length > 0 && (
                <div className="bg-white p-6 rounded-lg border">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Application Requirements</h2>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                        {grant.requirements.map((item, index) => <li key={index}>{item}</li>)}
                    </ul>
                </div>
            )}
            
            <div className="bg-white p-6 rounded-lg border">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Eligibility</h2>
                <p className="text-gray-700 leading-relaxed">{grant.eligibility}</p>
            </div>
          </div>

          {/* Right Column - Key Info & Apply Button */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-lg border space-y-5">
              <h2 className="text-xl font-semibold text-gray-800 sr-only">Key Information</h2>
              <DetailItem icon={DollarSign} label="Amount" value={`${grant.amount} ${grant.currency}`} />
              <DetailItem icon={Calendar} label="Application Deadline" value={new Date(grant.applicationDeadline).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} />
              <DetailItem icon={Building} label="Organization" value={grant.organization} />
              <DetailItem icon={Users} label="Target Audience" value={grant.targetAudience} />
              <DetailItem icon={Globe} label="Geographic Scope" value={grant.geographicScope} />
              <DetailItem icon={Tag} label="Funding Type" value={grant.fundingType} />
            </div>        
            {grant.website && (
              <Button onClick={handleApplyClick} size="lg" className="w-full bg-emerald-600 hover:bg-emerald-700">
                  Apply Now or Visit Website
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GrantDetailPage;