import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "@tanstack/react-query";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { ApiError } from "@/api/client";
import { SignupFormData, signupSchema } from "@/schema/signup.schema";
import { useAuthStore } from "@/store/auth.store";
import { SignupScreenStyles } from "@/styles/signup.style";

export default function SignupScreen() {
  const router = useRouter();
  const signup = useAuthStore((s) => s.signup);
  const styles = SignupScreenStyles;

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const signupMutation = useMutation({
    mutationFn: async (data: Omit<SignupFormData, "confirmPassword">) => {
      return await signup(data);
    },
    onSuccess: () => {
      router.replace("/(tabs)/feed");
    },
  });

  // Client-side Validation
  function validate(): boolean {
    const result = signupSchema.safeParse({
      name: name.trim(),
      email: email.trim(),
      password,
      confirmPassword,
    });

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      setFieldErrors({
        name: errors.name?.[0] || "",
        email: errors.email?.[0] || "",
        password: errors.password?.[0] || "",
        confirmPassword: errors.confirmPassword?.[0] || "",
      });
      return false;
    }

    setFieldErrors({});
    return true;
  }

  function handleSubmit() {
    signupMutation.reset();
    if (!validate()) return;

    signupMutation.mutate({
      name: name.trim(),
      email: email.trim(),
      password,
    });
  }

  // Derive error message from TanStack Query state
  const formError = signupMutation.isError
    ? signupMutation.error instanceof ApiError
      ? signupMutation.error.message
      : "Signup failed. Please try again."
    : null;

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Social App Header Section */}
        <View style={styles.header}>
          <View style={styles.logoBadge}>
            <Ionicons name="sparkles" size={30} color="#A3E635" />
          </View>
          <Text style={styles.appName}>MiniSocial</Text>
          <Text style={styles.title}>Create Account ✨</Text>
          <Text style={styles.subtitle}>
            Join the community and start sharing your posts today.
          </Text>
        </View>

        {/* Card Form Container */}
        <View style={styles.card}>
          {/* API Error Banner */}
          {formError && (
            <View style={styles.bannerError}>
              <Ionicons name="alert-circle-outline" size={18} color="#F87171" />
              <Text style={styles.bannerErrorText}>{formError}</Text>
            </View>
          )}

          {/* Username Field */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Full NAME</Text>
            <View
              style={[
                styles.inputWrapper,
                fieldErrors.name ? styles.inputErrorBorder : null,
              ]}
            >
              <Ionicons
                name="person-outline"
                size={20}
                color="#64748B"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Jane Doe"
                placeholderTextColor="#64748B"
                autoCapitalize="none"
                autoCorrect={false}
                value={name}
                onChangeText={(text) => {
                  setName(text);
                  if (fieldErrors.name) {
                    setFieldErrors((prev) => ({ ...prev, name: "" }));
                  }
                }}
              />
            </View>
            {Boolean(fieldErrors.name) && (
              <Text style={styles.fieldErrorText}>{fieldErrors.name}</Text>
            )}
          </View>

          {/* Email Field */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>EMAIL ADDRESS</Text>
            <View
              style={[
                styles.inputWrapper,
                fieldErrors.email ? styles.inputErrorBorder : null,
              ]}
            >
              <Ionicons
                name="at-outline"
                size={20}
                color="#64748B"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="you@example.com"
                placeholderTextColor="#64748B"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (fieldErrors.email) {
                    setFieldErrors((prev) => ({ ...prev, email: "" }));
                  }
                }}
              />
            </View>
            {Boolean(fieldErrors.email) && (
              <Text style={styles.fieldErrorText}>{fieldErrors.email}</Text>
            )}
          </View>

          {/* Password Field */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>PASSWORD</Text>
            <View
              style={[
                styles.inputWrapper,
                fieldErrors.password ? styles.inputErrorBorder : null,
              ]}
            >
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color="#64748B"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="At least 6 characters"
                placeholderTextColor="#64748B"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (fieldErrors.password) {
                    setFieldErrors((prev) => ({ ...prev, password: "" }));
                  }
                }}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color="#64748B"
                />
              </TouchableOpacity>
            </View>
            {Boolean(fieldErrors.password) && (
              <Text style={styles.fieldErrorText}>{fieldErrors.password}</Text>
            )}
          </View>

          {/* Confirm Password Field */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>CONFIRM PASSWORD</Text>
            <View
              style={[
                styles.inputWrapper,
                fieldErrors.confirmPassword ? styles.inputErrorBorder : null,
              ]}
            >
              <Ionicons
                name="shield-checkmark-outline"
                size={20}
                color="#64748B"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Re-enter your password"
                placeholderTextColor="#64748B"
                secureTextEntry={!showPassword}
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  if (fieldErrors.confirmPassword) {
                    setFieldErrors((prev) => ({
                      ...prev,
                      confirmPassword: "",
                    }));
                  }
                }}
              />
            </View>
            {Boolean(fieldErrors.confirmPassword) && (
              <Text style={styles.fieldErrorText}>
                {fieldErrors.confirmPassword}
              </Text>
            )}
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[
              styles.submitBtn,
              signupMutation.isPending && styles.btnDisabled,
            ]}
            onPress={handleSubmit}
            disabled={signupMutation.isPending}
            activeOpacity={0.8}
          >
            {signupMutation.isPending ? (
              <ActivityIndicator color="#071A1B" size="small" />
            ) : (
              <Text style={styles.submitBtnText}>Sign Up</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Footer Link */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <Link href="/(auth)/login" style={styles.link}>
            Log in
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
