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
    <div className="container mx-auto max-w-7xl space-y-6 pb-24">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your account settings, preferences, and subscription.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 lg:gap-8 items-start">
        {/* Sidebar Navigation */}
        <div className="w-full md:w-64 shrink-0 bg-card border border-border/80 rounded-2xl p-2 shadow-xs">
          <nav className="flex md:flex-col gap-1 overflow-x-auto hide-scrollbar">
            <button
              onClick={() => setActiveTab("profile")}
              className={cn(
                "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer whitespace-nowrap",
                activeTab === "profile" 
                  ? "bg-primary text-primary-foreground shadow-xs" 
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <User className="h-4 w-4 shrink-0" />
              Profile & Preferences
            </button>
            <button
              onClick={() => setActiveTab("security")}
              className={cn(
                "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer whitespace-nowrap",
                activeTab === "security" 
                  ? "bg-primary text-primary-foreground shadow-xs" 
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <Shield className="h-4 w-4 shrink-0" />
              Security
            </button>
            <button
              onClick={() => setActiveTab("subscription")}
              className={cn(
                "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer whitespace-nowrap",
                activeTab === "subscription" 
                  ? "bg-primary text-primary-foreground shadow-xs" 
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <CreditCard className="h-4 w-4 shrink-0" />
              Subscription
            </button>
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 space-y-6 w-full">
          
          {/* Profile Details Tab */}
          {activeTab === "profile" && (
            <Card className="rounded-2xl border border-border/80 bg-card shadow-xs overflow-hidden">
              <form onSubmit={handleProfileSubmit(onProfileSave)}>
                <CardHeader className="p-6 sm:p-7 border-b border-border/60">
                  <CardTitle className="text-xl font-extrabold">Profile & Preferences</CardTitle>
                  <CardDescription className="text-xs sm:text-sm mt-1">
                    Update your business details, contact information, and localization settings.
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="p-6 sm:p-7 space-y-6">
                  
                  {profileMessage && (
                    <div className={cn(
                      "p-3.5 rounded-xl flex items-center gap-2.5 text-sm font-medium border",
                      profileMessage.type === "success" 
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20" 
                        : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
                    )}>
                      {profileMessage.type === "success" ? <CheckCircle2 className="h-4 w-4 shrink-0" /> : <AlertCircle className="h-4 w-4 shrink-0" />}
                      <span>{profileMessage.text}</span>
                    </div>
                  )}

                  {/* Avatar Selection */}
                  <div className="space-y-3">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Profile Avatar</Label>
                    <div className="flex flex-wrap gap-3 p-3 rounded-xl border border-border/60 bg-muted/20">
                      {AVATARS.map((avatar) => (
                        <button
                          key={avatar}
                          type="button"
                          onClick={() => setProfileValue("avatarId", avatar, { shouldDirty: true })}
                          className={cn(
                            "h-12 w-12 rounded-full border-2 transition-all cursor-pointer overflow-hidden bg-primary/10 flex items-center justify-center text-primary font-bold shadow-2xs",
                            selectedAvatar === avatar 
                              ? "border-primary ring-2 ring-primary/20 ring-offset-2 ring-offset-background scale-110" 
                              : "border-transparent hover:border-primary/50 opacity-70 hover:opacity-100"
                          )}
                        >
                          <span className="text-xs font-extrabold">{avatar.replace('avatar-', 'A')}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-xs font-semibold">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profile?.email || ""}
                        disabled
                        className="bg-muted/50 font-medium cursor-not-allowed opacity-80"
                      />
                      <p className="text-[11px] text-muted-foreground">Email cannot be changed.</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="ownerName" className="text-xs font-semibold">Owner Name</Label>
                      <Input
                        id="ownerName"
                        placeholder="e.g. Alex Morgan"
                        {...registerProfile("ownerName", { required: true })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="businessName" className="text-xs font-semibold">Business Name</Label>
                      <Input
                        id="businessName"
                        placeholder="e.g. Apex Events Studio"
                        {...registerProfile("businessName", { required: true })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-xs font-semibold">Phone Number</Label>
                      <Input
                        id="phone"
                        placeholder="+1 (555) 000-0000"
                        {...registerProfile("phone")}
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="currency" className="text-xs font-semibold">Default Currency</Label>
                      <select
                        id="currency"
                        className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm shadow-2xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer"
                        {...registerProfile("currency")}
                      >
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                        <option value="INR">INR (₹)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-4 pt-6 border-t border-border/60">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Location & Address</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="country" className="text-xs font-semibold">Country</Label>
                        <Input
                          id="country"
                          placeholder="e.g. United States"
                          {...registerProfile("country")}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="state" className="text-xs font-semibold">State / Region</Label>
                        <Input
                          id="state"
                          placeholder="e.g. California"
                          {...registerProfile("state")}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="city" className="text-xs font-semibold">City</Label>
                        <Input
                          id="city"
                          placeholder="e.g. Los Angeles"
                          {...registerProfile("city")}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="pincode" className="text-xs font-semibold">Postal / Pincode</Label>
                        <Input
                          id="pincode"
                          placeholder="e.g. 90210"
                          {...registerProfile("pincode")}
                        />
                      </div>
                    </div>
                  </div>

                </CardContent>
                <CardFooter className="border-t border-border/60 bg-muted/20 px-6 sm:px-7 py-4 rounded-b-2xl flex justify-end">
                  <Button type="submit" disabled={isSavingProfile} className="px-6 rounded-xl font-bold gap-2 cursor-pointer">
                    {isSavingProfile ? "Saving..." : (
                      <>
                        <Save className="h-4 w-4" /> Save Changes
                      </>
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <Card className="rounded-2xl border border-border/80 bg-card shadow-xs overflow-hidden">
              <form onSubmit={handleSecuritySubmit(onSecuritySave)}>
                <CardHeader className="p-6 sm:p-7 border-b border-border/60">
                  <CardTitle className="text-xl font-extrabold">Security Settings</CardTitle>
                  <CardDescription className="text-xs sm:text-sm mt-1">
                    Update your account password to ensure maximum security.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 sm:p-7 space-y-5">
                  {securityMessage && (
                    <div className={cn(
                      "p-3.5 rounded-xl flex items-center gap-2.5 text-sm font-medium border",
                      securityMessage.type === "success" 
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20" 
                        : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
                    )}>
                      {securityMessage.type === "success" ? <CheckCircle2 className="h-4 w-4 shrink-0" /> : <AlertCircle className="h-4 w-4 shrink-0" />}
                      <span>{securityMessage.text}</span>
                    </div>
                  )}

                  <div className="space-y-2 max-w-md">
                    <Label htmlFor="currentPassword" className="text-xs font-semibold">Current Password</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      placeholder="••••••••"
                      {...registerSecurity("currentPassword", { required: true })}
                    />
                  </div>
                  
                  <div className="space-y-2 max-w-md">
                    <Label htmlFor="newPassword" className="text-xs font-semibold">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      placeholder="••••••••"
                      {...registerSecurity("newPassword", { required: true, minLength: 6 })}
                    />
                  </div>
                  
                  <div className="space-y-2 max-w-md">
                    <Label htmlFor="confirmPassword" className="text-xs font-semibold">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      {...registerSecurity("confirmPassword", { required: true })}
                    />
                  </div>
                </CardContent>
                <CardFooter className="border-t border-border/60 bg-muted/20 px-6 sm:px-7 py-4 rounded-b-2xl flex justify-end">
                  <Button type="submit" disabled={isSavingSecurity} className="px-6 rounded-xl font-bold gap-2 cursor-pointer">
                    {isSavingSecurity ? "Updating..." : "Update Password"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          )}

          {/* Subscription Tab */}
          {activeTab === "subscription" && (
            <Card className="rounded-2xl border border-border/80 bg-card shadow-xs overflow-hidden">
              <CardHeader className="p-6 sm:p-7 border-b border-border/60">
                <CardTitle className="text-xl font-extrabold">Subscription Plan</CardTitle>
                <CardDescription className="text-xs sm:text-sm mt-1">
                  View your current plan details and feature allocations.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 sm:p-7">
                <div className="p-6 border border-border/80 rounded-2xl flex items-center justify-between bg-gradient-to-br from-primary/5 to-transparent">
                  <div>
                    <h3 className="text-xl font-extrabold text-foreground">
                      {profile?.subscription || "FREE"} Plan
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                      You are currently on the free tier. Essential event management features included.
                    </p>
                  </div>
                  <Button variant="outline" className="shrink-0 rounded-xl font-bold cursor-not-allowed opacity-70" disabled>
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
