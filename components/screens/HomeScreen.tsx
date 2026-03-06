import React from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {
  email: string;
  onLogout: () => void | Promise<void>;
};

export function HomeScreen({ email, onLogout }: Props) {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center px-6">
        <Text className="mb-2 text-4xl font-bold">PROSPER</Text>
        <Text className="mb-8 text-base text-gray-600">
          Logged in as {email}
        </Text>

        <Pressable
          onPress={onLogout}
          className="rounded-xl bg-black px-6 py-4"
        >
          <Text className="font-semibold text-white">Log out</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}