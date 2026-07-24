import { useAuthStore } from "@/store/auth.store";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

function AuthGate({ children }: { children: React.ReactNode }) {
  const { isHydrated, hydrate } = useAuthStore();

  useEffect(() => {
    hydrate();
  }, []);

  if (!isHydrated) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#071A1B" }}>
        <ActivityIndicator size="large" color="#A3E635" />
      </View>
    );
  }

  return <>{children}</>;
}

export default AuthGate;