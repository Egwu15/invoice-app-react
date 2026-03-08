import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { seedUser } from '../data/mockData';
import { readStorage, writeStorage } from '../utils/storage';

const AuthContext = createContext(null);
const AUTH_KEY = 'invoiceflow.auth';
const USERS_KEY = 'invoiceflow.users';
const THEME_KEY = 'invoiceflow.theme';

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(() => readStorage(USERS_KEY, [seedUser]));
  const [currentUser, setCurrentUser] = useState(() => readStorage(AUTH_KEY, null));
  const [theme, setTheme] = useState(() => readStorage(THEME_KEY, 'light'));

  useEffect(() => writeStorage(USERS_KEY, users), [users]);
  useEffect(() => writeStorage(AUTH_KEY, currentUser), [currentUser]);
  useEffect(() => {
    writeStorage(THEME_KEY, theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const value = useMemo(
    () => ({
      users,
      currentUser,
      theme,
      login: (email, password) => {
        const matched = users.find((u) => u.email === email && u.password === password);
        if (!matched) {
          return { ok: false, message: 'Invalid credentials. Use alex@invoiceflow.dev / demo1234' };
        }
        setCurrentUser(matched);
        return { ok: true };
      },
      register: ({ fullName, email, password }) => {
        if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
          return { ok: false, message: 'Email already exists.' };
        }
        const user = {
          id: `u-${Date.now()}`,
          fullName,
          email,
          password,
          company: 'New Company',
          role: 'Owner',
          location: 'Remote',
          avatarInitials: fullName
            .split(' ')
            .map((p) => p[0])
            .join('')
            .slice(0, 2)
            .toUpperCase(),
        };
        setUsers((prev) => [...prev, user]);
        setCurrentUser(user);
        return { ok: true };
      },
      logout: () => setCurrentUser(null),
      updateProfile: (patch) => {
        if (!currentUser) return;
        const updated = { ...currentUser, ...patch };
        setCurrentUser(updated);
        setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
      },
      toggleTheme: () => setTheme((prev) => (prev === 'light' ? 'dark' : 'light')),
    }),
    [users, currentUser, theme]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used in AuthProvider');
  return context;
}
