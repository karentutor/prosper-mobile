// app/(app)/home.tsx
import React from "react";
import { useRouter } from "expo-router";
import { HomeScreen } from "@/components/screens/HomeScreen";
import { useAuth } from "@/lib/AuthContext";

export default function HomeRoute() {
  const router = useRouter();
  const { user, signOut } = useAuth();

  async function handleLogout() {
    await signOut();
    // no router.replace here
  }

  return (
    <HomeScreen
      email={user?.email ?? ""}
      onLogout={handleLogout}
      onNavigateSettings={() => router.push("/settings")}
    />
  );
}