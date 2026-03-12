import * as SecureStore from "expo-secure-store";

export type AuthUser = {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
};

const TOKEN_KEY = "prosper_access_token";
const USER_KEY = "prosper_user";

export async function saveAuthSession(
  token: string,
  user: AuthUser
): Promise<void> {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
  await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
}

export async function getAccessToken(): Promise<string | null> {
  return SecureStore.getItemAsync(TOKEN_KEY);
}

export async function getStoredUser(): Promise<AuthUser | null> {
  const raw = await SecureStore.getItemAsync(USER_KEY);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export async function clearAuthSession(): Promise<void> {
  await Promise.allSettled([
    SecureStore.deleteItemAsync(TOKEN_KEY),
    SecureStore.deleteItemAsync(USER_KEY),
  ]);
}