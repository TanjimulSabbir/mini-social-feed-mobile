import { useEffect } from "react";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";

export function useNotificationResponseListener() {
  const router = useRouter();

  useEffect(() => {
    const responseSub = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const data = response.notification.request.content.data as {
          postId?: string;
        };

        if (data?.postId) {
          router.push({
            pathname: "/",
            params: { highlightPostId: data.postId },
          });
        }
      },
    );

    // Check if the app was launched by tapping a notification (cold start)
    Notifications.getLastNotificationResponseAsync().then((response) => {
      const data = response?.notification.request.content.data as {
        postId?: string;
      };
      if (data?.postId) {
        router.push({
          pathname: "/",
          params: { highlightPostId: data.postId },
        });
      }
    });

    return () => responseSub.remove();
  }, [router]);
}
