import { useAuthStore } from "@/store/auth.store";
import { profileStyles as styles } from "@/styles/profile.styles";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarWrapper}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{userInitial}</Text>
            </View>
            <View style={styles.onlineBadge} />
          </View>

          <Text style={styles.userName}>{user?.name || "User Name"}</Text>
          <View style={styles.emailContainer}>
            <Ionicons name="mail-outline" size={14} color="#64748B" />
            <Text style={styles.userEmail}>{user?.email || "user@example.com"}</Text>
          </View>

          <View style={styles.proBadge}>
            <Ionicons name="sparkles" size={12} color="#A3E635" />
            <Text style={styles.proBadgeText}>Pro Member</Text>
          </View>
        </View>

        {/* Options List */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Account Settings</Text>

          <Pressable style={({ pressed }) => [styles.menuItem, pressed && styles.menuItemPressed]}>
            <View style={styles.menuLeft}>
              <View style={[styles.iconBox, { backgroundColor: "rgba(56, 189, 248, 0.12)" }]}>
                <Ionicons name="person-outline" size={20} color="#38BDF8" />
              </View>
              <Text style={styles.menuText}>Edit Profile</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#64748B" />
          </Pressable>

          <Pressable style={({ pressed }) => [styles.menuItem, pressed && styles.menuItemPressed]}>
            <View style={styles.menuLeft}>
              <View style={[styles.iconBox, { backgroundColor: "rgba(167, 139, 250, 0.12)" }]}>
                <Ionicons name="notifications-outline" size={20} color="#A78BFA" />
              </View>
              <Text style={styles.menuText}>Notifications</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#64748B" />
          </Pressable>

          <Pressable style={({ pressed }) => [styles.menuItem, pressed && styles.menuItemPressed]}>
            <View style={styles.menuLeft}>
              <View style={[styles.iconBox, { backgroundColor: "rgba(52, 211, 153, 0.12)" }]}>
                <Ionicons name="shield-checkmark-outline" size={20} color="#34D399" />
              </View>
              <Text style={styles.menuText}>Privacy & Security</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#64748B" />
          </Pressable>
        </View>

        <Pressable
          onPress={logout}
          style={({ pressed }) => [styles.logoutBtn, pressed && styles.logoutBtnPressed]}
        >
          <Ionicons name="log-out-outline" size={20} color="#F87171" />
          <Text style={styles.logoutBtnText}>Log Out</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}