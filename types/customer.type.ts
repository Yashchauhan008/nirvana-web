export interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  phone_number: string;
  gst_number?: string | null;
  pan_number?: string | null;
  organization_name?: string | null;
  is_email_verified: boolean;
  created_at: string;
}

export interface RegisterCustomerRequest {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone_number: string;
}

export interface RegisterCustomerResponse {
  token: string;
  expires_at: string;
}

export interface VerifyCustomerEmailRequest {
  token: string;
  otp: string;
}

export interface VerifyCustomerEmailResponse {
  token: string;
  customer: Customer;
  expires_at: string;
}

export interface LoginCustomerRequest {
  email: string;
  password: string;
}

export interface LoginCustomerResponse {
  customer: Customer;
  token: string;
  expires_at: string;
}

export interface GetCustomerProfileResponse {
  customer: Customer;
}

export interface UpdateCustomerProfileRequest {
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  gst_number?: string;
  pan_number?: string;
  organization_name?: string;
}

export interface UpdateCustomerProfileResponse {
  customer: Customer;
}

export interface CustomerState {
  id: string;
  name: string;
  gst_code: string;
  is_union_territory: boolean;
}

export interface CustomerAddress {
  id: string;
  type: "billing" | "shipping";
  address: string;
  city: string;
  postal_code: string;
  state_id: string;
  state_name?: string;
  state_gst_code?: string;
}

export interface ListCustomerStatesResponse {
  states: CustomerState[];
}

export interface GetCustomerAddressesResponse {
  billing_address: CustomerAddress | null;
  shipping_address: CustomerAddress | null;
}

export interface UpsertCustomerAddressRequest {
  address: string;
  city: string;
  state_id: string;
  postal_code: string;
}

export interface UpsertCustomerAddressResponse {
  address: CustomerAddress;
}

