import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from 'react';
import { SessionUser, UserRole, UserType, Vaga } from '@/types';
import { api, getToken, setToken, clearToken } from '@/lib/api';

interface AppContextType {
  selectedVaga: Vaga | null;
  setSelectedVaga: (v: Vaga | null) => void;

  userType: UserType;
  setUserType: (t: UserType) => void;

  currentUserRole: UserRole;
  setCurrentUserRole: (role: UserRole) => void;

  currentUser: SessionUser | null;
  setCurrentUser: (user: SessionUser | null) => void;

  /** True while we're still resolving the persisted session. */
  isBootstrapping: boolean;

  /** Stores token + user, sets role. */
  signIn: (params: { token: string; user: SessionUser }) => Promise<void>;
  /** Clears session + role. */
  signOut: () => Promise<void>;
  /** Re-fetch the /auth/me data and refresh currentUser. */
  refreshSession: () => Promise<void>;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [selectedVaga, setSelectedVaga] = useState<Vaga | null>(null);
  const [userType, setUserType] = useState<UserType>('volunteer');
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>('guest');
  const [currentUser, setCurrentUser] = useState<SessionUser | null>(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  const refreshSession = useCallback(async () => {
    try {
      const token = await getToken();
      if (!token) {
        setCurrentUser(null);
        setCurrentUserRole('guest');
        return;
      }
      const user = await api.get<SessionUser>('/auth/me');
      setCurrentUser(user);
      setCurrentUserRole((user.role as UserRole) ?? 'guest');
    } catch (err) {
      // Token likely invalid — clear it.
      await clearToken();
      setCurrentUser(null);
      setCurrentUserRole('guest');
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      await refreshSession();
      if (mounted) setIsBootstrapping(false);
    })();
    return () => {
      mounted = false;
    };
  }, [refreshSession]);

  const signIn = useCallback(
    async ({ token, user }: { token: string; user: SessionUser }) => {
      await setToken(token);
      setCurrentUser(user);
      setCurrentUserRole((user.role as UserRole) ?? 'guest');
    },
    [],
  );

  const signOut = useCallback(async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // ignore — we'll wipe local state regardless
    }
    await clearToken();
    setCurrentUser(null);
    setCurrentUserRole('guest');
    setSelectedVaga(null);
  }, []);

  return (
    <AppContext.Provider
      value={{
        selectedVaga,
        setSelectedVaga,
        userType,
        setUserType,
        currentUserRole,
        setCurrentUserRole,
        currentUser,
        setCurrentUser,
        isBootstrapping,
        signIn,
        signOut,
        refreshSession,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
