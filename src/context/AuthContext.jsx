import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { API_UNAUTHORIZED_EVENT, apiRequest } from '../utils/api';
import { mapAuthResponseToUser, getAvatarInitials } from '../utils/mappers';
import { readStorage, writeStorage } from '../utils/storage';
import { AUTH_KEY, THEME_KEY } from '../utils/storageKeys';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => readStorage(AUTH_KEY, null));
  const [theme, setTheme] = useState(() => readStorage(THEME_KEY, 'light'));

  useEffect(() => writeStorage(AUTH_KEY, currentUser), [currentUser]);
  useEffect(() => {
    const handleUnauthorized = () => setCurrentUser(null);

    window.addEventListener(API_UNAUTHORIZED_EVENT, handleUnauthorized);
    return () => window.removeEventListener(API_UNAUTHORIZED_EVENT, handleUnauthorized);
  }, []);
  useEffect(() => {
    writeStorage(THEME_KEY, theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const value = useMemo(
    () => ({
      currentUser,
      theme,
      login: async (email, password) => {
        try {
          const response = await apiRequest('/Auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
          });
          setCurrentUser(mapAuthResponseToUser(response));
          return { ok: true };
        } catch (error) {
          return { ok: false, message: error.message || 'Unable to sign in.' };
        }
      },
      register: async ({ fullName, email, password }) => {
        try {
          const response = await apiRequest('/Auth/register', {
            method: 'POST',
            body: JSON.stringify({
              userName: fullName,
              email,
              password,
            }),
          });
          setCurrentUser(mapAuthResponseToUser(response));
          return { ok: true };
        } catch (error) {
          return { ok: false, message: error.message || 'Unable to create account.' };
        }
      },
      logout: () => setCurrentUser(null),
      updateProfile: (patch) => {
        if (!currentUser) return;
        const updated = {
          ...currentUser,
          ...patch,
          avatarInitials: getAvatarInitials(patch.fullName || currentUser.fullName),
        };
        setCurrentUser(updated);
      },
      toggleTheme: () => setTheme((prev) => (prev === 'light' ? 'dark' : 'light')),
    }),
    [currentUser, theme]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used in AuthProvider');
  return context;
}
