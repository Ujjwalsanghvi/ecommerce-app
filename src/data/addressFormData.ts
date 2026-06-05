import { IAddress } from '../types/Address';

// If address is passed → populate from it, otherwise → return empty form
export const getInitialAddressForm = (address?: IAddress) => ({
  fullName: address?.fullName ?? '',
  street: address?.street ?? '',
  city: address?.city ?? '',
  state: address?.state ?? '',
  zipCode: address?.zipCode ?? '',
  country: address?.country ?? '',
  phone: address?.phone ?? ''
});