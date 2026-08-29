import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import type { LoginRequest } from "../types/auth.types";
import { useLogin } from "../hooks/useLogin";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export function LoginForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { register, handleSubmit } = useForm<LoginRequest>();
  const loginMutation = useLogin();

  const from = (location.state as any)?.from?.pathname || "/dashboard";

  const onLoginSubmit = async (data: LoginRequest) => {
    try {
      setErrorMessage(null);
      const response: any = await loginMutation.mutateAsync(data);
      login(response);
      navigate(from, { replace: true });
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message ?? "Invalid credentials. Please try again.");
    }
  };


  return (
    <div className="w-full bg-card text-card-foreground p-7 sm:p-9 rounded-[32px] border border-border/80 shadow-2xl space-y-6">
      
      {/* Title & Subtitle */}
      <div className="text-center space-y-1.5">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          Welcome Back
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Log in to manage your NIVO bookings & events.
        </p>
      </div>

      {/* Error Notification Banner */}
      {errorMessage && (
        <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-2.5">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Form Controls */}
      <form className="space-y-4" onSubmit={handleSubmit(onLoginSubmit)}>
        
        {/* Email Input */}
        <div className="space-y-1">
          <Input
            type="email"
            placeholder="Username or Email"
            className="h-12 rounded-full px-6 bg-muted/30 border-border/80 text-sm font-medium focus:bg-background transition-all"
            {...register("email", { required: true })}
          />
        </div>

        {/* Password Input */}
        <div className="space-y-1.5">
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="h-12 rounded-full pl-6 pr-12 bg-muted/30 border-border/80 text-sm font-medium focus:bg-background transition-all"
              {...register("password", { required: true })}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          <div className="text-center pt-0.5">
            <button
              type="button"
              className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              Forgot Password?
            </button>
          </div>
        </div>

        {/* Main Action Button */}
        <Button
          type="submit"
          disabled={loginMutation.isPending}
          className="h-12 w-full rounded-full bg-primary hover:opacity-95 text-primary-foreground font-bold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer mt-2"
        >
          {loginMutation.isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" /> Logging in...
            </>
          ) : (
            "Log In to NIVO"
          )}
        </Button>
      </form>

      {/* Footer Sign Up Link */}
      <div className="text-center text-xs text-muted-foreground pt-2 border-t border-border/60">
        <span>Don't have an account? </span>
        <button
          type="button"
          onClick={() => navigate("/register")}
          className="font-bold text-primary hover:underline transition-all cursor-pointer"
        >
          Sign Up
        </button>
      </div>

    </div>
  );
}
