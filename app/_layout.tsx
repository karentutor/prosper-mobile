import "../global.css";
import React, { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Slot, usePathname, useRouter } from "expo-router";
import { AuthProvider, useAuth } from "@/lib/AuthContext";

function AppNavigator() {
  const router = useRouter();
  const pathname = usePathname();
  const { isLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    const inAuth = pathname === "/login" || pathname === "/register";
    const inApp = pathname === "/home";

    if (!isAuthenticated && inApp) {
      router.replace("/");
      return;
    }

    if (isAuthenticated && (pathname === "/" || inAuth)) {
      router.replace("/home");
    }
  }, [isLoading, isAuthenticated, pathname, router]);

  if (isLoading) {
    return (
      <SafeAreaProvider>
        <View className="flex-1 items-center justify-center bg-white">
          <ActivityIndicator />
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <Slot />
    </SafeAreaProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}