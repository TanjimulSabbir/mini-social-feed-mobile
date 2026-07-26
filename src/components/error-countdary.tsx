// components/error-boundary.tsx
import { Component, ReactNode } from "react";
import { Text, View } from "react-native";
import { COLORS } from "@/constants/theme";

interface Props {
  children: ReactNode;
}
interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("Caught by ErrorBoundary:", error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: COLORS.background,
            padding: 24,
          }}
        >
          <Text
            style={{
              color: COLORS.error,
              fontSize: 16,
              fontWeight: "700",
              marginBottom: 8,
            }}
          >
            Something went wrong
          </Text>
          <Text
            style={{
              color: COLORS.inactive,
              fontSize: 13,
              textAlign: "center",
            }}
          >
            {this.state.error.message}
          </Text>
        </View>
      );
    }
    return this.props.children;
  }
}
