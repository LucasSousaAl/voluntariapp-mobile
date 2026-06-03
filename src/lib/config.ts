/**
 * Change `API_BASE_URL` to point to your VoluntariApp web backend.
 *
 * Examples:
 *   - Local Next.js dev server on the same machine running iOS Simulator:
 *       http://localhost:3000
 *   - Local Next.js dev server on the same machine running Android emulator:
 *       http://10.0.2.2:3000
 *   - Local Next.js dev server on a physical phone in the same Wi-Fi:
 *       http://192.168.X.Y:3000   (use your computer's LAN IP)
 *   - Production:
 *       https://voluntariapp.example.com
 *
 * The same API the web project exposes under /api/v1/* is used here.
 * `API_BASE_URL` is concatenated with paths like "/api/v1/auth/login".
 *
 * You can override at runtime via the EXPO_PUBLIC_API_URL env var
 * (e.g. EXPO_PUBLIC_API_URL=https://my.host npx expo start).
 */
export const API_BASE_URL: string =
  process.env.EXPO_PUBLIC_API_URL  || 'http://localhost:3000';

export const API_PREFIX = '/api/v1';
