import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import type { LoginRequest } from "../types/auth.types";
import { useLogin } from "../hooks/useLogin";
import { useState } from "react";
import { useNavigate } from "react-router";

export function LoginForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit } = useForm<LoginRequest>(); // Placeholder for form handling logic

  const loginMutation = useLogin(); // Assuming you have a useLogin hook similar to useRegister

  const onLoginSubmit = async (data: LoginRequest) => {
    try {
      const response: any = await loginMutation.mutateAsync(data);
      localStorage.setItem("accessToken", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      navigate("/dashboard"); // Navigate to the dashboard or desired page after successful login
    } catch (error: any) {
      alert(error.response?.data?.message ?? "Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center bg-background px-8">
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-bold">Welcome back</h1>

        <p className="mt-2 text-muted-foreground">
          Access your workspace and manage your events.
        </p>

        <form
          className="mt-10 space-y-6"
          onSubmit={handleSubmit(onLoginSubmit)}
        >
          <div className="space-y-2">
            <Label>Email</Label>

            <Input
              type="email"
              placeholder="name@company.com"
              {...register("email", { required: true })}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Password</Label>

              <button type="button" className="text-sm text-primary">
                Forgot Password?
              </button>
            </div>

            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                {...register("password", { required: true })}
              />

              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Checkbox />

            <Label>Remember me for 30 days</Label>
          </div>

          <Button
            type="submit"
            className="h-12 w-full"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? "Logging in..." : "Log In"}
          </Button>
        </form>
      </div>
    </div>
  );
}
