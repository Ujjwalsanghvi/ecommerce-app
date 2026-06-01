import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useProfile } from '../../contexts/ProfileContext';
import { ProfileSidebar } from '../../components/Profile/ProfileSidebar';
import { AccountStatistics } from '../../components/Profile/AccountStatistics';
import { PersonalInfoSection } from '../../components/Profile/PersonalInfoSection';
import { EditProfileModal } from '../../components/Profile/EditProfileModal';
import { SignOutButton } from '../../components/Profile/SignOutButton';

export const ViewProfile: React.FC = () => {
  const { logout } = useAuth();
  const { profileData, updateProfilePicture, updateProfileData } = useProfile();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPersonalInfoOpen, setIsPersonalInfoOpen] = useState(true);
  const [editData, setEditData] = useState(profileData);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        updateProfilePicture(imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditClick = () => {
    setEditData(profileData);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleSaveChanges = () => {
    updateProfileData(editData);
    setIsModalOpen(false);
  };

  const handleInputChange = (field: keyof typeof editData, value: string) => {
    setEditData({ ...editData, [field]: value });
  };

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-80px)] bg-gray-100">
      <ProfileSidebar
        profileData={profileData}
        onEditClick={handleEditClick}
        onImageUpload={handleImageUpload}
      />

      <div className="flex-1 p-5 md:p-8 overflow-y-auto">
        <div className="mb-8">
          <h1 className="text-2xl md:text-[28px] text-gray-800">Profile Dashboard</h1>
        </div>

        {/* No props needed - AccountStatistics gets data from context */}
        <AccountStatistics />

        <PersonalInfoSection
          profileData={profileData}
          isOpen={isPersonalInfoOpen}
          onToggle={() => setIsPersonalInfoOpen(!isPersonalInfoOpen)}
        />

        <SignOutButton onLogout={logout} />
      </div>

      <EditProfileModal
        isOpen={isModalOpen}
        editData={editData}
        onClose={handleModalClose}
        onSave={handleSaveChanges}
        onInputChange={handleInputChange}
      />
    </div>
  );
};

export default ViewProfile;