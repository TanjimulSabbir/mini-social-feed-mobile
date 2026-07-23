import React from "react";
import { StyleSheet, Text, TextInput, TextInputProps, View } from "react-native";

interface CTextareaProps extends TextInputProps {
  label?: string;
  error?: string;
  maxLength?: number;
}

export function CTextarea({ label, error, maxLength = 280, value, style, ...rest }: CTextareaProps) {
  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        style={[styles.input, error ? styles.inputError : null, style]}
        placeholderTextColor="#9aa0a6"
        multiline
        maxLength={maxLength}
        value={value}
        {...rest}
      />
      <View style={styles.footer}>
        {error ? <Text style={styles.error}>{error}</Text> : <View />}
        <Text style={styles.counter}>
          {(value?.length ?? 0)}/{maxLength}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 12 },
  label: { fontSize: 13, fontWeight: "600", marginBottom: 6, color: "#374151" },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: "top",
    backgroundColor: "#fff",
    color: "#111827",
  },
  inputError: { borderColor: "#ef4444" },
  footer: { flexDirection: "row", justifyContent: "space-between", marginTop: 4 },
  error: { color: "#ef4444", fontSize: 12 },
  counter: { color: "#9ca3af", fontSize: 12, marginLeft: "auto" },
});
