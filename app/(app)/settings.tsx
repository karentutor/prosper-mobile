// app/(app)/settings.tsx
import React from "react";
import { useRouter } from "expo-router";
import { SettingsScreen } from "@/components/screens/SettingsScreen";
import { useAuth } from "@/lib/AuthContext";

export default function SettingsRoute() {
  const router = useRouter();
  const { signOut } = useAuth();

  async function handleLogout() {
    await signOut();
    // no router.replace here
  }

  return (
    <SettingsScreen
      onNavigateHome={() => router.replace("/home")}
      onLogout={handleLogout}
    />
  );
}