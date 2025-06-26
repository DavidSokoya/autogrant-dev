"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './authcontext';
import { db } from '@/lib/firebase';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';

interface BusinessProfile {
  id: string;
  businessName: string;
}

interface ProfileContextType {
  profiles: BusinessProfile[];
  selectedProfile: BusinessProfile | null;
  switchProfile: (profile: BusinessProfile) => void;
  loading: boolean;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<BusinessProfile[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<BusinessProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setProfiles([]);
      setSelectedProfile(null);
      setLoading(false);
      return;
    }

    const profilesQuery = query(collection(db, `users/${user.uid}/businessProfiles`), orderBy("createdAt", "asc"));
    
    const unsubscribe = onSnapshot(profilesQuery, (snapshot) => {
      const profilesData = snapshot.docs.map(doc => ({
        id: doc.id,
        businessName: doc.data().businessName,
      })) as BusinessProfile[];
      
      setProfiles(profilesData);
      if (profilesData.length > 0 && (!selectedProfile || !profilesData.find(p => p.id === selectedProfile.id))) {
        setSelectedProfile(profilesData[0]);
      } else if (profilesData.length === 0) {
        setSelectedProfile(null);
      }
      
      setLoading(false);
    }, (error) => {
        console.error("Error fetching profiles: ", error);
        setLoading(false);
    });

    return () => unsubscribe();
  }, [user, selectedProfile]);

  const switchProfile = (profile: BusinessProfile) => {
    setSelectedProfile(profile);
  };

  const value = { profiles, selectedProfile, switchProfile, loading };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};