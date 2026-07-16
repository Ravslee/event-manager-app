import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props {
  label: string;
  placeholder?: string;
  register: any; // Adjust the type based on your form library (e.g., react-hook-form)
}

export function PasswordField({ label, placeholder, register }: Props) {
  const [show, setShow] = useState(false);

  return (
    <div className="space-y-2">
      <Label>{label}</Label>

      <div className="relative">
        <Input
          type={show ? "text" : "password"}
          placeholder={placeholder}
          {...register("password", { required: true })}
        />

        <button
          type="button"
          className="absolute right-3 top-1/2 -translate-y-1/2"
          onClick={() => setShow(!show)}
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>

      <p className="text-xs text-muted-foreground">
        Must be at least 8 characters.
      </p>
    </div>
  );
}
