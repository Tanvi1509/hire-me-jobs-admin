// import { createContext, useContext, useState } from 'react';

// const AuthContext = createContext(null);

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(() => {
//     const stored = localStorage.getItem('admin_user');
//     return stored ? JSON.parse(stored) : null;
//   });

//   const login = (email, password) => {
//     if (email === 'admin@jobportal.com' && password === 'admin123') {
//       const adminUser = {
//         id: 1,
//         name: 'Alex Morgan',
//         email: 'admin@jobportal.com',
//         role: 'Super Admin',
//         avatar: null,
//       };
//       setUser(adminUser);
//       localStorage.setItem('admin_user', JSON.stringify(adminUser));
//       return { success: true };
//     }
//     return { success: false, error: 'Invalid email or password' };
//   };

//   const logout = () => {
//     setUser(null);
//     localStorage.removeItem('admin_user');
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);

import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Change this to your actual login endpoint
const LOGIN_API_URL = 'https://hire-me-jobs.onrender.com/user/login';
// Optional: endpoint to fetch user profile/role (if needed)
const USER_PROFILE_URL = 'https://your-api.com/api/auth/me';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null); // store role separately if needed

  // On mount, restore session from localStorage
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('admin_token');
      const storedUser = localStorage.getItem('admin_user');
      if (storedToken && storedUser) {
        setToken(storedToken);
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        // If user object has role, set it
        if (parsedUser.role_id || parsedUser.role) {
          setRole(parsedUser.role_id || parsedUser.role);
        }
      }
    } catch (error) {
      console.error('Failed to restore session:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // ─── Login function ───────────────────────────────────────────────
  const login = async (email, password) => {
    try {
      const response = await axios.post(LOGIN_API_URL, { email, password });
      const data = response.data;

      console.log('🔐 Login response:', data); // Inspect response

      // Expected shape: { success: true, token: '...', user: {...} }
      if (!data.success || !data.token || !data.user) {
        return {
          success: false,
          error: data.message || 'Invalid response from server',
        };
      }

      const { token: accessToken, user: userData } = data;

      // If userData already contains role_id or role, we're good.
      // Otherwise, we can try to fetch role from another endpoint.
      let finalUser = { ...userData };

      // Optional: fetch additional user info (like role) if not present
      if (!finalUser.role_id && !finalUser.role) {
        try {
          // If you have a /me endpoint that returns the role
          const profileRes = await axios.get(USER_PROFILE_URL, {
            headers: { Authorization: `Bearer ${accessToken}` }
          });
          const profileData = profileRes.data?.user || profileRes.data;
          if (profileData) {
            finalUser = { ...finalUser, ...profileData };
          }
        } catch (err) {
          console.warn('Could not fetch additional user info:', err);
        }
      }

      // Save to state
      setToken(accessToken);
      setUser(finalUser);
      if (finalUser.role_id || finalUser.role) {
        setRole(finalUser.role_id || finalUser.role);
      }

      // Persist to localStorage
      localStorage.setItem('admin_token', accessToken);
      localStorage.setItem('admin_user', JSON.stringify(finalUser));

      return { success: true };
    } catch (error) {
      let errorMsg = 'Login failed. Please try again.';
      if (error.response) {
        errorMsg =
          error.response.data?.message ||
          error.response.data?.error ||
          error.response.statusText ||
          errorMsg;
      } else if (error.request) {
        errorMsg = 'No response from server. Please check your network.';
      } else {
        errorMsg = error.message || errorMsg;
      }
      return { success: false, error: errorMsg };
    }
  };

  // ─── Logout ────────────────────────────────────────────────────────
  const logout = () => {
    setUser(null);
    setToken(null);
    setRole(null);
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
  };

  // ─── Helper to get auth headers ──────────────────────────────────
  const getAuthHeaders = () => {
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const value = {
    user,
    token,
    role,
    loading,
    login,
    logout,
    getAuthHeaders,
    isAuthenticated: !!user && !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};