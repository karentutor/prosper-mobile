import "../global.css";
import React from "react";
import { ActivityIndicator, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Redirect, Slot, usePathname } from "expo-router";
import { AuthProvider, useAuth } from "@/lib/AuthContext";

function AppNavigator() {
  const { isLoading, isAuthenticated } = useAuth();
  const pathname = usePathname();

  if (isLoading) {
    return (
      <SafeAreaProvider>
        <View className="flex-1 items-center justify-center bg-white">
          <ActivityIndicator />
        </View>
      </SafeAreaProvider>
    );
  }

  const inAuth = pathname === "/login" || pathname === "/register";
  const inApp = pathname === "/home";

  if (!isAuthenticated && inApp) {
    return <Redirect href="/" />;
  }

  if (isAuthenticated && (pathname === "/" || inAuth)) {
    return <Redirect href="/home" />;
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