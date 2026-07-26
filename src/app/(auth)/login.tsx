import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useRouter } from "expo-router";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
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
import Toast from "react-native-toast-message";
import { z } from "zod";

import { FormInput } from "@/components/form/FormInput";
import { useLogin } from "@/hooks/useAuthMutations";
import { loginSchema } from "@/schema/login.schema";
import { LoginFormStyles } from "@/styles/login.style";
import { pushModal } from "@/hooks/modal";

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const router = useRouter();
  const loginMutation = useLogin();
  const passwordRef = useRef<TextInput>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
    mode: "onSubmit",
  });

  const onSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(
      { email: data.email.trim(), password: data.password },
      {
        onSuccess: () => {
          Toast.show({ type: "success", text1: "Login successful!" });
          router.replace("/(tabs)");
        },
        onError: (err: any) => {
          Toast.show({
            type: "error",
            text1: "Login failed",
            text2:
              err?.message ?? "Please check your credentials and try again.",
          });
        },
      },
    );
  };

  const busy = isSubmitting || loginMutation.isPending;

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
          <FormInput
            control={control}
            name="email"
            label="EMAIL"
            iconName="mail-outline"
            placeholder="tanjimul@sabbir.dev"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
            textContentType="emailAddress"
            returnKeyType="next"
            onSubmitEditing={() => passwordRef.current?.focus()}
            editable={!busy}
            styles={LoginFormStyles}
          />

          <FormInput
            control={control}
            name="password"
            label="PASSWORD"
            iconName="lock-closed-outline"
            placeholder="••••••••"
            isPassword
            showPassword={showPassword}
            onTogglePassword={() => setShowPassword((v) => !v)}
            autoComplete="password"
            textContentType="password"
            returnKeyType="done"
            onSubmitEditing={handleSubmit(onSubmit)}
            editable={!busy}
            styles={LoginFormStyles}
          />

          <TouchableOpacity
            style={[
              LoginFormStyles.submitBtn,
              busy && LoginFormStyles.btnDisabled,
            ]}
            onPress={handleSubmit(onSubmit)}
            disabled={busy}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityState={{ disabled: busy, busy }}
          >
            {busy ? (
              <ActivityIndicator color="#0A1C1C" size="small" />
            ) : (
              <Text style={LoginFormStyles.submitBtnText}>Log in</Text>
            )}
          </TouchableOpacity>
        </View>

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
