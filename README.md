# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

This project uses Bun for package management.

1. Install dependencies

   ```bash
   bun install
   ```

2. Start the app

   ```bash
   bunx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## StackTimer component

The core productivity component lives under `components/stack/` and is built with Nativewind v4+.

- Files:
  - `components/stack/StackTimer.tsx` – Main task timer card and state.
  - `components/stack/EditTaskModal.tsx` – Full-screen edit modal (emoji, color, duration).
  - `components/stack/BreakSuggestionModal.tsx` – Break duration selector and confirmation.
  - `components/stack/DeleteConfirmationModal.tsx` – Hold-to-confirm delete dialog.
  - `components/stack/EmptyState.tsx` – Empty state with CTA.
  - `components/stack/utils.ts` – Helper functions and static emoji data.

### Usage

The `StackTimer` is integrated into `app/(tabs)/index.tsx`. If you want to render it elsewhere:

```tsx
import StackTimer from '@/components/stack/StackTimer';

export default function Screen() {
  return <StackTimer />;
}
```

### Notes

- Nativewind utility classes are used for styling (light mode).
- Icons are from `@expo/vector-icons`.
- Haptic feedback leverages `expo-haptics` (optional, but recommended).
- Emojis are rendered as text; no web-only libraries are used.

### Development

- Start the dev server: `bunx expo start` (press `w` for web preview if needed).
- Ensure Android/iOS simulators are configured for mobile testing.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
