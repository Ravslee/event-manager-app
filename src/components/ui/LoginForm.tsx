import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex items-center justify-center bg-background px-8">
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-bold">Welcome back</h1>

        <p className="mt-2 text-muted-foreground">
          Access your workspace and manage your events.
        </p>

        <form className="mt-10 space-y-6">
          <div className="space-y-2">
            <Label>Email</Label>

            <Input type="email" placeholder="name@company.com" />
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

          <Button className="h-12 w-full">Login</Button>
        </form>
      </div>
    </div>
  );
}
