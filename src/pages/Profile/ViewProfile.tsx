import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

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

export const ViewProfile: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
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
  const [tempProfileData, setTempProfileData] = useState<ProfileData>(profileData);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = () => {
    const savedProfile = localStorage.getItem(`profile_${user?.id}`);
    if (savedProfile) {
      const parsed = JSON.parse(savedProfile);
      setProfileData(parsed);
      setTempProfileData(parsed);
    }
  };

  const saveProfileData = (data: ProfileData) => {
    localStorage.setItem(`profile_${user?.id}`, JSON.stringify(data));
    setProfileData(data);
  };

  const handleEdit = () => {
    setTempProfileData(profileData);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setTempProfileData(profileData);
    setIsEditing(false);
  };

  const handleSave = () => {
    saveProfileData(tempProfileData);
    setIsEditing(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        if (isEditing) {
          setTempProfileData({ ...tempProfileData, profilePicture: imageUrl });
        } else {
          setProfileData({ ...profileData, profilePicture: imageUrl });
          saveProfileData({ ...profileData, profilePicture: imageUrl });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setTempProfileData({ ...tempProfileData, [field]: value });
  };

  const currentData = isEditing ? tempProfileData : profileData;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>My Profile</h1>
        {!isEditing ? (
          <button onClick={handleEdit} style={styles.editButton}>
            ✏️ Edit Profile
          </button>
        ) : (
          <div style={styles.editActions}>
            <button onClick={handleSave} style={styles.saveButton}>
              ✓ Save Changes
            </button>
            <button onClick={handleCancel} style={styles.cancelButton}>
              ✕ Cancel
            </button>
          </div>
        )}
      </div>

      <div style={styles.profileContainer}>
        {/* Profile Picture Section */}
        <div style={styles.profilePictureSection}>
          <div style={styles.avatarContainer}>
            {currentData.profilePicture ? (
              <img src={currentData.profilePicture} alt="Profile" style={styles.profileImage} />
            ) : (
              <div style={styles.profilePlaceholder}>
                <span style={styles.placeholderText}>
                  {currentData.fullName?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
            )}
            <button
              onClick={() => fileInputRef.current?.click()}
              style={styles.uploadButton}
            >
              📷
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              style={{ display: 'none' }}
            />
          </div>
          <p style={styles.uploadHint}>Click on camera to upload profile picture</p>
        </div>

        {/* Profile Details Section */}
        <div style={styles.detailsSection}>
          <div style={styles.infoCard}>
            <h3 style={styles.sectionTitle}>Personal Information</h3>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Full Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={tempProfileData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  style={styles.input}
                />
              ) : (
                <p style={styles.value}>{currentData.fullName || 'Not provided'}</p>
              )}
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Email Address</label>
              <p style={styles.value}>{currentData.email}</p>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Phone Number</label>
              {isEditing ? (
                <input
                  type="tel"
                  value={tempProfileData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="Enter your phone number"
                  style={styles.input}
                />
              ) : (
                <p style={styles.value}>{currentData.phone || 'Not provided'}</p>
              )}
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Date of Birth</label>
              {isEditing ? (
                <input
                  type="date"
                  value={tempProfileData.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  style={styles.input}
                />
              ) : (
                <p style={styles.value}>{currentData.dateOfBirth || 'Not provided'}</p>
              )}
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Gender</label>
              {isEditing ? (
                <select
                  value={tempProfileData.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  style={styles.select}
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              ) : (
                <p style={styles.value}>
                  {currentData.gender ? currentData.gender.charAt(0).toUpperCase() + currentData.gender.slice(1) : 'Not provided'}
                </p>
              )}
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Bio</label>
              {isEditing ? (
                <textarea
                  value={tempProfileData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  placeholder="Tell us about yourself"
                  rows={4}
                  style={styles.textarea}
                />
              ) : (
                <p style={styles.value}>{currentData.bio || 'No bio provided'}</p>
              )}
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Member Since</label>
              <p style={styles.value}>{new Date(currentData.joinDate).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Account Statistics */}
          <div style={styles.statsCard}>
            <h3 style={styles.sectionTitle}>Account Statistics</h3>
            <div style={styles.statItem}>
              <span style={styles.statLabel}>Total Orders</span>
              <span style={styles.statValue}>
                {JSON.parse(localStorage.getItem(`orders_${user?.id}`) || '[]').length}
              </span>
            </div>
            <div style={styles.statItem}>
              <span style={styles.statLabel}>Saved Addresses</span>
              <span style={styles.statValue}>
                {JSON.parse(localStorage.getItem(`addresses_${user?.id}`) || '[]').length}
              </span>
            </div>
            <div style={styles.statItem}>
              <span style={styles.statLabel}>Wallet Balance</span>
              <span style={styles.statValue}>
                ${parseFloat(localStorage.getItem(`wallet_balance_${user?.id}`) || '0').toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px 20px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    flexWrap: 'wrap' as const,
    gap: '15px',
  },
  title: {
    fontSize: '28px',
    color: '#333',
  },
  editButton: {
    backgroundColor: '#4fc3f7',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.3s',
  },
  editActions: {
    display: 'flex',
    gap: '10px',
  },
  saveButton: {
    backgroundColor: '#4caf50',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.3s',
  },
  cancelButton: {
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.3s',
  },
  profileContainer: {
    display: 'grid',
    gridTemplateColumns: '300px 1fr',
    gap: '30px',
  },
  profilePictureSection: {
    textAlign: 'center' as const,
  },
  avatarContainer: {
    position: 'relative' as const,
    display: 'inline-block',
  },
  profileImage: {
    width: '200px',
    height: '200px',
    borderRadius: '50%',
    objectFit: 'cover' as const,
    border: '4px solid #4fc3f7',
  },
  profilePlaceholder: {
    width: '200px',
    height: '200px',
    borderRadius: '50%',
    backgroundColor: '#4fc3f7',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '4px solid #4fc3f7',
  },
  placeholderText: {
    fontSize: '80px',
    fontWeight: 'bold',
    color: 'white',
  },
  uploadButton: {
    position: 'absolute' as const,
    bottom: '10px',
    right: '10px',
    backgroundColor: '#4fc3f7',
    border: 'none',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    fontSize: '20px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s',
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
  },
  uploadHint: {
    marginTop: '15px',
    fontSize: '12px',
    color: '#666',
  },
  detailsSection: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px',
  },
  infoCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '30px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  },
  statsCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '30px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  },
  sectionTitle: {
    fontSize: '20px',
    color: '#333',
    marginBottom: '20px',
    paddingBottom: '10px',
    borderBottom: '2px solid #4fc3f7',
  },
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: '#555',
    marginBottom: '8px',
  },
  value: {
    fontSize: '16px',
    color: '#333',
    padding: '8px 0',
  },
  input: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '14px',
    transition: 'border-color 0.3s',
  },
  select: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '14px',
    backgroundColor: 'white',
  },
  textarea: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '14px',
    fontFamily: 'inherit',
    resize: 'vertical' as const,
  },
  statItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 0',
    borderBottom: '1px solid #f0f0f0',
  },
  statLabel: {
    fontSize: '14px',
    color: '#666',
  },
  statValue: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#4fc3f7',
  },
};

// Add hover styles
const styleSheet2 = document.createElement("style");
styleSheet2.textContent = `
  button:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }
  
  input:focus, select:focus, textarea:focus {
    outline: none;
    border-color: #4fc3f7;
    box-shadow: 0 0 0 3px rgba(79, 195, 247, 0.1);
  }
`;
document.head.appendChild(styleSheet2);