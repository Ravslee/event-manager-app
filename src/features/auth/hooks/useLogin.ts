import { useMutation } from "@tanstack/react-query";
import { AuthApi } from "../api/auth.api";

export function useLogin() {
  return useMutation({
    mutationFn: AuthApi.login,
  });
}
