import React from "react";
import { useRouter } from "expo-router";
import { SettingsScreen } from "@/components/screens/SettingsScreen";
import { useAuth } from "@/lib/AuthContext";

export default function SettingsRoute() {
  const router = useRouter();
  const { signOut } = useAuth();

  async function handleLogout() {
    await signOut();
router.replace({ pathname: "/" as any });  }

  return (
    <SettingsScreen
      onNavigateHome={() => router.replace("/(app)/home")}
      onLogout={handleLogout}
    />
  );
}