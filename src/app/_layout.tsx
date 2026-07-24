import { QueryClientProvider } from "@tanstack/react-query";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { queryClient } from "@/lib/query-client";
import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import AuthGate from "@/utils/auth-gate";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <AuthGate>
          <StatusBar style="auto" />
          <Slot />
        </AuthGate>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
