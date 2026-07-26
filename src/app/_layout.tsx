import * as SystemUI from "expo-system-ui";

import { QueryClientProvider } from "@tanstack/react-query";
import { Slot } from "expo-router";

import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

import { GlobalModal } from "@/components/global-modal";
import { queryClient } from "@/lib/query-client";
import AuthGate from "@/utils/auth-gate";
import { ErrorBoundary } from "@/components/error-countdary";
import { COLORS } from "@/constants/theme";

SystemUI.setBackgroundColorAsync(COLORS.background);
export default function RootLayout() {
  return (
    <ErrorBoundary>
      <SafeAreaProvider style={{ flex: 1, backgroundColor: COLORS.background }}>
        <QueryClientProvider client={queryClient}>
          <AuthGate>
            <StatusBar style="light" />
            <Slot />
          </AuthGate>
          <GlobalModal />
          <Toast />
        </QueryClientProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}
