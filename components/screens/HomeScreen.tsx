import React from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { HealthCard } from "@/components/cards/HealthCard";
import { Header } from "@/components/Header";

type Props = {
  email: string;
  onLogout: () => void | Promise<void>;
  onNavigateSettings: () => void;
};

export function HomeScreen({ email, onLogout, onNavigateSettings }: Props) {
  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <Header
        title="PROSPER"
        menuItems={[
          { label: "🏠  Home", onPress: () => {} },
          { label: "⚙️  Settings", onPress: onNavigateSettings },
          { label: "Log out", onPress: onLogout, destructive: true },
        ]}
      />
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View className="items-center px-6 pt-8">
          <Text className="text-sm text-gray-500">
            {email ? `Logged in as ${email}` : "Logged in"}
          </Text>
        </View>
        <HealthCard />
      </ScrollView>
    </SafeAreaView>
  );
}