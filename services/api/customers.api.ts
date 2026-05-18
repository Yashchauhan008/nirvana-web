import httpCall from "../httpCall";

import type {
  RegisterCustomerRequest,
  RegisterCustomerResponse,
  VerifyCustomerEmailRequest,
  VerifyCustomerEmailResponse,
  LoginCustomerRequest,
  LoginCustomerResponse,
  GetCustomerProfileResponse,
  UpdateCustomerProfileRequest,
  UpdateCustomerProfileResponse,
  ListCustomerStatesResponse,
  GetCustomerAddressesResponse,
  UpsertCustomerAddressRequest,
  UpsertCustomerAddressResponse,
} from "@/types/customer.type";

export async function registerCustomer(
  data: RegisterCustomerRequest
): Promise<RegisterCustomerResponse> {
  const response = (await httpCall({
    method: "POST",
    url: "/customers/register",
    data,
  })) as RegisterCustomerResponse;

  return response;
}

/** Resend OTP using the pending registration JWT from the verify-email URL (no password stored client-side). */
export async function resendVerificationEmail(
  registrationToken: string
): Promise<RegisterCustomerResponse> {
  const response = (await httpCall({
    method: "POST",
    url: "/customers/resend-verification",
    data: { token: registrationToken },
  })) as RegisterCustomerResponse;

  return response;
}

export async function verifyCustomerEmail(
  data: VerifyCustomerEmailRequest
): Promise<VerifyCustomerEmailResponse> {
  const response = (await httpCall({
    method: "POST",
    url: "/customers/verify-email",
    data,
  })) as VerifyCustomerEmailResponse;

  return response;
}

export async function loginCustomer(
  data: LoginCustomerRequest
): Promise<LoginCustomerResponse> {
  const response = (await httpCall({
    method: "POST",
    url: "/customers/login",
    data,
  })) as LoginCustomerResponse;

  return response;
}

export async function getCustomerProfile(): Promise<GetCustomerProfileResponse> {
  const response = (await httpCall({
    method: "GET",
    url: "/customers/profile",
  })) as GetCustomerProfileResponse;

  return response;
}

export async function updateCustomerProfile(
  data: UpdateCustomerProfileRequest
): Promise<UpdateCustomerProfileResponse> {
  const response = (await httpCall({
    method: "PUT",
    url: "/customers/profile",
    data,
  })) as UpdateCustomerProfileResponse;

  return response;
}

export async function listCustomerStates(): Promise<ListCustomerStatesResponse> {
  const response = (await httpCall({
    method: "GET",
    url: "/customers/states",
  })) as ListCustomerStatesResponse;

  return response;
}

export async function getCustomerAddresses(): Promise<GetCustomerAddressesResponse> {
  const response = (await httpCall({
    method: "GET",
    url: "/customers/addresses",
  })) as GetCustomerAddressesResponse;

  return response;
}

export async function upsertCustomerAddress(
  type: "billing" | "shipping",
  data: UpsertCustomerAddressRequest
): Promise<UpsertCustomerAddressResponse> {
  const response = (await httpCall({
    method: "PUT",
    url: `/customers/addresses/${type}`,
    data,
  })) as UpsertCustomerAddressResponse;

  return response;
}

