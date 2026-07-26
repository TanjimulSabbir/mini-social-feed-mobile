import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useRouter } from "expo-router";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
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

import { FormInput } from "@/components/form/FormInput";
import { SignupFormData, signupSchema } from "@/schema/signup.schema";
import { useAuthStore } from "@/store/auth.store";
import { SignupScreenStyles as styles } from "@/styles/signup.style";

export default function SignupScreen() {
  const router = useRouter();
  const signup = useAuthStore((s) => s.signup);
  const passwordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
    mode: "onSubmit",
  });

  const signupMutation = useMutation({
    mutationFn: async (data: Omit<SignupFormData, "confirmPassword">) => {
      return await signup(data);
    },
    onSuccess: () => {
      router.replace("/(tabs)");
    },
  });

  const onSubmit = (data: SignupFormData) => {
    signupMutation.reset();
    signupMutation.mutate({
      name: data.name.trim(),
      email: data.email.trim(),
      password: data.password,
    });
  };

  const formError = signupMutation.isError
    ? signupMutation.error instanceof Error
      ? signupMutation.error.message
      : "Signup failed. Please try again."
    : null;

  const busy = isSubmitting || signupMutation.isPending;

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

        <View style={styles.card}>
          {formError && (
            <View style={styles.bannerError}>
              <Ionicons name="alert-circle-outline" size={18} color="#F87171" />
              <Text style={styles.bannerErrorText}>{formError}</Text>
            </View>
          )}

          <FormInput
            control={control}
            name="name"
            label="FULL NAME"
            iconName="person-outline"
            placeholder="Jane Doe"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="name"
            textContentType="name"
            returnKeyType="next"
            onSubmitEditing={() => passwordRef.current?.focus()}
            editable={!busy}
            styles={styles}
          />

          <FormInput
            control={control}
            name="email"
            label="EMAIL ADDRESS"
            iconName="at-outline"
            placeholder="you@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
            textContentType="emailAddress"
            returnKeyType="next"
            onSubmitEditing={() => passwordRef.current?.focus()}
            editable={!busy}
            styles={styles}
          />

          <FormInput
            control={control}
            name="password"
            label="PASSWORD"
            iconName="lock-closed-outline"
            placeholder="At least 6 characters"
            isPassword
            showPassword={showPassword}
            onTogglePassword={() => setShowPassword((v) => !v)}
            inputRef={passwordRef}
            autoComplete="password-new"
            textContentType="newPassword"
            returnKeyType="next"
            onSubmitEditing={() => confirmPasswordRef.current?.focus()}
            editable={!busy}
            styles={styles}
          />

          <FormInput
            control={control}
            name="confirmPassword"
            label="CONFIRM PASSWORD"
            iconName="shield-checkmark-outline"
            placeholder="Re-enter your password"
            isPassword
            showPassword={showPassword}
            onTogglePassword={() => setShowPassword((v) => !v)}
            inputRef={confirmPasswordRef}
            autoComplete="password-new"
            textContentType="newPassword"
            returnKeyType="done"
            onSubmitEditing={handleSubmit(onSubmit)}
            editable={!busy}
            styles={styles}
          />

          <TouchableOpacity
            style={[styles.submitBtn, busy && styles.btnDisabled]}
            onPress={handleSubmit(onSubmit)}
            disabled={busy}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityState={{ disabled: busy, busy }}
          >
            {busy ? (
              <ActivityIndicator color="#071A1B" size="small" />
            ) : (
              <Text style={styles.submitBtnText}>Sign Up</Text>
            )}
          </TouchableOpacity>
        </View>

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
