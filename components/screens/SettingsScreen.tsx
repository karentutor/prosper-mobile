import React from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "@/components/Header";

type Props = {
  onNavigateHome: () => void;
  onLogout: () => void;
};

export function SettingsScreen({ onNavigateHome, onLogout }: Props) {
  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <Header
        title="PROSPER"
        menuItems={[
          { label: "🏠  Home", onPress: onNavigateHome },
          { label: "⚙️  Settings", onPress: () => {} },
          { label: "Log out", onPress: onLogout, destructive: true },
        ]}
      />
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-2xl font-bold text-gray-900">Settings</Text>
        <Text className="mt-3 text-center text-sm text-gray-400">
          Settings will live here.
        </Text>
      </View>
    </SafeAreaView>
  );
}