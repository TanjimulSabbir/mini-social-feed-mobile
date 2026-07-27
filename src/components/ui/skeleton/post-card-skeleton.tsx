import { useEffect, useState } from "react";
import { Animated, Easing, View } from "react-native";

import { COLORS } from "@/constants/theme";
import { postCardStyles as styles } from "@/styles/post.card.styles";

function ShimmerBlock({ style }: { style: any }) {
  const [opacity] = useState(() => new Animated.Value(0.4));

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.4,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return <Animated.View style={[style, { opacity }]} />;
}

function PostCardSkeletonRow() {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <ShimmerBlock style={skeletonStyles.avatar} />
        <View style={styles.headerInfo}>
          <ShimmerBlock style={skeletonStyles.nameLine} />
          <ShimmerBlock style={skeletonStyles.timeLine} />
        </View>
      </View>

      <ShimmerBlock style={skeletonStyles.titleLine} />
      <ShimmerBlock style={skeletonStyles.bodyLineFull} />
      <ShimmerBlock style={skeletonStyles.bodyLineShort} />

      <View style={[styles.actions, { marginTop: 12 }]}>
        <ShimmerBlock style={skeletonStyles.actionPill} />
        <ShimmerBlock style={skeletonStyles.actionPill} />
      </View>
    </View>
  );
}

export function FeedSkeleton({ count = 4 }: { count?: number }) {
  return (
    <View>
      {Array.from({ length: count }).map((_, i) => (
        <PostCardSkeletonRow key={i} />
      ))}
    </View>
  );
}

const skeletonBase = {
  backgroundColor: COLORS.border,
  borderRadius: 6,
};

const skeletonStyles = {
  avatar: {
    ...skeletonBase,
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  nameLine: {
    ...skeletonBase,
    width: 120,
    height: 12,
    marginBottom: 6,
  },
  timeLine: {
    ...skeletonBase,
    width: 70,
    height: 10,
  },
  titleLine: {
    ...skeletonBase,
    width: "70%",
    height: 16,
    marginTop: 14,
    marginBottom: 10,
  },
  bodyLineFull: {
    ...skeletonBase,
    width: "100%",
    height: 12,
    marginBottom: 8,
  },
  bodyLineShort: {
    ...skeletonBase,
    width: "60%",
    height: 12,
  },
  actionPill: {
    ...skeletonBase,
    width: 56,
    height: 28,
    borderRadius: 8,
    marginRight: 10,
  },
} as const;
