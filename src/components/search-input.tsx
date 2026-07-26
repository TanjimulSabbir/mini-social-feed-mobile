import { Ionicons } from "@expo/vector-icons";
import { Pressable, TextInput, View } from "react-native";

import { searchBarStyles as styles } from "@/styles/search-input.styles";

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export function SearchBar({
  value,
  onChangeText,
  placeholder = "Search posts...",
}: SearchBarProps) {
  return (
    <View style={styles.container}>
      <Ionicons name="search" size={18} color="#8FA3A3" />

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#8FA3A3"
        style={styles.input}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
      />

      {value.length > 0 && (
        <Pressable onPress={() => onChangeText("")} hitSlop={8}>
          <Ionicons name="close-circle" size={18} color="#8FA3A3" />
        </Pressable>
      )}
    </View>
  );
}