import React from "react";
import { useRouter } from "expo-router";
import { LoginScreen } from "@/components/screens/LoginScreen";

export default function Index() {
  const router = useRouter();

  return (
    <LoginScreen
      onLoginSuccess={(email) => {
        router.replace({ pathname: "/home", params: { email } });
      }}
      onGoToRegister={() => {
        router.push("/register");
      }}
    />
  );
}