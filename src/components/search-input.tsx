import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
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
  const [isFocused, setIsFocused] = useState(true);

  return (
    <View style={styles.outerContainer}>
      <View
        style={[
          styles.SearchBarcontainer,
          isFocused && styles.SearchBarcontainerFocused,
        ]}
      >
        <Ionicons
          name="search-outline"
          size={18}
          color={isFocused || value ? "#A3E635" : "#64748B"}
          style={styles.searchIcon}
        />

        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#64748B"
          style={styles.input}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
          onFocus={() => setIsFocused(true)}
        />

        {value.length > 0 && (
          <Pressable
            onPress={() => onChangeText("")}
            hitSlop={10}
            style={({ pressed }) => [
              styles.clearBtn,
              pressed && styles.clearBtnPressed,
            ]}
          >
            <Ionicons name="close-circle" size={18} color="#94A3B8" />
          </Pressable>
        )}
      </View>
    </View>
  );
}
