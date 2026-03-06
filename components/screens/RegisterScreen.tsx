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

import { registerSchema, type RegisterValues } from "@/validation/auth";
import { getMockCredentials, setMockCredentials } from "@/lib/mockAuth";

type Props = {
  onRegisterSuccess: (email: string) => void;
  onGoToLogin: () => void;
};

export function RegisterScreen({ onRegisterSuccess, onGoToLogin }: Props) {
  const initial = getMockCredentials();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onSubmit",
  });

  const onSubmit = (values: RegisterValues) => {
    Keyboard.dismiss();

    const emailNormalized = values.email.trim().toLowerCase();

    setMockCredentials(emailNormalized, values.password);

    Alert.alert(
      "Success (mock)",
      `Registered ${emailNormalized}.\nNow go log in with the same credentials.`
    );

    onRegisterSuccess(emailNormalized);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        className="flex-1 bg-white"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View className="flex-1 justify-center bg-white px-6">
          <Text className="mb-2 text-3xl font-bold">Sign up</Text>
          <Text className="mb-8 text-gray-600">
            Mock only — this does not hit the server yet.
          </Text>

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
                textContentType="newPassword"
                returnKeyType="next"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.password?.message ? (
            <Text className="mb-4 text-red-600">{errors.password.message}</Text>
          ) : (
            <View className="mb-4" />
          )}

          <Text className="mb-2 text-sm font-semibold">Confirm password</Text>
          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className="mb-2 rounded-xl border border-gray-300 px-4 py-3"
                placeholder="••••••••"
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="newPassword"
                returnKeyType="done"
                onSubmitEditing={handleSubmit(onSubmit)}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.confirmPassword?.message ? (
            <Text className="mb-6 text-red-600">
              {errors.confirmPassword.message}
            </Text>
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
              {isSubmitting ? "Creating..." : "Create account"}
            </Text>
          </Pressable>

          <View className="mt-6 flex-row justify-center">
            <Text className="text-gray-600">Already have an account? </Text>
            <Pressable onPress={onGoToLogin}>
              <Text className="font-semibold">Log in</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}