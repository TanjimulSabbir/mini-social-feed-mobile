import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { postsApi } from "@/api/posts.api";
import { PostCard } from "@/components/post/post-card";
import { Post } from "@/types/app.types";

export default function FeedScreen() {
  const { highlightPostId } = useLocalSearchParams<{ highlightPostId?: string }>();

  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [usernameFilter, setUsernameFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPage = useCallback(
    async (pageToLoad: number, replace: boolean, filter: string) => {
      try {
        setError(null);
        const res = await postsApi.getFeed(pageToLoad, filter || undefined);
        setPosts((prev) => (replace ? res.items : [...prev, ...res.items]));
        setHasMore(res.hasMore);
        setPage(pageToLoad);
      } catch (err) {
        setError("Couldn't load the feed. Pull down to try again.");
      }
    },
    []
  );

  useEffect(() => {
    setLoading(true);
    loadPage(1, true, usernameFilter).finally(() => setLoading(false));
    // Re-run whenever the filter changes (debounced by the input's onChangeText below isn't
    // strictly needed for a demo app, but a real one should debounce this).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usernameFilter]);

  async function handleRefresh() {
    setRefreshing(true);
    await loadPage(1, true, usernameFilter);
    setRefreshing(false);
  }

  async function handleLoadMore() {
    if (loadingMore || !hasMore || loading) return;
    setLoadingMore(true);
    await loadPage(page + 1, false, usernameFilter);
    setLoadingMore(false);
  }

  async function handleToggleLike(postId: string) {
    // optimistic update
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              likedByMe: !p.likedByMe,
              likesCount: p.likesCount + (p.likedByMe ? -1 : 1),
            }
          : p
      )
    );
    try {
      const res = await postsApi.toggleLike(postId);
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId ? { ...p, likedByMe: res.likedByMe, likesCount: res.likesCount } : p
        )
      );
    } catch {
      // revert on failure
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? {
                ...p,
                likedByMe: !p.likedByMe,
                likesCount: p.likesCount + (p.likedByMe ? -1 : 1),
              }
            : p
        )
      );
    }
  }

  async function handleAddComment(postId: string, text: string) {
    const comment = await postsApi.addComment(postId, text);
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              commentsCount: p.commentsCount + 1,
              comments: [...(p.comments ?? []), comment],
            }
          : p
      )
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.searchBar}>
        <Ionicons name="search" size={18} color="#9ca3af" />
        <TextInput
          style={styles.searchInput}
          placeholder="Filter by username…"
          placeholderTextColor="#9ca3af"
          value={usernameFilter}
          onChangeText={setUsernameFilter}
          autoCapitalize="none"
        />
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#4f46e5" />
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PostCard
              post={item}
              highlighted={item.id === highlightPostId}
              onToggleLike={handleToggleLike}
              onAddComment={handleAddComment}
            />
          )}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
          onEndReachedThreshold={0.4}
          onEndReached={handleLoadMore}
          ListEmptyComponent={
            <View style={styles.centered}>
              <Text style={styles.emptyText}>
                {error ?? (usernameFilter ? `No posts from "${usernameFilter}"` : "No posts yet — be the first!")}
              </Text>
            </View>
          }
          ListFooterComponent={
            loadingMore ? (
              <ActivityIndicator style={{ marginVertical: 16 }} color="#4f46e5" />
            ) : null
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f9fafb" },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 4,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  searchInput: { flex: 1, fontSize: 14, color: "#111827" },
  listContent: { paddingVertical: 8, paddingBottom: 24 },
  centered: { flex: 1, alignItems: "center", justifyContent: "center", paddingTop: 80 },
  emptyText: { color: "#9ca3af", fontSize: 14 },
});
