# MiniSocial — Mobile App

MiniSocial is a small social-feed mobile client built with **Expo**, **React Native**, and **TypeScript**. It has a paginated feed, posts, comments, likes, push notifications, and a centralized error/success handling system. This README covers setup, architecture, and day-to-day development.

**Stack:** Expo · React Native · TypeScript · React Query · Axios · Zustand · Zod · Bun

---

## Getting started

This project uses **Bun** as the package manager and script runner. All commands below use `bun`/`bunx` — swap in `npm`/`yarn`/`npx` if you prefer, they work identically since this is a standard Expo project.

### Prerequisites

- [Bun](https://bun.sh) installed (`curl -fsSL https://bun.sh/install | bash`)
- Expo CLI (comes via `bunx`, no global install needed)
- A physical device or emulator/simulator for testing (push notifications require a physical device)
- For native modules (Firebase/FCM): Android Studio / Xcode set up for building dev clients

### Install

```bash
bun install
```

### Run the dev server

```bash
bunx expo start
```

If you're using native modules that require a custom dev build (e.g. `@react-native-firebase/messaging`), Expo Go alone won't work — build a dev client instead:

```bash
bunx expo prebuild
bunx eas build --profile development --platform android
```

Then start with:

```bash
bunx expo start --dev-client
```

### Bun-specific notes

- `bunx expo install <package>` is preferred over `bun add <package>` for anything tied to your Expo SDK version — it resolves the correct compatible version automatically.
- Pure-JS packages (`zod`, `axios`, `zustand`, `http-status`, `react-native-toast-message`) need no rebuild after installing — just restart Metro.
- Native packages (`@react-native-firebase/messaging`, `burnt`) **do** require a rebuild (`prebuild` + `eas build`) after install or after any native config change — a Metro restart alone is not enough.
- If Metro/Expo was started via `bunx expo start`, kill and restart it (not just Fast Refresh) after any native dependency change.

---

## Project structure

```
.
├── app.json                  # Expo config
├── eas.json                  # EAS Build config
├── google-services.json      # Firebase Android config (FCM)
├── src/
│   ├── api/                  # Axios client + per-resource API functions
│   │   ├── client.ts         # apiClient instance, auth header injection, 401 refresh
│   │   ├── auth.api.ts
│   │   ├── posts.api.ts
│   │   ├── comment.api.ts
│   │   ├── like.api.ts
│   │   ├── notification.api.ts
│   │   └── query-keys.ts     # centralized React Query key factories
│   ├── app/                  # expo-router routes (screens)
│   │   ├── index.tsx         # root redirect based on auth state
│   │   ├── _layout.tsx       # root layout: providers, AuthGate, GlobalModal
│   │   ├── (auth)/           # login, signup — public routes
│   │   └── (tabs)/           # feed, create-post, notifications, profile — protected routes
│   ├── components/
│   │   ├── global-modal.tsx  # single app-wide error/success modal
│   │   ├── post/             # post card, comment list/modal/row, comment bar
│   │   ├── form/             # reusable form primitives (CForm, CInput, CTextarea)
│   │   └── ui/                # misc UI (AppModal)
│   ├── hooks/                # React Query wrappers, one file per resource
│   │   ├── posts/             # infinite feed, mutations, queries
│   │   ├── notifications/
│   │   ├── useAuthMutations.ts
│   │   ├── useCommentMutations.ts
│   │   └── useCommentQueries.ts
│   ├── lib/
│   │   ├── query-client.ts   # QueryClient with global mutation onError/onSuccess
│   │   └── push-notifications.ts
│   ├── store/                 # Zustand stores
│   │   ├── auth.store.ts     # user, isAuthenticated, isHydrated, login/signup/logout
│   │   └── modal.store.ts    # global modal message queue
│   ├── schema/                 # Zod schemas (login, signup)
│   ├── services/
│   │   └── storage.services.ts # AsyncStorage wrapper for tokens
│   ├── styles/                 # StyleSheet objects, one per screen/component
│   ├── types/                   # shared TS types
│   └── utils/
│       ├── auth-gate.tsx       # hydration gate + splash screen
│       ├── error.utils.ts     # getErrorMessage / getErrorInfo / getErrorStatusCode
│       ├── validate.form.ts
│       ├── debouncer.ts
│       └── date.ts
└── tsconfig.json
```

---

## Architecture

### Routing

File-based routing via `expo-router`, using **route groups** to separate public and protected screens:

- `app/(auth)/` — login, signup. `(auth)/_layout.tsx` redirects to `(tabs)` if already authenticated.
- `app/(tabs)/` — feed, create-post, notifications, profile. `(tabs)/_layout.tsx` redirects to `(auth)/login` if not authenticated.
- `app/index.tsx` — root entry point; redirects to `(tabs)` or `(auth)/login` based on current auth state, deciding *after* hydration has resolved.
- `app/_layout.tsx` — wraps everything in `QueryClientProvider` and `AuthGate`.

`AuthGate` is responsible **only** for showing a splash/loading screen while auth state hydrates from storage (`isHydrated`). It does **not** perform navigation — that responsibility lives entirely in the two group layouts' `<Redirect>` components, keeping auth-based routing declarative and centralized in one place per direction (no competing imperative `router.replace` calls).

### Auth & token refresh

- `store/auth.store.ts` (Zustand) holds `user`, `isAuthenticated`, `isHydrated`, and exposes `login`, `signup`, `logout`, `hydrate`.
- Access/refresh tokens are persisted via `services/storage.services.ts` (AsyncStorage).
- `api/client.ts` attaches the access token to every outgoing request, and transparently refreshes it on a `401` response — with request queueing so multiple simultaneous requests don't each trigger their own refresh call.
- Auth endpoints (login/signup) opt out of the refresh-retry flow via a `skipAuthRefresh` flag on the request config, since a login attempt has no session to refresh in the first place.
- Wrong credentials return `400` (not `401`) from the backend, deliberately, to avoid triggering refresh logic on a request that was never authenticated to begin with — and "user not found" vs. "wrong password" return the **same** status and message, to avoid leaking which accounts exist (user enumeration protection).

### Data fetching & mutations

- React Query manages all server state. `postKeys` / `commentKeys` / `likeKeys` / `notificationKeys` factories in `api/query-keys.ts` keep cache keys consistent and normalize inputs like `searchTerm` (trimmed, defaulted) so identical searches always hit the same cache entry.
- The feed uses `useInfiniteQuery` (`usePostsInfinite`) with server-side pagination; `getNextPageParam` reads from the backend's `meta.total`/`data.length`.
- **Likes** are fully optimistic: `useToggleLike`'s `onMutate` patches the cached post's `isLikedByMe` and `_count.likes` immediately, with rollback via a cache snapshot if the request fails — no refetch, no full post reload on tap.
- **Comments** similarly patch `_count.comments` in place on success rather than invalidating and refetching the whole feed.

### Global error & success handling

Every mutation created with `useMutation()` automatically shows a message via a single global modal — no per-hook `onError`/`onSuccess` boilerplate required anywhere in the app:

- `lib/query-client.ts` sets `defaultOptions.mutations.onError` / `onSuccess`, which React Query invokes for **every** mutation in the app in addition to (not instead of) any mutation-specific callback.
- `utils/error.utils.ts` extracts a human-readable message and status code from a backend error response — including digging into Zod-style `errorInfo.issues` (`{ field, message, code }`) for validation errors, so a 400 shows "content: Comment must be at least 10 characters" instead of a generic "Validation Error".
- `utils/modal.ts` (`pushModal(message, statusCode?)`) pushes a message onto `store/modal.store.ts`'s queue from **anywhere** — inside a React component, a plain utility function, or an interceptor — without needing hooks.
- `components/global-modal.tsx` is mounted once at the root layout (as a sibling of the router's `<Slot />`, so it survives navigation) and renders whatever's at the front of the queue, styling itself (icon, color, title) based on the HTTP status code via `http-status` constants.

To show a message manually from outside React Query (e.g. a Zustand action, a button handler):

```ts
import { pushModal } from "@/utils/modal";
import { getErrorMessage } from "@/utils/error.utils";

try {
  await someAction();
  pushModal("Done");
} catch (err) {
  pushModal(getErrorMessage(err), getErrorStatusCode(err));
}
```

### Push notifications (FCM)

- `lib/push-notifications.ts` handles permission requests, Android notification channel setup, and device token retrieval.
- The token is synced to the backend once per authenticated session (guarded against duplicate calls) via a listener attached in `AuthGate`, keyed off `isHydrated && isAuthenticated`.
- The token-refresh listener forwards the token it's given directly to the backend rather than re-fetching it — re-fetching from inside the listener risks re-triggering the same native token-changed event and looping.
- Requires a custom dev build (`@react-native-firebase/messaging` is a native module) — will not work in plain Expo Go.

---

## Backend response shape

All API responses (success and error) share one envelope:

```ts
type ApiResponse<T> = {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  meta?: { page: number; limit: number; total: number };
};
```

Error responses additionally include `errorInfo`, which may contain field-level validation issues:

```json
{
  "success": false,
  "statusCode": 400,
  "name": "AppError",
  "message": "Validation Error",
  "errorInfo": {
    "issues": [
      { "field": "content", "message": "Comment must be at least 10 characters", "code": "too_small" }
    ]
  }
}
```

`utils/error.utils.ts` parses this shape (and falls back gracefully to a generic message if the shape doesn't match) so the global modal always shows something meaningful.

---

## Common developer tasks

```bash
bunx expo start              # start the dev server
bunx expo start --dev-client # start against a custom dev build (needed for FCM, burnt, etc.)
bun run lint                 # lint
bunx tsc --noEmit            # type-check
```

### Adding a new mutation

1. Write the API function in `api/<resource>.api.ts`.
2. Wrap it in `useMutation()` inside `hooks/<resource>/use<Resource>Mutations.ts`.
3. That's it — error/success feedback is automatic via the global `queryClient` defaults. Only add a local `onError`/`onSuccess` if you need mutation-specific side effects (cache patching, navigation) — the global modal will still fire alongside it.

### Adding a new protected screen

Add the file under `app/(tabs)/`. It inherits the auth guard from `(tabs)/_layout.tsx` automatically — no per-screen auth check needed.

---

## Known limitations

- No automated tests yet (Jest + React Native Testing Library recommended before a production release).
- Backend error shapes are assumed consistent (`errorInfo.issues` with `field`/`message`/`code`) — if a different endpoint returns a different shape, `getErrorMessage` falls back to the generic top-level `message`, which is safe but less specific.
- The global modal shows one message at a time from a FIFO queue — rapid-fire errors will queue up rather than stack/overlap, by design.
- Web support via Expo is unconfigured/untested; this project targets iOS and Android.

---

## Deployment

- **Mobile builds:** [EAS Build](https://docs.expo.dev/build/introduction/) — configure `eas.json` and run `bunx eas build`.
- **Backend:** deployed separately (Node/Express + Prisma); the mobile app points at whatever `API_BASE_URL` is set in `src/constants/config.ts`.

---

## License

See `LICENSE` in the repo root.