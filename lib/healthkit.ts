import AppleHealthKit, {
  HealthKitPermissions,
  HealthValue,
} from "react-native-health";
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

const PERMISSIONS: HealthKitPermissions = {
  permissions: {
    read: [AppleHealthKit.Constants.Permissions.HeartRate],
    write: [],
  },
};

export function isHealthKitAvailable(): boolean {
  return Platform.OS === "ios";
}

export function requestHeartRatePermission(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!isHealthKitAvailable()) {
      reject(new Error("HealthKit is only available on iOS."));
      return;
    }
    AppleHealthKit.initHealthKit(PERMISSIONS, (err) => {
      if (err) {
        reject(new Error(err));
      } else {
        resolve();
      }
    });
  });
}

export function fetchLatestHeartRate(): Promise<HeartRateSample | null> {
  return new Promise((resolve, reject) => {
    if (!isHealthKitAvailable()) {
      reject(new Error("HealthKit is only available on iOS."));
      return;
    }

    const options = {
      unit: "bpm" as const,
      ascending: false,
      limit: 1,
    };

    AppleHealthKit.getHeartRateSamples(options, (err, results: HealthValue[]) => {
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
    });
  });
}