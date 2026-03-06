import React from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { loginSchema, type LoginValues } from "@/validation/auth";
import { loginRequest } from "@/lib/authApi";
import { saveAuthSession } from "@/lib/authStorage";

type Props = {
  onLoginSuccess: (email: string) => void;
  onGoToRegister: () => void;
};

export function LoginScreen({ onLoginSuccess, onGoToRegister }: Props) {
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onSubmit",
  });

  const onSubmit = async (values: LoginValues) => {
    try {
      Keyboard.dismiss();

      const emailNormalized = values.email.trim().toLowerCase();
      const result = await loginRequest(emailNormalized, values.password);

      await saveAuthSession(result.access_token, result.user);

      Alert.alert("Login Successful", `Logged in as ${result.user.email}`);
      onLoginSuccess(result.user.email);
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Login failed";

      setError("password", {
        type: "server",
        message,
      });
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        className="flex-1 bg-white"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View className="flex-1 justify-center bg-white px-6">
          <Text className="mb-2 text-3xl font-bold">Login</Text>
          <Text className="mb-8 text-gray-600">Sign in to Prosper.</Text>

          <Text className="mb-2 text-sm font-semibold">Email</Text>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className="mb-2 rounded-xl border border-gray-300 px-4 py-3"
                placeholder="you@example.com"
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                autoComplete="email"
                textContentType="emailAddress"
                returnKeyType="next"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.email?.message ? (
            <Text className="mb-4 text-red-600">{errors.email.message}</Text>
          ) : (
            <View className="mb-4" />
          )}

          <Text className="mb-2 text-sm font-semibold">Password</Text>
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className="mb-2 rounded-xl border border-gray-300 px-4 py-3"
                placeholder="••••••••"
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="password"
                textContentType="password"
                returnKeyType="done"
                onSubmitEditing={handleSubmit(onSubmit)}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.password?.message ? (
            <Text className="mb-6 text-red-600">{errors.password.message}</Text>
          ) : (
            <View className="mb-6" />
          )}

          <Pressable
            className={`items-center rounded-xl py-4 ${
              isSubmitting ? "bg-gray-400" : "bg-black"
            }`}
            disabled={isSubmitting}
            onPress={handleSubmit(onSubmit)}
          >
            <Text className="font-semibold text-white">
              {isSubmitting ? "Logging in..." : "Log in"}
            </Text>
          </Pressable>

          <View className="mt-6 flex-row justify-center">
            <Text className="text-gray-600">No account? </Text>
            <Pressable onPress={onGoToRegister}>
              <Text className="font-semibold">Sign up</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}