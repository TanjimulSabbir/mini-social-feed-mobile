import { QueryClientProvider } from "@tanstack/react-query";
import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

import { GlobalModal } from "@/components/global-modal";
import { queryClient } from "@/lib/query-client";
import AuthGate from "@/utils/auth-gate";
import { View } from "react-native";
import { COLORS } from "@/constants/theme";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <View style={{ flex: 1, backgroundColor: COLORS.background }}>
          <AuthGate>
            <StatusBar style="light" />
            <Slot />
            <GlobalModal />
            <Toast />
          </AuthGate>
        </View>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
