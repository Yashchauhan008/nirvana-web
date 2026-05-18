

export interface User {
  id: string;
  name: string;
  email: string;
  phone_number: string;
  is_root_user: boolean;
}

export interface AuthUser {
  id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  phone_number: string;
  gst_number?: string | null;
  pan_number?: string | null;
  organization_name?: string | null;
}