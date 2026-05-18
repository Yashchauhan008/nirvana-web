"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, LogOut, Settings, Truck, UserRound } from "lucide-react";
import { toast } from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { setStoredUserJson } from "@/utils/authStorage";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  getCustomerAddresses,
  getCustomerProfile,
  listCustomerStates,
  updateCustomerProfile,
  upsertCustomerAddress,
} from "@/services/api/customers.api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { UpdateCustomerProfileRequest } from "@/types/customer.type";

interface AddressFormData {
  address: string;
  city: string;
  state_id: string;
  postal_code: string;
}

interface ProfileFormData {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  gst_number: string;
  pan_number: string;
  organization_name: string;
}

const EMPTY_ADDRESS: AddressFormData = {
  address: "",
  city: "",
  state_id: "",
  postal_code: "",
};

export default function AccountSettings() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { authUser, isHydrated, isLoggedIn, logout } = useAuth();
  const [billingAddress, setBillingAddress] = useState<AddressFormData | null>(null);
  const [shippingAddress, setShippingAddress] = useState<AddressFormData | null>(null);
  const [profileForm, setProfileForm] = useState<ProfileFormData | null>(null);

  const { data: profileResponse, isLoading: isProfileLoading } = useQuery({
    queryKey: ["customer", "profile"],
    queryFn: getCustomerProfile,
    enabled: isHydrated && isLoggedIn,
  });

  const { data: statesResponse, isLoading: isStatesLoading } = useQuery({
    queryKey: ["customer", "states"],
    queryFn: listCustomerStates,
    enabled: isHydrated && isLoggedIn,
  });

  const { data: addressesResponse } = useQuery({
    queryKey: ["customer", "addresses"],
    queryFn: getCustomerAddresses,
    enabled: isHydrated && isLoggedIn,
  });

  const { mutate: updateProfile, isPending: isUpdatingProfile } = useMutation({
    mutationFn: (payload: UpdateCustomerProfileRequest) => updateCustomerProfile(payload),
    onSuccess: (response) => {
      const { customer } = response;
      setProfileForm({
        first_name: customer.first_name ?? "",
        last_name: customer.last_name ?? "",
        email: customer.email ?? "",
        phone_number: customer.phone_number ?? "",
        gst_number: customer.gst_number ?? "",
        pan_number: customer.pan_number ?? "",
        organization_name: customer.organization_name ?? "",
      });

      if (authUser) {
        setStoredUserJson(
          JSON.stringify({
            ...authUser,
            ...customer,
          }),
        );
      }

      toast.success("Profile updated");
    },
  });

  const { mutate: updateAddress, isPending: isSavingAddress } = useMutation({
    mutationFn: ({
      type,
      payload,
    }: {
      type: "billing" | "shipping";
      payload: {
        address: string;
        city: string;
        state_id: string;
        postal_code: string;
      };
    }) => upsertCustomerAddress(type, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["customer", "addresses"] });
      toast.success(
        variables.type === "billing"
          ? "Billing address saved"
          : "Shipping address saved"
      );
    },
  });

  useEffect(() => {
    if (!isHydrated) return;

    if (!isLoggedIn) {
      const redirectUrl = encodeURIComponent("/account");
      router.replace(`/login?redirect_url=${redirectUrl}`);
    }
  }, [isHydrated, isLoggedIn, router]);

  const defaultProfileForm: ProfileFormData = profileResponse?.customer
    ? {
        first_name: profileResponse.customer.first_name ?? "",
        last_name: profileResponse.customer.last_name ?? "",
        email: profileResponse.customer.email ?? "",
        phone_number: profileResponse.customer.phone_number ?? "",
        gst_number: profileResponse.customer.gst_number ?? "",
        pan_number: profileResponse.customer.pan_number ?? "",
        organization_name: profileResponse.customer.organization_name ?? "",
      }
    : {
        first_name: authUser?.first_name ?? "",
        last_name: authUser?.last_name ?? "",
        email: authUser?.email ?? "",
        phone_number: authUser?.phone_number ?? "",
        gst_number: authUser?.gst_number ?? "",
        pan_number: authUser?.pan_number ?? "",
        organization_name: authUser?.organization_name ?? "",
      };

  const defaultBillingAddress: AddressFormData = addressesResponse?.billing_address
    ? {
        address: addressesResponse.billing_address.address ?? "",
        city: addressesResponse.billing_address.city ?? "",
        state_id: addressesResponse.billing_address.state_id ?? "",
        postal_code: addressesResponse.billing_address.postal_code ?? "",
      }
    : EMPTY_ADDRESS;

  const defaultShippingAddress: AddressFormData = addressesResponse?.shipping_address
    ? {
        address: addressesResponse.shipping_address.address ?? "",
        city: addressesResponse.shipping_address.city ?? "",
        state_id: addressesResponse.shipping_address.state_id ?? "",
        postal_code: addressesResponse.shipping_address.postal_code ?? "",
      }
    : EMPTY_ADDRESS;

  const profileValues = profileForm ?? defaultProfileForm;
  const billingValues = billingAddress ?? defaultBillingAddress;
  const shippingValues = shippingAddress ?? defaultShippingAddress;

  function updateAddressField(
    type: "billing" | "shipping",
    field: keyof AddressFormData,
    value: string
  ) {
    if (type === "billing") {
      setBillingAddress((prev) => ({ ...(prev ?? billingValues), [field]: value }));
      return;
    }

    setShippingAddress((prev) => ({ ...(prev ?? shippingValues), [field]: value }));
  }

  function updateProfileField(field: keyof ProfileFormData, value: string) {
    setProfileForm((prev) => ({ ...(prev ?? profileValues), [field]: value }));
  }

  function handleProfileUpdate() {
    const phoneNumber = profileValues.phone_number.trim();
    const gstNumber = profileValues.gst_number.trim();
    const panNumber = profileValues.pan_number.trim();
    const organizationName = profileValues.organization_name.trim();

    updateProfile({
      first_name: profileValues.first_name.trim(),
      last_name: profileValues.last_name.trim(),
      phone_number: phoneNumber || undefined,
      gst_number: gstNumber || undefined,
      pan_number: panNumber || undefined,
      organization_name: organizationName || undefined,
    });
  }

  function saveBillingAddress() {
    updateAddress({
      type: "billing",
      payload: {
        address: billingValues.address.trim(),
        city: billingValues.city.trim(),
        state_id: billingValues.state_id,
        postal_code: billingValues.postal_code.trim(),
      },
    });
  }

  function saveShippingAddress() {
    updateAddress({
      type: "shipping",
      payload: {
        address: shippingValues.address.trim(),
        city: shippingValues.city.trim(),
        state_id: shippingValues.state_id,
        postal_code: shippingValues.postal_code.trim(),
      },
    });
  }

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-background px-4 py-10 md:px-6">
        <div className="mx-auto max-w-4xl">
          <p className="text-sm text-muted-foreground">Loading account settings...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn || !authUser) return null;

  return (
    <div className="min-h-screen bg-background px-4 py-10 md:px-6">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">
            Customer Portal
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Account Settings
          </h1>
          <p className="text-sm text-muted-foreground">
            Review your account details and manage core account preferences.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserRound className="size-4 text-primary" />
              Profile Information
            </CardTitle>
            <CardDescription>
              Update your customer profile details used in ecommerce checkout. Email
              is read-only.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="first_name">First name</Label>
                <Input
                  id="first_name"
                  value={profileValues.first_name}
                  onChange={(event) =>
                    updateProfileField("first_name", event.target.value)
                  }
                  disabled={isProfileLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Last name</Label>
                <Input
                  id="last_name"
                  value={profileValues.last_name}
                  onChange={(event) => updateProfileField("last_name", event.target.value)}
                  disabled={isProfileLoading}
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profileValues.email}
                  disabled
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone_number">Phone number</Label>
                <Input
                  id="phone_number"
                  value={profileValues.phone_number}
                  onChange={(event) =>
                    updateProfileField("phone_number", event.target.value)
                  }
                  disabled={isProfileLoading}
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="gst_number">GST number</Label>
                <Input
                  id="gst_number"
                  value={profileValues.gst_number}
                  onChange={(event) =>
                    updateProfileField("gst_number", event.target.value.toUpperCase())
                  }
                  placeholder="15 character GST number"
                  disabled={isProfileLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pan_number">PAN number</Label>
                <Input
                  id="pan_number"
                  value={profileValues.pan_number}
                  onChange={(event) =>
                    updateProfileField("pan_number", event.target.value.toUpperCase())
                  }
                  placeholder="10 character PAN number"
                  disabled={isProfileLoading}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="organization_name">Organization name</Label>
              <Input
                id="organization_name"
                value={profileValues.organization_name}
                onChange={(event) =>
                  updateProfileField("organization_name", event.target.value)
                }
                placeholder="Organization / company name"
                disabled={isProfileLoading}
              />
            </div>
            <Button
              onClick={handleProfileUpdate}
              disabled={isProfileLoading || isUpdatingProfile}
            >
              {isUpdatingProfile ? "Updating..." : "Update profile"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="size-4 text-primary" />
              Billing Address
            </CardTitle>
            <CardDescription>
              Address fields are empty by default. Fill only if needed.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="billing_address">Address</Label>
              <Input
                id="billing_address"
                value={billingValues.address}
                onChange={(event) =>
                  updateAddressField("billing", "address", event.target.value)
                }
                placeholder="House number, street, landmark"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="billing_city">City</Label>
                <Input
                  id="billing_city"
                  value={billingValues.city}
                  onChange={(event) =>
                    updateAddressField("billing", "city", event.target.value)
                  }
                  placeholder="City"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="billing_state">State</Label>
                <Select
                  value={billingValues.state_id}
                  onValueChange={(value) =>
                    updateAddressField("billing", "state_id", value)
                  }
                >
                  <SelectTrigger
                    id="billing_state"
                    className="w-full"
                    disabled={isStatesLoading || !(statesResponse?.states?.length)}
                  >
                    <SelectValue
                      placeholder={isStatesLoading ? "Loading states..." : "Select state"}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {(statesResponse?.states ?? []).length ? (
                      (statesResponse?.states ?? []).map((state) => (
                        <SelectItem key={state.id} value={state.id}>
                          {state.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="__no_states__" disabled>
                        No states available
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="max-w-xs space-y-2">
              <Label htmlFor="billing_postal_code">Postal code</Label>
              <Input
                id="billing_postal_code"
                value={billingValues.postal_code}
                onChange={(event) =>
                  updateAddressField("billing", "postal_code", event.target.value)
                }
                placeholder="Postal code"
              />
            </div>
            <Button
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={saveBillingAddress}
              disabled={isSavingAddress}
            >
              Save billing address
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="size-4 text-primary" />
              Shipping Address
            </CardTitle>
            <CardDescription>
              Leave empty to use billing details later during checkout.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="shipping_address">Address</Label>
              <Input
                id="shipping_address"
                value={shippingValues.address}
                onChange={(event) =>
                  updateAddressField("shipping", "address", event.target.value)
                }
                placeholder="House number, street, landmark"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="shipping_city">City</Label>
                <Input
                  id="shipping_city"
                  value={shippingValues.city}
                  onChange={(event) =>
                    updateAddressField("shipping", "city", event.target.value)
                  }
                  placeholder="City"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="shipping_state">State</Label>
                <Select
                  value={shippingValues.state_id}
                  onValueChange={(value) =>
                    updateAddressField("shipping", "state_id", value)
                  }
                >
                  <SelectTrigger id="shipping_state" className="w-full">
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    {(statesResponse?.states ?? []).map((state) => (
                      <SelectItem key={state.id} value={state.id}>
                        {state.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="max-w-xs space-y-2">
              <Label htmlFor="shipping_postal_code">Postal code</Label>
              <Input
                id="shipping_postal_code"
                value={shippingValues.postal_code}
                onChange={(event) =>
                  updateAddressField("shipping", "postal_code", event.target.value)
                }
                placeholder="Postal code"
              />
            </div>
            <Button
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={saveShippingAddress}
              disabled={isSavingAddress}
            >
              Save shipping address
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="size-4 text-primary" />
              Account Actions
            </CardTitle>
            <CardDescription>
              Manage your current session.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              variant="destructive"
              onClick={() => {
                logout();
                router.push("/");
              }}
            >
              <LogOut className="size-4" />
              Logout
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
