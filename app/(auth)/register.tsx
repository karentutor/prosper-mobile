import React from "react";
import { useRouter } from "expo-router";
import { RegisterScreen } from "@/components/screens/RegisterScreen";

export default function RegisterRoute() {
  const router = useRouter();

  return (
    <RegisterScreen
      onRegisterSuccess={() => {
        // After registering, send them back to login
        router.replace("/");
      }}
      onGoToLogin={() => {
        router.replace("/");
      }}
    />
  );
}