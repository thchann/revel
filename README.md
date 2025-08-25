# Revel-frontend

A React Native (Expo) app with a lightweight Node/Express backend.

## File format
This README is **Markdown**. Conventionally name it `README.md` (uppercase is common).

---

## Prerequisites

- **Node.js** 18+ and **npm** or **pnpm/yarn**
- **Expo CLI** (installed automatically via `npx`)
- **iOS**: Xcode + CocoaPods (macOS)
- **Android**: Android Studio + SDK/emulator
- (Optional) **Watchman** on macOS for file watching

---

## 1) Clone & Install

```bash
# from the project root (this folder contains package.json)
npm install
# or
yarn
# or
pnpm install
```

> Useful scripts from `package.json`:
- `start` → `expo start`
- `android` → `expo start --android`
- `ios` → `expo start --ios`
- `web` → `expo start --web`

---

## 2) Environment Setup

Create a `.env` (or `app.config.js` / `auth/.env` depending on your setup). Typical variables:

```bash
# Mobile app (example)
EXPO_PUBLIC_API_BASE_URL=http://localhost:4000

# Backend (example)
PORT=4000
NODE_ENV=development
```

> Check `app.config.js` and any `auth/*.ts` files for how env is read.

---

## 3) Run the Mobile App (Expo)

```bash
# Start the Expo dev server
npx expo start
```

Choose one of:
- Press **i** to open **iOS Simulator** (macOS).
- Press **a** to open **Android emulator**.
- Scan the QR code with the Expo Go app on your phone (same Wi‑Fi).

---

## 4) Start the Backend (Node/Express)

```bash
cd server
npm install  # if server has its own package.json; otherwise skip
node index.js
```

Default URLs (example): `http://localhost:4000`

## Detected routes
- **GET** `/api/users/:userId`
- **POST** `/api/users/add_user`
- **PUT** `/api/users/:userId/name`
- **DELETE** `/api/users/:userId`

> If you add a database, configure the connection string in `.env` and the server.

---

## 5) iOS Native (Optional)

If you need native iOS builds:
```bash
cd ios
pod install
# then open the Xcode workspace and build
```

> For pure Expo (managed) projects you usually **don’t** open Xcode. Use EAS to build:
```bash
npx expo install eas-cli
eas login
eas build -p ios
```

---

## 6) Android Native (Optional)

For native builds with EAS:
```bash
eas build -p android
```

Or open in Android Studio if using the bare workflow.

---

## 7) Project Structure

```
revel/
├── App.tsx                 # App entry
├── app/                    # Screens & feature modules
│   ├── post/               # Post flow (image, caption, location)
│   ├── search_components/  # Search UI
│   └── new_user_components/# Onboarding / login
├── auth/                   # Auth utilities / context
├── context/                # Global user context
├── navigators/             # React Navigation stacks & tabs
├── server/                 # Node/Express backend
├── ios/                    # iOS native project (Pods, Xcode)
├── package.json            # Dependencies & scripts
└── tsconfig.json           # TypeScript config
```

---

## 8) Common Tasks

- **Lint/Typecheck:** set up ESLint/Prettier/TS; run `tsc --noEmit`.
- **Add a screen:** create a file in `app/` and register it in a navigator.
- **API calls:** use `EXPO_PUBLIC_API_BASE_URL` to hit your backend.
- **Debug network:** use `npx expo start --tunnel` if your phone can’t reach localhost.
- **Reset Metro cache:** `npx expo start -c`.

---

## 9) Troubleshooting

- iOS Pods out of date → `cd ios && pod install && cd ..`
- “SDK mismatch” → update Expo packages to your SDK version.
- Device cannot connect → ensure phone & dev machine are on the same network; try **tunnel**.
- Android build tools missing → open Android Studio once to install SDKs.

---

## 10) License

MIT (or your choice).
