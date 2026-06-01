import React from 'react';
import { ProfileSidebar } from '../../components/Profile/ProfileSidebar';
import { AccountStatistics } from '../../components/Profile/AccountStatistics';
import { PersonalInfoSection } from '../../components/Profile/PersonalInfoSection';
import { EditProfileModal } from '../../components/Profile/EditProfileModal';
import { SignOutButton } from '../../components/Profile/SignOutButton';

export const ViewProfile: React.FC = () => {
  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-80px)] bg-gray-100">
      <ProfileSidebar />

      <div className="flex-1 p-5 md:p-8 overflow-y-auto">
        <div className="mb-8">
          <h1 className="text-2xl md:text-[28px] text-gray-800">Profile Dashboard</h1>
        </div>

        <AccountStatistics />
        <PersonalInfoSection />
        <SignOutButton />
      </div>

      <EditProfileModal />
    </div>
  );
};

export default ViewProfile;