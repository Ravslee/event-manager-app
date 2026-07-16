import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordField } from "./PasswordField";
import type { RegisterRequest } from "../types/auth.types";
import { useRegister } from "../hooks/useRegister";
import { useForm } from "react-hook-form";
import { type SubmitHandler } from "react-hook-form";
import {  useNavigate } from "react-router";

export function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterRequest>();
  const registerMutation = useRegister();
  const navigate = useNavigate();
  const onSubmit: SubmitHandler<RegisterRequest> = async (data) => {
    try {
      await registerMutation.mutateAsync(data);
      navigate("/login");
    } catch (error: any) {
      alert(error.response?.data?.message ?? "Registration failed");
    }
  };

  return (
    <div className="flex items-center justify-center p-8">
      <div className="w-full max-w-md">
        {/* <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          START YOUR 14 DAY FREE TRIAL
        </span> */}

        <h1 className="mt-6 text-3xl font-bold">Create your account</h1>

        <p className="mt-2 text-muted-foreground">
          No credit card required. Cancel anytime.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
          <div className="space-y-2">
            <Label>Business Name</Label>

            <Input
              placeholder="Enter your business name"
              {...register("businessName", { required: true })}
            />
            {errors.businessName && (
              <p className="mt-1 text-sm text-red-500">
                {errors.businessName.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Owner Name</Label>

            <Input
              placeholder="Enter owner's full name"
              {...register("ownerName", { required: true })}
            />

            {errors.ownerName && (
              <p className="mt-1 text-sm text-red-500">
                {errors.ownerName.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Email Address</Label>

            <Input
              type="email"
              placeholder="name@company.com"
              {...register("email", { required: true })}
            />

            {errors.email && (
              <p className="mt-1 text-sm text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          <PasswordField
            label="Password"
            placeholder="********"
            register={register}
          />

          <div className="space-y-2">
            <Label>Phone Number</Label>

            <Input
              placeholder="+91 9876543210"
              {...register("phone", { required: true })}
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-500">
                {errors.phone.message}
              </p>
            )}
          </div>

          <div className="flex items-start gap-3">
            <Checkbox id="terms" />

            <Label htmlFor="terms" className="text-sm font-normal leading-5">
              By signing up, you agree to our{" "}
              <span className="font-medium text-primary">Terms</span> and{" "}
              <span className="font-medium text-primary">Privacy Policy</span>.
            </Label>
          </div>

          <Button
            type="submit"
            className="h-11 w-full"
            disabled={registerMutation.isPending}
          >
            {registerMutation.isPending
              ? "Creating Account..."
              : "Create Account"}
          </Button>
        </form>

        <p className="mt-8 text-center text-sm">
          Already have an account?{" "}
          <a href="/login" className="font-semibold text-primary">
            Login instead
          </a>
        </p>
      </div>
    </div>
  );
}
