import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { PostCard } from "@/components/post/post-card";
import { SearchBar } from "@/components/search-input";
import { usePostsInfinite } from "@/hooks/posts/usePostInfinite";
import { useToggleLike } from "@/hooks/posts/usePostMutation";
import { useDebounce } from "@/utils/debouncer";
import { FeedStyles as styles } from "@/styles/feed.styles";

export default function FeedScreen() {
  const router = useRouter();
  const { highlightPostId } = useLocalSearchParams<{
    highlightPostId?: string;
  }>();

  const [searchText, setSearchText] = useState("");
  const debouncedSearch = useDebounce(searchText, 400);

  const {
    data,
    isLoading,
    isError,
    refetch,
    isRefetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = usePostsInfinite(debouncedSearch);

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

      <SearchBar value={searchText} onChangeText={setSearchText} />

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
              highlighted={item.id === highlightPostId}
              onToggleLike={(postId) => toggleLike.mutate(postId)}
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
                  : debouncedSearch
                    ? `No posts found for "${debouncedSearch}"`
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
