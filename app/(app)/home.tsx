import React from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { HomeScreen } from "@/components/screens/HomeScreen";
import { clearAuthSession } from "@/lib/authStorage";

export default function HomeRoute() {
  const router = useRouter();
  const params = useLocalSearchParams<{ email?: string }>();

  const email =
    typeof params.email === "string" && params.email.length > 0
      ? params.email
      : "test@test.com";

  async function handleLogout() {
    await clearAuthSession();
    router.replace("/");
  }

  return <HomeScreen email={email} onLogout={handleLogout} />;
}