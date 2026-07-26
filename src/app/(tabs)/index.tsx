import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";

import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  ListRenderItem,
  Platform,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { PostCard } from "@/components/post/post-card";
import { SearchBar } from "@/components/search-input";
import { COLORS } from "@/constants/theme";
import { usePostsInfinite } from "@/hooks/posts/usePostInfinite";
import { useToggleLike } from "@/hooks/posts/usePostMutation";
import { FeedStyles as styles } from "@/styles/feed.styles";
import { Post } from "@/types/post.types";
import { useDebounce } from "@/utils/debouncer";
import { FeedSkeleton } from "@/components/ui/skeleton/post-card-skeleton";

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
  
  const handleToggleLike = useCallback(
    (postId: string) => {
      toggleLike.mutate(postId, {
        onError: () => {
          Alert.alert(
            "Couldn't update like",
            "Please check your connection and try again.",
          );
        },
      });
    },
    [toggleLike],
  );

  const renderItem: ListRenderItem<Post> = useCallback(
    ({ item }) => (
      <PostCard
        post={item}
        highlighted={item.id === highlightPostId}
        onToggleLike={handleToggleLike}
      />
    ),
    [highlightPostId, handleToggleLike],
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.header}>
        <View style={styles.brandGroup}>
          <View style={styles.logoBadge}>
            <Ionicons name="chatbubbles" size={18} color={COLORS.active} />
          </View>
          <Text style={styles.headerTitle}>MiniSocial</Text>
        </View>

        <TouchableOpacity
          style={styles.createBtn}
          onPress={() => router.push("/create-post")}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Create a new post"
        >
          <Ionicons name="add" size={20} color={COLORS.background} />
          <Text style={styles.createBtnText}>Post</Text>
        </TouchableOpacity>
      </View>

      <SearchBar value={searchText} onChangeText={setSearchText} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        {isLoading ? (
          <FeedSkeleton count={4} />
        ) : (
          <FlatList
            data={posts}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            refreshControl={
              <RefreshControl
                refreshing={isRefetching}
                onRefresh={refetch}
                tintColor={COLORS.active}
                colors={[COLORS.active]}
              />
            }
            onEndReachedThreshold={0.4}
            onEndReached={() => {
              if (hasNextPage && !isFetchingNextPage) fetchNextPage();
            }}
            removeClippedSubviews
            maxToRenderPerBatch={8}
            windowSize={7}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <View style={styles.emptyIconBadge}>
                  <Ionicons
                    name={isError ? "alert-circle-outline" : "sparkles-outline"}
                    size={32}
                    color={isError ? COLORS.error : COLORS.active}
                  />
                </View>
                <Text style={styles.emptyText}>
                  {isError
                    ? "Couldn't load the feed. Pull down to try again."
                    : debouncedSearch
                      ? `No posts found for "${debouncedSearch}"`
                      : "No posts yet — be the first to start the conversation!"}
                </Text>
                {isError && (
                  <TouchableOpacity
                    onPress={() => refetch()}
                    style={styles.retryBtn}
                    accessibilityRole="button"
                    accessibilityLabel="Retry loading feed"
                  >
                    <Text style={styles.retryBtnText}>Try again</Text>
                  </TouchableOpacity>
                )}
              </View>
            }
            ListFooterComponent={
              isFetchingNextPage ? (
                <ActivityIndicator
                  style={styles.footerLoader}
                  color={COLORS.active}
                />
              ) : null
            }
          />
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
