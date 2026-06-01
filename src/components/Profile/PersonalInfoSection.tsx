import React from 'react';
import { ProfileData } from '../../types/ProfileData';
import { PersonalInfoSectionProps } from '../../types/PersonalInfoSectionProps';



export const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({
  profileData,
  isOpen,
  onToggle,
}) => {
  return (
    <div className="bg-white rounded-xl mb-5 overflow-hidden shadow-sm">
      <div
        className="flex items-center gap-3 p-4 cursor-pointer bg-white transition-colors duration-300 border-b border-gray-200 hover:bg-gray-50"
        onClick={onToggle}
      >
        <span className="text-2xl">👤</span>
        <h2 className="flex-1 text-lg font-semibold text-gray-800 m-0">Personal Information</h2>
        <span className="text-base text-gray-400">{isOpen ? '▼' : '▶'}</span>
      </div>
      {isOpen && (
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <InfoField label="Email Address" value={profileData.email} />
            <InfoField label="Date of Birth" value={profileData.dateOfBirth || 'Not provided'} />
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Bio</label>
              <p className="text-base text-gray-800 py-1.5">{profileData.bio || 'No bio provided'}</p>
            </div>
            <InfoField label="Member Since" value={new Date(profileData.joinDate).toLocaleDateString()} />
          </div>
        </div>
      )}
    </div>
  );
};

const InfoField: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex flex-col gap-2">
    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</label>
    <p className="text-base text-gray-800 py-1.5">{value}</p>
  </div>
);