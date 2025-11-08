import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const AuthContext = createContext(null);

const ALLOWED_USERS = [
  {
    email: 'manager@company.com',
    password: 'securePass!2025',
    name: 'Senior Manager',
    role: 'senior-manager'
  }
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('hr-dashboard-user');
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Unable to read user from storage', error);
      return null;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('hr-dashboard-user', JSON.stringify(user));
    } else {
      localStorage.removeItem('hr-dashboard-user');
    }
  }, [user]);

  const login = (email, password) => {
    const match = ALLOWED_USERS.find((candidate) => candidate.email === email);
    if (!match || match.password !== password) {
      const error = new Error('Invalid credentials. Access restricted to senior managers.');
      error.code = 'INVALID_CREDENTIALS';
      throw error;
    }

    setUser({ email: match.email, name: match.name, role: match.role });
  };

  const logout = () => setUser(null);

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
      isAuthenticated: Boolean(user),
      isSeniorManager: user?.role === 'senior-manager'
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

