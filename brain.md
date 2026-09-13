# food_app — Project Brain

Onboarding context for future work. Concise, opinionated, current as of 2026-08-19.

---

## Project Overview

A food-ordering mobile app built with **Expo SDK 54 / React Native 0.81 / React 19**, using **Firebase Authentication + Firestore** for the backend. Currently in **early UI-scaffolding stage** with hardcoded mock data on most screens. The app is in the middle of an incomplete refactor toward a clean `src/navigation/` layout and a real auth gate.

> ⚠ **Read `AGENTS.md` and `https://docs.expo.dev/versions/v54.0.0/` before writing Expo/RN code.** This stack is bleeding-edge (new architecture, Reanimated 4, React 19) and v54 broke several APIs from prior SDKs.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Expo SDK `~54.0.35` (managed workflow) |
| Runtime | React Native `0.81.5`, React `19.1.0`, New Architecture **enabled** |
| Navigation | React Navigation v7 (`@react-navigation/native`, `native-stack`, `bottom-tabs`, `stack`) |
| Icons | `@expo/vector-icons` (default imports) + `react-native-heroicons` |
| State | React Context only (`AuthContext`). **Redux Toolkit + react-redux installed but unused.** |
| Backend | Firebase (`firebase ^12.17.1`) — Auth with AsyncStorage persistence, Firestore |
| Storage | `@react-native-async-storage/async-storage` |
| Animations | `react-native-reanimated ~4.1`, `react-native-gesture-handler`, `react-native-worklets` |
| Other native | `react-native-safe-area-context`, `react-native-screens`, `react-native-svg`, `react-native-swiper`, `expo-linear-gradient` |
| Language | **JavaScript only** (`.js`/`.jsx`). No TypeScript anywhere. |
| Testing | **None.** No jest config, no `__tests__`, no testing libraries. |
| Linting / build / typecheck | **No scripts defined.** Expo defaults in use. |

---

## Folder Structure

```
food_app/
├── App.js                  # Root: <AuthProvider><AppNav /></AuthProvider>
├── index.js                # registerComponent entry
├── app.json                # Expo config (portrait, new arch, package: com.anonymous.food_app)
├── package.json
├── android/                # Native shell (managed by Expo)
├── assets/                 # App icon + splash
├── firebase/
│   └── firebaseConfig.js   # Exports `auth` (initializeAuth + persistence) and `db` (Firestore)
└── src/
    ├── components/         # Shared UI: HeaderBar, Categories, CardSlider, CustomButton, OfferSlider
    ├── Context/
    │   └── AuthContext.js  # AuthProvider + AuthContext (currently hardcoded data1)
    ├── navigation/         # AppNav.js (root switch), AppStack.js (tabs), AuthStack.js (login flow)
    ├── MainScreens/        # Authenticated screens: Home, UserCart, UserProfile, TrackOrder, AccountAndSettings, Product
    ├── Login&SignupScreens/ # LoginScreen, SignUpScreen, SignupNext
    ├── Images/             # Local PNG/JPG assets
    └── screens/            # ⚠ EMPTY — dead directory, consider removing
```

**Note:** `AppNav.js`, `AppStack.js`, `AuthStack.js` also exist as duplicates at `src/` root from an unfinished refactor — prefer the ones in `src/navigation/`.

---

## Conventions

- **Language:** JavaScript (`.js` for navigation/context, `.jsx` for screens/components). No TS.
- **Components:** Functional components + hooks only (`useState`, `useEffect`, `useContext`, `useNavigation`). No classes.
- **Styling:** `StyleSheet.create(...)` at the bottom of every file. **No theme module** — brand colors (`#FF3F00`, `#E85A2A`, `#2D2D2D`, `#F8F8F8`) are hardcoded inline in each file. Tailwind/NativeWind/styled-components are **not** used.
- **Imports:** Relative paths only (`../components/...`). **No path aliases** (`@/`).
- **Icons:** Default imports (`import Ionicons from '@expo/vector-icons/Ionicons'`), not tree-shaken per-icon.
- **Naming:** File names are PascalCase (`HomeScreen.jsx`, `CustomButton.jsx`). Folder names are inconsistent — most are PascalCase, but `Login&SignupScreens` uses an ampersand.
- **No shared utilities, custom hooks, or `lib/` modules.** Firebase calls happen directly inside screen components (`getDocs(collection(db, 'UserProfiles'))` inside `UserProfile.jsx`). When adding data logic, extract a `src/api/` or `src/hooks/` layer.
- **Mock data:** Many screens hardcode product names, prices, and user fields. Replace before wiring real data.

---

## Setup / Run

```bash
npm install              # install deps
npm start                # expo start (Metro bundler + dev menu)
npm run android          # expo run:android  (requires Android dev environment)
npm run ios              # expo run:ios      (requires macOS + Xcode)
npm run web              # expo start --web
```

There is **no** `lint`, `test`, or `build` script. The Firebase config in `firebase/firebaseConfig.js` is committed — rotate keys before shipping.

---

## Notable Architectural Decisions & Known Gaps

These are inferred from the code; flagging because future work will hit them.

1. **Two `NavigationContainer`s.** `AppStack.js` and `AuthStack.js` each wrap their own `NavigationContainer`. React Navigation requires a single root container — `AppNav.js` is the right place for it. Currently `AppNav.js` only renders `AppStack`, with `AuthStack` commented out, so the auth login flow is **unreachable**.

2. **Auth gate not implemented.** `AuthProvider` is mounted but does **not** subscribe to Firebase `onAuthStateChanged`. To finish the gate: in `AuthContext.js`, subscribe to `onAuthStateChanged(auth, user => setUser(user))`; in `AppNav.js`, switch between `AuthStack` and `AppStack` based on `user`.

3. **Redux is dead weight.** `@reduxjs/toolkit` and `react-redux` are in `package.json` but there is no `store.js`, no `Provider`, no slices. Either delete the deps or build out slices (cart, orders, user).

4. **Unused dependencies:** `@react-navigation/drawer`, `expo-linear-gradient`, and the `src/screens/` directory. Remove or wire them.

5. **New architecture + Reanimated 4 + React 19.** Many community libraries haven't published v54-compatible builds. Pin and test any new dep against `docs.expo.dev/versions/v54.0.0/` before adding it.

6. **No theme/constants file.** Hex literals are duplicated across screens. Recommend a `src/theme.js` (or `src/constants/colors.js`) when more than one new screen needs the same value.

7. **No testing or CI.** Adding the first test will require choosing jest config, RTL, and a script. Not set up yet.

8. **Duplicate nav files at `src/` root** (`AppNav.js`, `AppStack.js`, `AuthStack.js`) shadow the ones in `src/navigation/`. Use the `src/navigation/` versions and delete the root duplicates when you touch this area.
