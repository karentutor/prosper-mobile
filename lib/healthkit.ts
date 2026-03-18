import type { HealthKitPermissions, HealthValue } from "react-native-health";
import { Platform } from "react-native";

export type HeartRateSample = {
  value: number;
  startDate: string;
};

export type HealthKitStatus =
  | "unavailable"
  | "not_connected"
  | "connected"
  | "error";

function getAppleHealthKit() {
  if (Platform.OS !== "ios") {
    return null;
  }

  const mod = require("react-native-health");
  return mod.default ?? mod;
}

function getPermissions(): HealthKitPermissions {
  const AppleHealthKit = getAppleHealthKit();

  if (!AppleHealthKit) {
    throw new Error("HealthKit is only available on iOS.");
  }

  return {
    permissions: {
      read: [AppleHealthKit.Constants.Permissions.HeartRate],
      write: [],
    },
  };
}

export function isHealthKitAvailable(): boolean {
  return Platform.OS === "ios";
}

export function requestHeartRatePermission(): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      const AppleHealthKit = getAppleHealthKit();

      if (!AppleHealthKit) {
        reject(new Error("HealthKit is only available on iOS."));
        return;
      }

      const permissions = getPermissions();

      AppleHealthKit.initHealthKit(permissions, (err: unknown) => {
        if (err) {
          reject(new Error(String(err)));
          return;
        }

        resolve();
      });
    } catch (err) {
      reject(err instanceof Error ? err : new Error(String(err)));
    }
  });
}

export function fetchLatestHeartRate(): Promise<HeartRateSample | null> {
  return new Promise((resolve, reject) => {
    try {
      const AppleHealthKit = getAppleHealthKit();

      if (!AppleHealthKit) {
        reject(new Error("HealthKit is only available on iOS."));
        return;
      }

      const endDate = new Date();
      const startDate = new Date(
        endDate.getTime() - 30 * 24 * 60 * 60 * 1000
      );

      AppleHealthKit.getHeartRateSamples(
        {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          ascending: false,
          limit: 1,
        },
        (err: unknown, results: HealthValue[]) => {
          if (err) {
            reject(new Error(String(err)));
            return;
          }

          if (!results || results.length === 0) {
            resolve(null);
            return;
          }

          const latest = results[0];

          resolve({
            value: Math.round(latest.value),
            startDate: latest.startDate,
          });
        }
      );
    } catch (err) {
      reject(err instanceof Error ? err : new Error(String(err)));
    }
  });
}