import { Ionicons } from "@expo/vector-icons";
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
  View
} from "react-native";

import { useAuthStore } from "@/store/auth.store";
import { LoginFormStyles } from "@/styles/login.style";
import { loginSchema } from "@/schema/login.schema";



export default function LoginScreen() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function validate() {
    const result = loginSchema.safeParse({ email: email.trim(), password });

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors({
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
      });
      return false;
    }

    setErrors({});
    return true;
  }

  async function handleSubmit() {
    setFormError(null);
    if (!validate()) return;

    setSubmitting(true);
    try {
      const user = await login({ email: email.trim(), password });
      console.log(user, "login result");
      router.replace("/(tabs)");
    } catch (err) {
      setFormError(
        err instanceof Error
          ? err.message
          : "Login failed. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={LoginFormStyles.flex}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={LoginFormStyles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={LoginFormStyles.header}>
          <View style={LoginFormStyles.logoBadge}>
            <Ionicons name="chatbubbles" size={30} color="#A3E635" />
          </View>
          <Text style={LoginFormStyles.appName}>MiniSocial</Text>
          <Text style={LoginFormStyles.title}>Welcome Back 👋</Text>
          <Text style={LoginFormStyles.subtitle}>
            Log in to catch up with your feed, friends, and trending posts.
          </Text>
        </View>

        {/* Card Form Container - Pure style, no Tailwind */}
        <View style={LoginFormStyles.card}>
          {formError && (
            <View style={LoginFormStyles.bannerError}>
              <Ionicons name="alert-circle-outline" size={18} color="#F87171" />
              <Text style={LoginFormStyles.bannerErrorText}>{formError}</Text>
            </View>
          )}

          {/* Email Field */}
          <View style={LoginFormStyles.fieldGroup}>
            <Text style={LoginFormStyles.label}>TRANSACTION EMAIL</Text>
            <View
              style={[
                LoginFormStyles.inputWrapper,
                errors.email ? LoginFormStyles.inputErrorBorder : null,
              ]}
            >
              <Ionicons
                name="mail-outline"
                size={20}
                color="#64748B"
                style={LoginFormStyles.inputIcon}
              />
              <TextInput
                style={LoginFormStyles.input}
                placeholder="broker@yaytrack.com"
                placeholderTextColor="#64748B"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (errors.email)
                    setErrors((prev) => ({ ...prev, email: undefined }));
                }}
              />
            </View>
            {errors.email && (
              <Text style={LoginFormStyles.fieldErrorText}>{errors.email}</Text>
            )}
          </View>

          {/* Password Field */}
          <View style={LoginFormStyles.fieldGroup}>
            <Text style={LoginFormStyles.label}>PASSWORD</Text>
            <View
              style={[
                LoginFormStyles.inputWrapper,
                errors.password ? LoginFormStyles.inputErrorBorder : null,
              ]}
            >
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color="#64748B"
                style={LoginFormStyles.inputIcon}
              />
              <TextInput
                style={LoginFormStyles.input}
                placeholder="••••••••"
                placeholderTextColor="#64748B"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (errors.password)
                    setErrors((prev) => ({ ...prev, password: undefined }));
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
            {errors.password && (
              <Text style={LoginFormStyles.fieldErrorText}>{errors.password}</Text>
            )}
          </View>

          {/* Submit Button - Now uses the Lime-Green Accent */}
          <TouchableOpacity
            style={[LoginFormStyles.submitBtn, submitting && LoginFormStyles.btnDisabled]}
            onPress={handleSubmit}
            disabled={submitting}
            activeOpacity={0.8}
          >
            {submitting ? (
              <ActivityIndicator color="#0A1C1C" size="small" />
            ) : (
              <Text style={LoginFormStyles.submitBtnText}>Log in</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Footer Link */}
        <View style={LoginFormStyles.footer}>
          <Text style={LoginFormStyles.footerText}>New to the platform? </Text>
          <Link href="/(auth)/signup" style={LoginFormStyles.link}>
           Create account
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

