import React, { useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import {
  fetchLatestHeartRate,
  HeartRateSample,
  isHealthKitAvailable,
  requestHeartRatePermission,
} from "@/lib/healthkit";

type CardState =
  | { phase: "not_connected" }
  | { phase: "connecting" }
  | { phase: "fetching" }
  | { phase: "connected"; sample: HeartRateSample | null }
  | { phase: "error"; message: string };

function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString([], { month: "short", day: "numeric" });
}

export function HealthCard() {
  const [state, setState] = useState<CardState>({ phase: "not_connected" });
  const available = isHealthKitAvailable();

  async function handleConnect() {
    setState({ phase: "connecting" });
    try {
      await requestHeartRatePermission();
      setState({ phase: "connected", sample: null });
    } catch (e: unknown) {
      setState({ phase: "error", message: String(e) });
    }
  }

  async function handleFetch() {
    setState({ phase: "fetching" });
    try {
      const sample = await fetchLatestHeartRate();
      setState({ phase: "connected", sample });
    } catch (e: unknown) {
      setState({ phase: "error", message: String(e) });
    }
  }

  if (!available) {
    return (
      <View className="mx-6 mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-5">
        <Text className="text-base font-semibold text-gray-400">Apple Health</Text>
        <Text className="mt-1 text-sm text-gray-400">HealthKit is only available on iOS.</Text>
      </View>
    );
  }

  return (
    <View className="mx-6 mt-6 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <View className="mb-4 flex-row items-center gap-2">
        <Text className="text-xl">❤️</Text>
        <Text className="text-base font-semibold text-gray-900">Apple Health</Text>
      </View>

      {state.phase === "not_connected" && (
        <>
          <Text className="mb-4 text-sm text-gray-500">
            Connect Apple Health to read your heart rate data.
          </Text>
          <Pressable onPress={handleConnect} className="items-center rounded-xl bg-red-500 py-3">
            <Text className="font-semibold text-white">Connect Apple Health</Text>
          </Pressable>
        </>
      )}

      {(state.phase === "connecting" || state.phase === "fetching") && (
        <View className="items-center py-4">
          <ActivityIndicator size="small" color="#ef4444" />
          <Text className="mt-2 text-sm text-gray-400">
            {state.phase === "connecting" ? "Requesting permission…" : "Reading heart rate…"}
          </Text>
        </View>
      )}

      {state.phase === "connected" && (
        <>
          {state.sample ? (
            <View className="mb-4 items-center rounded-xl bg-red-50 py-5">
              <Text className="text-5xl font-bold text-red-500">{state.sample.value}</Text>
              <Text className="mt-1 text-sm font-medium text-red-400">bpm</Text>
              <Text className="mt-2 text-xs text-gray-400">
                {formatDate(state.sample.startDate)} at {formatTime(state.sample.startDate)}
              </Text>
            </View>
          ) : (
            <View className="mb-4 rounded-xl bg-gray-50 px-4 py-5">
              <Text className="text-center text-sm text-gray-400">
                No heart rate data found.{"\n"}Make sure heart-rate tracking is enabled on your Apple Watch.
              </Text>
            </View>
          )}
          <Pressable onPress={handleFetch} className="items-center rounded-xl border border-red-200 bg-red-50 py-3">
            <Text className="font-semibold text-red-500">Fetch latest heart rate</Text>
          </Pressable>
        </>
      )}

      {state.phase === "error" && (
        <>
          <View className="mb-4 rounded-xl bg-yellow-50 px-4 py-4">
            <Text className="text-sm font-medium text-yellow-800">Error</Text>
            <Text className="mt-1 text-xs text-yellow-700">{state.message}</Text>
          </View>
          <Pressable onPress={() => setState({ phase: "not_connected" })} className="items-center rounded-xl bg-gray-100 py-3">
            <Text className="font-semibold text-gray-600">Try again</Text>
          </Pressable>
        </>
      )}
    </View>
  );
}