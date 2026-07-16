import { useMutation } from "@tanstack/react-query";
import { AuthApi } from "../api/auth.api";

export function useRegister() {
  return useMutation({
    mutationFn: AuthApi.register,
  });
}
