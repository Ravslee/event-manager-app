import { useFormContext } from "react-hook-form";
import { User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ClientInformationStep() {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 border-b pb-4">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
          <User className="h-3.5 w-3.5" />
        </span>
        <h2 className="text-lg font-semibold text-foreground">Client Information</h2>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="clientName">Client Name</Label>
          <Input
            id="clientName"
            placeholder="Full name or company"
            className="h-10"
            {...register("client.name")}
          />
          {errors.client && (errors.client as any).name && (
            <p className="text-xs text-destructive">{(errors.client as any).name.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="clientEmail">Email Address</Label>
            <Input
              id="clientEmail"
              type="email"
              placeholder="client@example.com"
              className="h-10"
              {...register("client.email")}
            />
            {errors.client && (errors.client as any).email && (
              <p className="text-xs text-destructive">{(errors.client as any).email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="clientPhone">Phone Number</Label>
            <Input
              id="clientPhone"
              placeholder="+1 (555) 000-0000"
              className="h-10"
              {...register("client.phone")}
            />
            {errors.client && (errors.client as any).phone && (
              <p className="text-xs text-destructive">{(errors.client as any).phone.message}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}