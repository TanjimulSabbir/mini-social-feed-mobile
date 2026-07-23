import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface CFormProps {
  children: React.ReactNode;
  onSubmit: () => void;
  submitLabel: string;
  submitting?: boolean;
  disabled?: boolean;
  formError?: string | null;
}

export function CForm({
  children,
  onSubmit,
  submitLabel,
  submitting,
  disabled,
  formError,
}: CFormProps) {
  return (
    <View>
      {children}
      {formError ? (
        <View style={styles.errorBanner}>
          <Text style={styles.errorBannerText}>{formError}</Text>
        </View>
      ) : null}
      <TouchableOpacity
        style={[styles.submit, (disabled || submitting) && styles.submitDisabled]}
        onPress={onSubmit}
        disabled={disabled || submitting}
        activeOpacity={0.8}
      >
        {submitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitText}>{submitLabel}</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  submit: {
    backgroundColor: "#4f46e5",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
  },
  submitDisabled: { opacity: 0.5 },
  submitText: { color: "#fff", fontSize: 15, fontWeight: "700" },
  errorBanner: {
    backgroundColor: "#fef2f2",
    borderColor: "#fecaca",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  errorBannerText: { color: "#b91c1c", fontSize: 13 },
});
