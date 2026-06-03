# VoluntariApp — Mobile (React Native + Expo)

React Native port of the VoluntariApp web project (Next.js) at `../voluntariapp`.

This is **frontend only** — it talks to the **same** `/api/v1/*` API as the web project.

---

## 1. Configure the API URL

Open `src/lib/config.ts` and change `API_BASE_URL` to wherever your VoluntariApp
backend is running. Common values:

| Where the app runs              | What to put in `API_BASE_URL`                  |
| ------------------------------- | ---------------------------------------------- |
| iOS Simulator + Next.js locally | `http://localhost:3000`                        |
| Android Emulator + Next.js      | `http://10.0.2.2:3000`                         |
| Physical phone (Expo Go)        | `http://<your-LAN-IP>:3000` (e.g. `192.168...`) |
| Production                      | `https://your-backend.example.com`             |

You can also override at runtime without editing the file:

```bash
EXPO_PUBLIC_API_URL=https://api.example.com npx expo start
```

> **Note:** when running the web backend locally, also start it with
> `npm run dev` from the `voluntariapp/` folder. The mobile app calls
> the same endpoints (`/api/v1/auth/login`, `/api/v1/trabalho`, …).

---

## 2. Install & run

```bash
cd voluntariapp-mobile
npm install        # (or pnpm / yarn / bun)
npx expo start     # press i for iOS, a for Android, w for web
```

To run on a physical device:
1. Install **Expo Go** from the App Store / Play Store.
2. Make sure your phone and dev machine are on the same Wi-Fi.
3. Use your LAN IP in `API_BASE_URL` (see the table above) — `localhost` won't
   resolve from the phone.
4. Scan the QR code shown by `npx expo start`.

---

## 3. What's included

All major features of the web app are reproduced:

| Screen        | File                                | What it does                                       |
| ------------- | ----------------------------------- | -------------------------------------------------- |
| Welcome       | `app/index.tsx`                     | Logo, CTA buttons, restores session on launch       |
| Login         | `app/login/index.tsx`               | Sign in with `volunteer` or `ong` user type        |
| Register      | `app/register/index.tsx`            | Sign up volunteer or ONG (ONG also creates `/ong`) |
| Home          | `app/home/index.tsx`                | List of vagas + category filter pills + geo nearest |
| Vaga detail   | `app/vaga/[id].tsx`                 | Apply + share                                       |
| ONG dashboard | `app/ong/index.tsx`                 | List vagas, edit/delete vaga, edit/delete ONG       |
| Create vaga   | `app/form/index.tsx`                | 3-step wizard (Dados, Detalhes, Revisão)           |
| Profile       | `app/profile/index.tsx`             | Volunteer info, history, edit profile, quit vagas   |

Shared widgets in `src/components/` mirror the web design tokens (greens, cream,
serif Lora for headings, DM Sans for body).

### Auth

- Token (JWT) is returned by the backend's `/auth/login` and `/auth/register`
  responses (the backend also sets an `HttpOnly` cookie — irrelevant on RN).
- We store the token in **expo-secure-store** (and `localStorage` on web).
- Every API call is sent with `Authorization: Bearer <token>`.
- The web app's `withAuth` HOF (`infra/middleware.ts`) already accepts the
  bearer header, so no backend changes are needed.

### Geolocation

The home screen uses `expo-location` to ask for permission and call
`/api/v1/trabalho-closest?latitude=…&longitude=…&raio=10000`. If permission
is denied we fall back to `/api/v1/trabalho`.

### Offline

`@react-native-community/netinfo` powers a top banner that appears whenever the
device loses network — same UX as the web's `OfflineBanner`.

---

## 4. Project layout

```
app/                      # expo-router file-based screens
src/
  components/            # Button, Card, Tag, Input, Navbar, …
  context/AppContext.tsx # auth state + selectedVaga
  lib/
    api.ts               # fetch wrapper + auth header
    config.ts            # API_BASE_URL — EDIT THIS
    storage.ts           # SecureStore wrapper
    geocode.ts           # Nominatim address → lat/lng
    mappers.ts           # /trabalho row → Vaga
  theme/                 # color, radius, fonts, category styles
  types/                 # Vaga / SessionUser / etc.
assets/images/           # icon-transparent.png (same as web /public)
```

---

## 5. Scripts

```bash
npm start         # expo start
npm run android   # expo start --android
npm run ios       # expo start --ios
npm run web       # expo start --web
npm run typecheck # tsc --noEmit
```

---

## 6. Notes on the API

The mobile app speaks to the exact same endpoints as the web app:

- `POST /api/v1/auth/login`       — `{ email, password }` → `{ token, user }`
- `POST /api/v1/auth/register`    — `{ nome, email, password, city, state, role, … }`
- `POST /api/v1/auth/logout`
- `GET  /api/v1/auth/me`          — returns the session user + history
- `PUT  /api/v1/auth/me/update`   — edit volunteer profile
- `GET  /api/v1/trabalho`         — list all vagas (or `?id=`, `?ong_id=`)
- `GET  /api/v1/trabalho-closest` — `?latitude=&longitude=&raio=`
- `POST /api/v1/trabalho`         — create vaga (ong role)
- `PUT  /api/v1/trabalho`         — edit vaga
- `DELETE /api/v1/trabalho?id=`   — delete vaga
- `POST /api/v1/trabalho/apply`   — `{ trabalho_id }`
- `DELETE /api/v1/trabalho/quit`  — `{ trabalho_id }`
- `GET  /api/v1/ong`              — list ONGs
- `POST/PUT/DELETE /api/v1/ong`   — manage ONG profile

If your backend ever moves, change just `API_BASE_URL` in
`src/lib/config.ts`.
