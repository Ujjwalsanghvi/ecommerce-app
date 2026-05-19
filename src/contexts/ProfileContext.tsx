import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

interface ProfileData {
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  bio: string;
  profilePicture: string;
  joinDate: string;
}

interface ProfileContextType {
  profileData: ProfileData;
  updateProfilePicture: (imageUrl: string) => void;
  updateProfileData: (data: Partial<ProfileData>) => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within ProfileProvider');
  }
  return context;
};

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState<ProfileData>({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    bio: '',
    profilePicture: '',
    joinDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    loadProfileData();
  }, [user?.id]);

  const loadProfileData = () => {
    const savedProfile = localStorage.getItem(`profile_${user?.id}`);
    if (savedProfile) {
      const parsed = JSON.parse(savedProfile);
      setProfileData(parsed);
    }
  };

  const updateProfilePicture = (imageUrl: string) => {
    const updatedData = { ...profileData, profilePicture: imageUrl };
    setProfileData(updatedData);
    localStorage.setItem(`profile_${user?.id}`, JSON.stringify(updatedData));
  };

  const updateProfileData = (data: Partial<ProfileData>) => {
    const updatedData = { ...profileData, ...data };
    setProfileData(updatedData);
    localStorage.setItem(`profile_${user?.id}`, JSON.stringify(updatedData));
  };

  return (
    <ProfileContext.Provider value={{ profileData, updateProfilePicture, updateProfileData }}>
      {children}
    </ProfileContext.Provider>
  );
};