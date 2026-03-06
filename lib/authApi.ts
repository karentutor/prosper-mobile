import { api } from "./api";
import type { AuthUser } from "./authStorage";

export type LoginResponse = {
  user: AuthUser;
  access_token: string;
};

export async function loginRequest(
  email: string,
  password: string
): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>("/auth/login", {
    email,
    password,
  });

  return response.data;
}

export async function getMe(token: string): Promise<AuthUser> {
  const response = await api.get<AuthUser>("/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}