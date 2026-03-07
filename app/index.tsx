import React from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

export default function PublicHomePage() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center px-6">
        <Text className="mb-3 text-4xl font-bold">PROSPER</Text>
        <Text className="mb-10 text-center text-base text-gray-600">
          Welcome to Prosper.
        </Text>

        <Pressable
          onPress={() => router.push("/login")}
          className="mb-4 w-full rounded-xl bg-black px-6 py-4"
        >
          <Text className="text-center font-semibold text-white">Log in</Text>
        </Pressable>

        <Pressable
          onPress={() => router.push("/register")}
          className="w-full rounded-xl border border-black px-6 py-4"
        >
          <Text className="text-center font-semibold text-black">Sign up</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}