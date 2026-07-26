import { QueryClientProvider } from "@tanstack/react-query";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { GlobalModal } from "@/components/global-modal";
import { queryClient } from "@/lib/query-client";
import AuthGate from "@/utils/auth-gate";
import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <AuthGate>
          <StatusBar style="light" />
          <Slot />
        </AuthGate>
        <GlobalModal />
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
