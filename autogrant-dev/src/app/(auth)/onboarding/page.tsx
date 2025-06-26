"use client";
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { useAuth } from "@/context/authcontext";
import { db, auth } from "@/lib/firebase"; 
import { doc, setDoc, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import toast from "react-hot-toast";

export default function OnboardingPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    businessName: "",
    businessNumber: "",
    businessEmail: "",
    website: "",
    industry: "",
    roleInCompany: "", 
    businessDescription: ""
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/'); 
    }
    if (user?.displayName) {
        const [firstName, ...lastName] = user.displayName.split(' ');
        setFormData(prev => ({ ...prev, firstName: firstName, lastName: lastName.join(' ') }));
    }
  }, [user, authLoading, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 
    if (!user) {
      toast.error("You must be logged in to create a profile.");
      return;
    }

    setIsSubmitting(true);
    const loadingToast = toast.loading("Setting up your profile...");

    try {
      const userDocRef = doc(db, "users", user.uid);
      const coreUserData = {
        uid: user.uid,
        email: user.email,
        role: 'user',
        firstName: formData.firstName,
        lastName: formData.lastName,
        createdAt: serverTimestamp(),
      };

      const profileCollectionRef = collection(db, "users", user.uid, "businessProfiles");
      const businessProfileData = {
        businessName: formData.businessName,
        businessNumber: formData.businessNumber,
        businessEmail: formData.businessEmail,
        website: formData.website,
        industry: formData.industry,
        roleInCompany: formData.roleInCompany,
        businessDescription: formData.businessDescription,
        createdAt: serverTimestamp(),
      };

      await Promise.all([
        setDoc(userDocRef, coreUserData, { merge: true }),
        addDoc(profileCollectionRef, businessProfileData),
        updateProfile(auth.currentUser!, {
            displayName: `${formData.firstName} ${formData.lastName}`.trim()
        })
      ]);
      
      toast.success("Profile created successfully!", { id: loadingToast });
      router.push("/dashboard");

    } catch (error) {
      console.error("Error creating profile: ", error);
      toast.error("Failed to create profile. Please try again.", { id: loadingToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <p>Loading...</p>
        </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 bg-white p-8 lg:p-16 flex items-center justify-center">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Welcome To AutoGrant
            </h1>
            <p className="text-gray-600 text-lg">
              Set up your first business profile to get started.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">First name</label>
                <input type="text" id="firstName" name="firstName" placeholder="Raye" value={formData.firstName} onChange={handleInputChange} required className="w-full px-4 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 placeholder-gray-400"/>
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">Last name</label>
                <input type="text" id="lastName" name="lastName" placeholder="Max" value={formData.lastName} onChange={handleInputChange} required className="w-full px-4 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 placeholder-gray-400"/>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
                <input type="text" id="businessName" name="businessName" placeholder="Raye Energy" value={formData.businessName} onChange={handleInputChange} required className="w-full px-4 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 placeholder-gray-400"/>
              </div>
              <div>
                <label htmlFor="businessNumber" className="block text-sm font-medium text-gray-700 mb-2">Business Number</label>
                <input type="text" id="businessNumber" name="businessNumber" placeholder="+234-801-000-000" value={formData.businessNumber} onChange={handleInputChange} className="w-full px-4 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 placeholder-gray-400"/>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="businessEmail" className="block text-sm font-medium text-gray-700 mb-2">Business Email</label>
                <input type="email" id="businessEmail" name="businessEmail" placeholder="info@tesla.com" value={formData.businessEmail} onChange={handleInputChange} required className="w-full px-4 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 placeholder-gray-400"/>
              </div>
              <div>
                <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                <input type="url" id="website" name="website" placeholder="www.autogrant.ng" value={formData.website} onChange={handleInputChange} className="w-full px-4 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 placeholder-gray-400"/>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                    <select id="industry" name="industry" value={formData.industry} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 text-gray-700 bg-white appearance-none" style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}>
                        <option value="">Select business industry</option>
                        <option value="technology">Technology</option>
                        <option value="healthcare">Healthcare</option>
                        <option value="finance">Finance</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="roleInCompany" className="block text-sm font-medium text-gray-700 mb-2">Your Role/Position</label>
                    <input type="text" id="roleInCompany" name="roleInCompany" placeholder="CEO and Founder" value={formData.roleInCompany} onChange={handleInputChange} className="w-full px-4 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 placeholder-gray-400"/>
                </div>
            </div>
            
            <div>
              <label htmlFor="businessDescription" className="block text-sm font-medium text-gray-700 mb-2">Business Description</label>
              <textarea id="businessDescription" name="businessDescription" placeholder="Write a short detail about your business" value={formData.businessDescription} onChange={handleInputChange} rows={4} className="w-full px-4 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 placeholder-gray-400 resize-none"/>
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-emerald-700 transition duration-300 disabled:bg-emerald-400"
            >
              {isSubmitting ? "Creating Profile..." : "Continue to Dashboard"}
            </button>
          </form>
        </div>
      </div>
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-emerald-600 ...">
      </div>
    </div>
  );
}