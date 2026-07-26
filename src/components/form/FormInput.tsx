import { Ionicons } from "@expo/vector-icons";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { Text, TextInput, TextInputProps, TouchableOpacity, View } from "react-native";

type FormInputStyles = {
  fieldGroup: any;
  label: any;
  inputWrapper: any;
  inputErrorBorder: any;
  inputIcon: any;
  input: any;
  fieldErrorText: any;
};

type FormInputProps<T extends FieldValues> = Omit<TextInputProps, "value" | "onChangeText"> & {
  control: Control<T>;
  name: Path<T>;
  label: string;
  iconName: keyof typeof Ionicons.glyphMap;
  isPassword?: boolean;
  showPassword?: boolean;
  onTogglePassword?: () => void;
  styles: FormInputStyles;
  inputRef?: React.Ref<TextInput>;
};

export function FormInput<T extends FieldValues>({
  control,
  name,
  label,
  iconName,
  isPassword,
  showPassword,
  onTogglePassword,
  styles,
  style,
  inputRef,
  ...inputProps
}: FormInputProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>{label}</Text>
          <View style={[styles.inputWrapper, error ? styles.inputErrorBorder : null]}>
            <Ionicons name={iconName} size={20} color="#64748B" style={styles.inputIcon} />
            <TextInput
              ref={inputRef}
              style={[styles.input, style]}
              placeholderTextColor="#64748B"
              secureTextEntry={isPassword && !showPassword}
              value={value ?? ""}
              onChangeText={onChange}
              onBlur={onBlur}
              accessibilityLabel={label}
              {...inputProps}
            />
            {isPassword && (
              <TouchableOpacity
                onPress={onTogglePassword}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                accessibilityRole="button"
                accessibilityLabel={showPassword ? "Hide password" : "Show password"}
              >
                <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#64748B" />
              </TouchableOpacity>
            )}
          </View>
          {error?.message ? <Text style={styles.fieldErrorText}>{error.message}</Text> : null}
        </View>
      )}
    />
  );
}