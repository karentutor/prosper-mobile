import React from "react";
import {
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
import { registerRequest } from "@/lib/authApi";
import { useAuth } from "@/lib/AuthContext";

type Props = {
  onRegisterSuccess: () => void;
  onGoToLogin: () => void;
};

export function RegisterScreen({ onRegisterSuccess, onGoToLogin }: Props) {
  const { signIn } = useAuth();

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onSubmit",
  });

  const onSubmit = async (values: RegisterValues) => {
    try {
      Keyboard.dismiss();

      const result = await registerRequest({
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        email: values.email.trim().toLowerCase(),
        password: values.password,
      });

      await signIn(result.access_token, result.user);
      onRegisterSuccess();
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Registration failed";

      setError("email", {
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
          <Text className="mb-2 text-3xl font-bold">Sign up</Text>
          <Text className="mb-8 text-gray-600">
            Create your Prosper account.
          </Text>

          <Text className="mb-2 text-sm font-semibold">First name</Text>
          <Controller
            control={control}
            name="firstName"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className="mb-2 rounded-xl border border-gray-300 px-4 py-3"
                placeholder="First name"
                autoCapitalize="words"
                autoCorrect={false}
                textContentType="givenName"
                returnKeyType="next"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.firstName?.message ? (
            <Text className="mb-4 text-red-600">{errors.firstName.message}</Text>
          ) : (
            <View className="mb-4" />
          )}

          <Text className="mb-2 text-sm font-semibold">Last name</Text>
          <Controller
            control={control}
            name="lastName"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className="mb-2 rounded-xl border border-gray-300 px-4 py-3"
                placeholder="Last name"
                autoCapitalize="words"
                autoCorrect={false}
                textContentType="familyName"
                returnKeyType="next"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.lastName?.message ? (
            <Text className="mb-4 text-red-600">{errors.lastName.message}</Text>
          ) : (
            <View className="mb-4" />
          )}

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