import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react";
import type { RegisterRequest } from "../types/auth.types";
import { useRegister } from "../hooks/useRegister";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterRequest>();
  
  const registerMutation = useRegister();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<RegisterRequest> = async (data) => {
    try {
      setErrorMessage(null);
      await registerMutation.mutateAsync(data);
      navigate("/login");
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message ?? "Registration failed. Please check your information and try again.");
    }
  };

  return (
    <div className="w-full bg-card text-card-foreground p-7 sm:p-9 rounded-[32px] border border-border/80 shadow-2xl space-y-6">
      
      {/* Header */}
      <div className="text-center space-y-1.5">
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
          Create NIVO Account
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground font-medium">
          Start managing your freelance bookings & invoices today.
        </p>
      </div>

      {/* Error Alert Banner */}
      {errorMessage && (
        <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-2.5">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Registration Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        
        {/* Business / Studio Name */}
        <div className="space-y-1">
          <Label className="text-xs font-semibold text-muted-foreground ml-2">Business / Studio Name</Label>
          <Input
            placeholder="e.g. Rohan Photography / DJ Alex Studio"
            className="h-11 rounded-full px-5 bg-muted/30 border-border/80 text-sm font-medium focus:bg-background transition-all"
            {...register("businessName", { required: "Business name is required" })}
          />
          {errors.businessName && (
            <p className="text-xs font-semibold text-rose-500 ml-3 mt-1">
              {errors.businessName.message}
            </p>
          )}
        </div>

        {/* Owner Full Name */}
        <div className="space-y-1">
          <Label className="text-xs font-semibold text-muted-foreground ml-2">Owner Full Name</Label>
          <Input
            placeholder="e.g. Rohan Sharma"
            className="h-11 rounded-full px-5 bg-muted/30 border-border/80 text-sm font-medium focus:bg-background transition-all"
            {...register("ownerName", { required: "Owner name is required" })}
          />
          {errors.ownerName && (
            <p className="text-xs font-semibold text-rose-500 ml-3 mt-1">
              {errors.ownerName.message}
            </p>
          )}
        </div>

        {/* Email Address */}
        <div className="space-y-1">
          <Label className="text-xs font-semibold text-muted-foreground ml-2">Email Address</Label>
          <Input
            type="email"
            placeholder="name@example.com"
            className="h-11 rounded-full px-5 bg-muted/30 border-border/80 text-sm font-medium focus:bg-background transition-all"
            {...register("email", { required: "Email address is required" })}
          />
          {errors.email && (
            <p className="text-xs font-semibold text-rose-500 ml-3 mt-1">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-1">
          <Label className="text-xs font-semibold text-muted-foreground ml-2">Password</Label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Minimum 6 characters"
              className="h-11 rounded-full pl-5 pr-12 bg-muted/30 border-border/80 text-sm font-medium focus:bg-background transition-all"
              {...register("password", { required: "Password is required" })}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs font-semibold text-rose-500 ml-3 mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Phone Number */}
        <div className="space-y-1">
          <Label className="text-xs font-semibold text-muted-foreground ml-2">Phone Number</Label>
          <Input
            placeholder="+91 98765 43210"
            className="h-11 rounded-full px-5 bg-muted/30 border-border/80 text-sm font-medium focus:bg-background transition-all"
            {...register("phone", { required: "Phone number is required" })}
          />
          {errors.phone && (
            <p className="text-xs font-semibold text-rose-500 ml-3 mt-1">
              {errors.phone.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="h-12 w-full rounded-full bg-primary hover:opacity-95 text-primary-foreground font-bold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer mt-4"
          disabled={registerMutation.isPending}
        >
          {registerMutation.isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" /> Creating Account...
            </>
          ) : (
            "Create Account"
          )}
        </Button>
      </form>

      {/* Footer Link */}
      <div className="text-center text-xs text-muted-foreground pt-2 border-t border-border/60">
        <span>Already have an account? </span>
        <Link to="/login" className="font-bold text-primary hover:underline transition-all cursor-pointer">
          Log In instead
        </Link>
      </div>

    </div>
  );
}
