import React from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/store/auth.store';
// Using standard Vector Icons
import { Ionicons } from '@expo/vector-icons'; 
import { StatusBar } from 'expo-status-bar';

export default function ProfileScreen() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* Profile Card Header */}
        <View style={styles.profileHeader}>
          {/* Avatar Container */}
          <View style={styles.avatarWrapper}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{userInitial}</Text>
            </View>
            <View style={styles.onlineBadge} />
          </View>

          {/* User Information */}
          <Text style={styles.userName}>{user?.name || 'User Name'}</Text>
          <View style={styles.emailContainer}>
            <Ionicons name="mail-outline" size={14} color="#64748B" />
            <Text style={styles.userEmail}>{user?.email || 'user@example.com'}</Text>
          </View>

          {/* Pro Badge */}
          <View style={styles.proBadge}>
            <Ionicons name="sparkles" size={12} color="#A3E635" />
            <Text style={styles.proBadgeText}>Pro Member</Text>
          </View>
        </View>

        {/* Options List */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Account Settings</Text>

          {/* Edit Profile Option */}
          <Pressable style={({ pressed }) => [styles.menuItem, pressed && styles.menuItemPressed]}>
            <View style={styles.menuLeft}>
              <View style={[styles.iconBox, { backgroundColor: 'rgba(56, 189, 248, 0.12)' }]}>
                <Ionicons name="person-outline" size={20} color="#38BDF8" />
              </View>
              <Text style={styles.menuText}>Edit Profile</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#64748B" />
          </Pressable>

          {/* Notifications Option */}
          <Pressable style={({ pressed }) => [styles.menuItem, pressed && styles.menuItemPressed]}>
            <View style={styles.menuLeft}>
              <View style={[styles.iconBox, { backgroundColor: 'rgba(167, 139, 250, 0.12)' }]}>
                <Ionicons name="notifications-outline" size={20} color="#A78BFA" />
              </View>
              <Text style={styles.menuText}>Notifications</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#64748B" />
          </Pressable>

          {/* Privacy Option */}
          <Pressable style={({ pressed }) => [styles.menuItem, pressed && styles.menuItemPressed]}>
            <View style={styles.menuLeft}>
              <View style={[styles.iconBox, { backgroundColor: 'rgba(52, 211, 153, 0.12)' }]}>
                <Ionicons name="shield-checkmark-outline" size={20} color="#34D399" />
              </View>
              <Text style={styles.menuText}>Privacy & Security</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#64748B" />
          </Pressable>

          {/* Logout Button */}
          <Pressable 
            onPress={logout} 
            style={({ pressed }) => [styles.logoutBtn, pressed && styles.logoutBtnPressed]}
          >
            <Ionicons name="log-out-outline" size={20} color="#F87171" />
            <Text style={styles.logoutBtnText}>Log Out</Text>
          </Pressable>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#071A1B',
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  profileHeader: {
    alignItems: 'center',
    backgroundColor: 'rgba(20, 38, 38, 0.75)',
    borderRadius: 24,
    paddingVertical: 28,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: 20,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(163, 230, 53, 0.15)',
    borderWidth: 2,
    borderColor: '#A3E635',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 36,
    fontWeight: '800',
    color: '#A3E635',
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#A3E635',
    borderWidth: 3,
    borderColor: '#071A1B',
  },
  userName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#F8FAFC',
    letterSpacing: -0.3,
  },
  emailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#94A3B8',
    fontWeight: '500',
  },
  proBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(163, 230, 53, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(163, 230, 53, 0.25)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 14,
  },
  proBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#A3E635',
  },
  menuSection: {
    gap: 10,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 4,
    marginLeft: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(20, 38, 38, 0.75)',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  menuItemPressed: {
    backgroundColor: 'rgba(30, 55, 55, 0.85)',
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#E2E8F0',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.25)',
    paddingVertical: 16,
    borderRadius: 18,
    marginTop: 16,
  },
  logoutBtnPressed: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
  },
  logoutBtnText: {
    color: '#F87171',
    fontWeight: '700',
    fontSize: 15,
  },
});