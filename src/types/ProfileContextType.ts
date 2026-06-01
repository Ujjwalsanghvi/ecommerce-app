import { IAddress } from "./Address";
import { ImpOrder } from "./ImpOrder";
import { ProfileData } from "./ProfileData";
import { Transaction } from "./Transaction";

export interface ProfileContextType {
  profileData: ProfileData;
  updateProfilePicture: (imageUrl: string) => void;
  updateProfileData: (data: Partial<ProfileData>) => void;
  openEditModal: () => void;
  closeEditModal: () => void;
  isEditModalOpen: boolean;
  editData: ProfileData;
  setEditData: (data: ProfileData) => void;
  handleInputChange: (field: keyof ProfileData, value: string) => void;
  handleSaveChanges: () => void;
  handleEditClick: () => void;
  // Statistics data
  orders: ImpOrder[];
  addresses: IAddress[];
  transactions: Transaction[];
  walletBalance: number;
  loadStatistics: () => void;
}