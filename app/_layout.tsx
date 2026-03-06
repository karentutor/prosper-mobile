import "../global.css";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Slot, useRouter, useSegments } from "expo-router";
import { getAccessToken } from "@/lib/authStorage";

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();

  const [isReady, setIsReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function bootstrap() {
      try {
        const token = await getAccessToken();

        if (!isMounted) return;

        setIsAuthenticated(!!token);
      } finally {
        if (isMounted) {
          setIsReady(true);
        }
      }
    }

    bootstrap();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!isReady || isAuthenticated === null) {
      return;
    }

    const inAuthGroup = segments[0] === "(auth)";
    const inAppGroup = segments[0] === "(app)";

    if (!isAuthenticated && inAppGroup) {
      router.replace("/");
      return;
    }

    if (isAuthenticated && inAuthGroup) {
      router.replace("/home");
    }
  }, [isReady, isAuthenticated, segments, router]);

  if (!isReady) {
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