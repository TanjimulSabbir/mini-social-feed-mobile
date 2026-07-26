import { Ionicons } from "@expo/vector-icons";
import { useEffect, useMemo } from "react";
import {
    Animated,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

export type ModalVariant = "success" | "error" | "info" | "confirm";

export interface AppModalAction {
  label: string;
  onPress: () => void;
  style?: "primary" | "secondary" | "destructive";
}

interface AppModalProps {
  visible: boolean;
  variant?: ModalVariant;
  title: string;
  message?: string;
  actions?: AppModalAction[];
  onRequestClose?: () => void;
  autoDismissMs?: number;
}

const VARIANT_CONFIG: Record<
  ModalVariant,
  {
    icon: keyof typeof Ionicons.glyphMap;
    color: string;
  }
> = {
  success: {
    icon: "checkmark-circle",
    color: "#A3E635",
  },
  error: {
    icon: "alert-circle",
    color: "#F87171",
  },
  info: {
    icon: "information-circle",
    color: "#60A5FA",
  },
  confirm: {
    icon: "help-circle",
    color: "#FBBF24",
  },
};

export function AppModal({
  visible,
  variant = "info",
  title,
  message,
  actions,
  onRequestClose,
  autoDismissMs,
}: AppModalProps) {
  // useMemo to create Animated.Values once without exposing refs during render
  const scale = useMemo(() => new Animated.Value(0.85), []);
  const opacity = useMemo(() => new Animated.Value(0), []);

  const { icon, color } = VARIANT_CONFIG[variant];

  useEffect(() => {
    if (!visible) return;

    scale.setValue(0.85);
    opacity.setValue(0);

    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start();

    if (!autoDismissMs || !onRequestClose) return;

    const timer = setTimeout(onRequestClose, autoDismissMs);

    return () => clearTimeout(timer);
  }, [visible, autoDismissMs, onRequestClose]);

  const modalActions = useMemo<AppModalAction[]>(() => {
    if (actions?.length) return actions;

    return [
      {
        label: "OK",
        onPress: onRequestClose ?? (() => {}),
      },
    ];
  }, [actions, onRequestClose]);

  if (!visible) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onRequestClose}
    >
      <Pressable
        style={styles.backdrop}
        onPress={autoDismissMs ? undefined : onRequestClose}
      >
        <Pressable onPress={() => {}}>
          <Animated.View
            style={[
              styles.card,
              {
                opacity,
                transform: [{ scale }],
              },
            ]}
          >
            <View
              style={[
                styles.iconBadge,
                {
                  backgroundColor: `${color}22`,
                },
              ]}
            >
              <Ionicons
                name={icon}
                size={42}
                color={color}
              />
            </View>

            <Text style={styles.title}>{title}</Text>

            {!!message && (
              <Text style={styles.message}>{message}</Text>
            )}

            <View style={styles.actions}>
              {modalActions.map((action, index) => (
                <Pressable
                  key={`${action.label}-${index}`}
                  onPress={action.onPress}
                  style={[
                    styles.button,
                    action.style === "secondary" &&
                      styles.buttonSecondary,
                    action.style === "destructive" &&
                      styles.buttonDestructive,
                  ]}
                >
                  <Text
                    style={[
                      styles.buttonText,
                      action.style === "secondary" &&
                        styles.buttonTextSecondary,
                      action.style === "destructive" &&
                        styles.buttonTextDestructive,
                    ]}
                  >
                    {action.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </Animated.View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(7,26,27,0.85)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },

  card: {
    width: "100%",
    maxWidth: 340,
    backgroundColor: "#0F2B2D",
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingVertical: 28,
    alignItems: "center",
  },

  iconBadge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#EAF5F5",
    textAlign: "center",
  },

  message: {
    marginTop: 8,
    fontSize: 15,
    color: "#8FA3A3",
    textAlign: "center",
    lineHeight: 22,
  },

  actions: {
    flexDirection: "row",
    width: "100%",
    marginTop: 24,
    gap: 12,
  },

  button: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 12,
    backgroundColor: "#A3E635",
    alignItems: "center",
  },

  buttonSecondary: {
    backgroundColor: "#1A3A3C",
  },

  buttonDestructive: {
    backgroundColor: "#F87171",
  },

  buttonText: {
    color: "#071A1B",
    fontSize: 15,
    fontWeight: "700",
  },

  buttonTextSecondary: {
    color: "#EAF5F5",
  },

  buttonTextDestructive: {
    color: "#071A1B",
  },
});