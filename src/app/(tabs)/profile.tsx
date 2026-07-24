import { View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/store/auth.store';

export default function ProfileScreen() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  return (
    <SafeAreaView className="flex-1 bg-white px-6 pt-6">
      <Text className="text-xl font-semibold">{user?.name}</Text>
      <Text className="text-gray-500">{user?.email}</Text>
      <Pressable onPress={logout} className="mt-8 bg-red-500 rounded-lg py-3">
        <Text className="text-white text-center font-medium">Log out</Text>
      </Pressable>
    </SafeAreaView>
  );
}