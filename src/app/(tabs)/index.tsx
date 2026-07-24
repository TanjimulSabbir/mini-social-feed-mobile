import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { PostCard } from "@/components/post/post-card";
import { usePostsInfinite } from "@/hooks/posts/usePostInfinite";
import { useToggleLike } from "@/hooks/posts/usePostMutation";
import { useAuthStore } from "@/store/auth.store";

export default function FeedScreen() {
  const me = useAuthStore((s) => s.user);
  const router = useRouter();
  const { highlightPostId } = useLocalSearchParams<{
    highlightPostId?: string;
  }>();

  const {
    data,
    isLoading,
    isError,
    refetch,
    isRefetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = usePostsInfinite();

  const toggleLike = useToggleLike();

  const posts = useMemo(
    () => data?.pages.flatMap((page) => page.posts) ?? [],
    [data],
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      {/* App Header */}
      <View style={styles.header}>
        <View style={styles.brandGroup}>
          <View style={styles.logoBadge}>
            <Ionicons name="chatbubbles" size={18} color="#A3E635" />
          </View>
          <Text style={styles.headerTitle}>MiniSocial</Text>
        </View>

        <TouchableOpacity
          style={styles.createBtn}
          onPress={() => router.push("/create-post")}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={20} color="#071A1B" />
          <Text style={styles.createBtnText}>Post</Text>
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#A3E635" />
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PostCard
              post={item}
              me={me}
              highlighted={item.id === highlightPostId}
              onToggleLike={(postId) => toggleLike.mutate(postId)}
              onAddComment={() => {}}
            />
          )}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              tintColor="#A3E635"
              colors={["#A3E635"]}
            />
          }
          onEndReachedThreshold={0.4}
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) fetchNextPage();
          }}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconBadge}>
                <Ionicons
                  name={isError ? "alert-circle-outline" : "sparkles-outline"}
                  size={32}
                  color={isError ? "#F87171" : "#A3E635"}
                />
              </View>
              <Text style={styles.emptyText}>
                {isError
                  ? "Couldn't load the feed. Pull down to try again."
                  : "No posts yet — be the first to start the conversation!"}
              </Text>
            </View>
          }
          ListFooterComponent={
            isFetchingNextPage ? (
              <ActivityIndicator style={styles.footerLoader} color="#A3E635" />
            ) : null
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#071A1B", // Deep dark teal
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.08)",
  },
  brandGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  logoBadge: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "rgba(163, 230, 53, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(163, 230, 53, 0.25)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#F8FAFC",
    letterSpacing: -0.5,
  },
  createBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#A3E635",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 4,
  },
  createBtnText: {
    color: "#071A1B",
    fontWeight: "800",
    fontSize: 13,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  listContent: {
    paddingVertical: 12,
    paddingBottom: 24,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
    paddingHorizontal: 32,
  },
  emptyIconBadge: {
    width: 64,
    height: 64,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  emptyText: {
    color: "#94A3B8",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  footerLoader: {
    marginVertical: 20,
  },
});
