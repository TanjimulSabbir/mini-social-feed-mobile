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
  View,
} from "react-native";

import { useLogin } from "@/hooks/useAuthMutations";
import { loginSchema } from "@/schema/login.schema";
import { LoginFormStyles } from "@/styles/login.style";
import Toast from "react-native-toast-message";
import { validateForm } from "@/utils/validate.form";

export default function LoginScreen() {
  const router = useRouter();
  const loginMutation = useLogin();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );

  function handleSubmit() {
    const validate = validateForm(loginSchema, { email, password });
    if (!validate.valid) setErrors(validate.errors);
    loginMutation.mutate(
      { email: email.trim(), password },
      {
        onSuccess: () => {
          Toast.show({
            type: "success",
            text1: "Login successful!",
          });
          router.replace("/(tabs)");
        },
      },
    );
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

        <View style={LoginFormStyles.card}>
          {/* Email Field */}
          <View style={LoginFormStyles.fieldGroup}>
            <Text style={LoginFormStyles.label}>EMAIL</Text>
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
                placeholder="you@example.com"
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

          {/* Password Field — now a sibling, not nested inside the email fieldGroup */}
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
              <Text style={LoginFormStyles.fieldErrorText}>
                {errors.password}
              </Text>
            )}
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[
              LoginFormStyles.submitBtn,
              loginMutation.isPending && LoginFormStyles.btnDisabled,
            ]}
            onPress={handleSubmit}
            disabled={loginMutation.isPending}
            activeOpacity={0.8}
          >
            {loginMutation.isPending ? (
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
