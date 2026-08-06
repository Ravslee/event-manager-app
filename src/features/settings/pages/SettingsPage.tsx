import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  User,
  Shield,
  CreditCard,
  Save,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import { getMyProfile, updateMyProfile, changeMyPassword } from "../api/settings.api";
import type { UserProfile, UpdateProfilePayload } from "../types/settings.types";

const AVATARS = [
  "avatar-1", "avatar-2", "avatar-3", "avatar-4",
  "avatar-5", "avatar-6", "avatar-7", "avatar-8"
];

// Fallback utility to get initials if no avatar is present
const getInitials = (name?: string) => {
  if (!name) return "U";
  return name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
};

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Profile Form State
  const { register: registerProfile, handleSubmit: handleProfileSubmit, reset: resetProfile, setValue: setProfileValue, watch: watchProfile } = useForm<UpdateProfilePayload>();
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState<{ type: "success" | "error", text: string } | null>(null);

  // Security Form State
  const { register: registerSecurity, handleSubmit: handleSecuritySubmit, reset: resetSecurity } = useForm();
  const [isSavingSecurity, setIsSavingSecurity] = useState(false);
  const [securityMessage, setSecurityMessage] = useState<{ type: "success" | "error", text: string } | null>(null);

  const selectedAvatar = watchProfile("avatarId");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const data = await getMyProfile();
      setProfile(data);
      resetProfile({
        businessName: data.businessName,
        ownerName: data.ownerName,
        phone: data.phone || "",
        avatarId: data.avatarId || "avatar-1",
        currency: data.currency || "USD",
        country: data.country || "",
        city: data.city || "",
        state: data.state || "",
        pincode: data.pincode || "",
      });
    } catch (error) {
      console.error("Failed to load profile", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onProfileSave = async (data: UpdateProfilePayload) => {
    try {
      setIsSavingProfile(true);
      setProfileMessage(null);
      await updateMyProfile(data);
      
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        const updatedUser = { ...user, ...data };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        
        // Dispatch custom event to let other components know profile updated
        window.dispatchEvent(new Event("profileUpdated"));
      }

      setProfileMessage({ type: "success", text: "Profile updated successfully." });
      await fetchProfile(); // refresh data
    } catch (error) {
      setProfileMessage({ type: "error", text: "Failed to update profile." });
      console.error("Failed to update profile", error);
    } finally {
      setIsSavingProfile(false);
      setTimeout(() => setProfileMessage(null), 5000);
    }
  };

  const onSecuritySave = async (data: any) => {
    if (data.newPassword !== data.confirmPassword) {
      setSecurityMessage({ type: "error", text: "New passwords do not match." });
      return;
    }
    
    try {
      setIsSavingSecurity(true);
      setSecurityMessage(null);
      await changeMyPassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword
      });
      setSecurityMessage({ type: "success", text: "Password changed successfully." });
      resetSecurity();
    } catch (error) {
      setSecurityMessage({ type: "error", text: "Failed to change password. Please check your current password." });
      console.error("Failed to change password", error);
    } finally {
      setIsSavingSecurity(false);
      setTimeout(() => setSecurityMessage(null), 5000);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-10 flex items-center justify-center min-h-[500px]">
        <div className="text-muted-foreground animate-pulse text-lg">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto pb-10 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your account settings, preferences, and subscription.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Navigation */}
        <div className="w-full md:w-64 shrink-0">
          <nav className="flex md:flex-col gap-1 overflow-x-auto pb-4 md:pb-0 hide-scrollbar">
            <button
              onClick={() => setActiveTab("profile")}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap",
                activeTab === "profile" 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <User className="h-4 w-4" />
              Profile & Preferences
            </button>
            <button
              onClick={() => setActiveTab("security")}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap",
                activeTab === "security" 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Shield className="h-4 w-4" />
              Security
            </button>
            <button
              onClick={() => setActiveTab("subscription")}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap",
                activeTab === "subscription" 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <CreditCard className="h-4 w-4" />
              Subscription
            </button>
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 space-y-6">
          
          {/* Profile Details Tab */}
          {activeTab === "profile" && (
            <Card className="rounded-2xl shadow-sm border-0 bg-card">
              <form onSubmit={handleProfileSubmit(onProfileSave)}>
                <CardHeader>
                  <CardTitle>Profile & Preferences</CardTitle>
                  <CardDescription>
                    Update your business details and localization settings.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  
                  {profileMessage && (
                    <div className={cn(
                      "p-3 rounded-md flex items-center gap-2 text-sm",
                      profileMessage.type === "success" ? "bg-emerald-500/10 text-emerald-600" : "bg-rose-500/10 text-rose-600"
                    )}>
                      {profileMessage.type === "success" ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                      {profileMessage.text}
                    </div>
                  )}

                  {/* Avatar Selection */}
                  <div className="space-y-3">
                    <Label>Profile Avatar</Label>
                    <div className="flex flex-wrap gap-3">
                      {AVATARS.map((avatar) => (
                        <button
                          key={avatar}
                          type="button"
                          onClick={() => setProfileValue("avatarId", avatar, { shouldDirty: true })}
                          className={cn(
                            "h-12 w-12 rounded-full border-2 transition-all overflow-hidden bg-primary/10 flex items-center justify-center text-primary font-bold",
                            selectedAvatar === avatar ? "border-primary ring-2 ring-primary/20 ring-offset-2 ring-offset-background scale-110" : "border-transparent hover:border-primary/50 opacity-70 hover:opacity-100"
                          )}
                        >
                          {/* Placeholder for actual SVG/Image. Since we are using preset IDs, we can map to a placeholder text or icon for now */}
                          <span className="text-xs uppercase">{avatar.replace('avatar-', 'A')}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profile?.email || ""}
                        disabled
                        className="bg-muted/50"
                      />
                      <p className="text-[10px] text-muted-foreground">Email cannot be changed.</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="ownerName">Owner Name</Label>
                      <Input
                        id="ownerName"
                        {...registerProfile("ownerName", { required: true })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="businessName">Business Name</Label>
                      <Input
                        id="businessName"
                        {...registerProfile("businessName", { required: true })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        {...registerProfile("phone")}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="currency">Currency</Label>
                      <select
                        id="currency"
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        {...registerProfile("currency")}
                      >
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                        <option value="INR">INR (₹)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-3 pt-4 border-t">
                    <h3 className="text-sm font-semibold">Location</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="country">Country</Label>
                        <Input
                          id="country"
                          {...registerProfile("country")}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="state">State / Region</Label>
                        <Input
                          id="state"
                          {...registerProfile("state")}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          {...registerProfile("city")}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="pincode">Postal / Pincode</Label>
                        <Input
                          id="pincode"
                          {...registerProfile("pincode")}
                        />
                      </div>
                    </div>
                  </div>

                </CardContent>
                <CardFooter className="border-t bg-muted/10 p-4 rounded-b-2xl flex justify-end">
                  <Button type="submit" disabled={isSavingProfile}>
                    {isSavingProfile ? "Saving..." : (
                      <>
                        <Save className="mr-2 h-4 w-4" /> Save Changes
                      </>
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <Card className="rounded-2xl shadow-sm border-0 bg-card">
              <form onSubmit={handleSecuritySubmit(onSecuritySave)}>
                <CardHeader>
                  <CardTitle>Security</CardTitle>
                  <CardDescription>
                    Update your password to keep your account secure.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {securityMessage && (
                    <div className={cn(
                      "p-3 rounded-md flex items-center gap-2 text-sm",
                      securityMessage.type === "success" ? "bg-emerald-500/10 text-emerald-600" : "bg-rose-500/10 text-rose-600"
                    )}>
                      {securityMessage.type === "success" ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                      {securityMessage.text}
                    </div>
                  )}

                  <div className="space-y-2 max-w-md">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      {...registerSecurity("currentPassword", { required: true })}
                    />
                  </div>
                  
                  <div className="space-y-2 max-w-md">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      {...registerSecurity("newPassword", { required: true, minLength: 6 })}
                    />
                  </div>
                  
                  <div className="space-y-2 max-w-md">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      {...registerSecurity("confirmPassword", { required: true })}
                    />
                  </div>
                </CardContent>
                <CardFooter className="border-t bg-muted/10 p-4 rounded-b-2xl flex justify-end">
                  <Button type="submit" disabled={isSavingSecurity}>
                    {isSavingSecurity ? "Updating..." : "Update Password"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          )}

          {/* Subscription Tab */}
          {activeTab === "subscription" && (
            <Card className="rounded-2xl shadow-sm border-0 bg-card">
              <CardHeader>
                <CardTitle>Subscription Plan</CardTitle>
                <CardDescription>
                  View your current plan and usage.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-6 border rounded-xl flex items-center justify-between bg-gradient-to-br from-primary/5 to-transparent">
                  <div>
                    <h3 className="text-xl font-bold text-foreground">
                      {profile?.subscription || "FREE"} Plan
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      You are currently on the free tier. Basic features included.
                    </p>
                  </div>
                  <Button variant="outline" className="shrink-0" disabled>
                    Upgrade Plan
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

        </div>
      </div>
    </div>
  );
}
