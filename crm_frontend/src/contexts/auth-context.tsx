'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, authApi, AuthResponse } from '../lib/api';
import { useRouter } from 'next/navigation'; 


interface AuthContextType {
  user: User | null;
  token: string | null;
  tenantId: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Calculate isAdmin based on user state - FIXED
  const isAdmin = user?.is_superuser == true; // Explicit check for true

  useEffect(() => {
    // Check if user is logged in on app start
    const storedToken = localStorage.getItem('accessToken');
    const userData = localStorage.getItem('userData');
    const storedTenantId = localStorage.getItem('tenantId');
    
    console.log('AuthProvider init:', {
      hasToken: !!storedToken,
      hasUserData: !!userData,
      storedTenantId
    });
    
    if (storedToken && userData) {
      try {
        setToken(storedToken);
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        
        console.log('Parsed user data:', parsedUser);
        console.log('is_superuser value:', parsedUser.is_superuser);
        console.log('is_superuser type:', typeof parsedUser.is_superuser);
        
        // Only set tenantId for non-admin users
        if (parsedUser.is_superuser === true) {
          console.log('User is admin, setting tenantId to null');
          setTenantId(null);
        } else if (storedTenantId) {
          console.log('User is not admin, setting tenantId:', storedTenantId);
          setTenantId(storedTenantId);
        }
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        logout();
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log('Starting login for:', email);
      const response: AuthResponse = await authApi.login(email, password);
      const { access_token, user_id, email: userEmail, full_name, tenant_id, is_superuser } = response;
      
      console.log('Login response is_superuser:', is_superuser, 'type:', typeof is_superuser);
      
      // Create complete user object from response
      const userData: User = {
        id: user_id || 1,
        email: userEmail || email,
        full_name: full_name || 'User',
        is_active: true,
        is_superuser: is_superuser === true, // Explicit boolean conversion
        tenant_id: tenant_id || null,
        created_at: new Date().toISOString(),
      };
      
      console.log('Created user data is_superuser:', userData.is_superuser);
      
      // Store everything
      setToken(access_token);
      setUser(userData);
      
      // Only store tenant ID for non-admin users
      if (userData.is_superuser === true) {
        console.log('Admin user detected, removing tenantId');
        setTenantId(null);
        localStorage.removeItem('tenantId');
      } else {
        console.log('Regular user detected, setting tenantId:', tenant_id);
        setTenantId(tenant_id?.toString() || '1');
        localStorage.setItem('tenantId', tenant_id?.toString() || '1');
      }
      
      localStorage.setItem('accessToken', access_token);
      localStorage.setItem('userData', JSON.stringify(userData));
      
      console.log('Login successful - Final state:', { 
        user: userData, 
        isAdmin: userData.is_superuser,
        tenantId: userData.is_superuser ? 'None (Admin)' : tenant_id
      });
      
    } catch (error: any) {
      console.error('Login failed:', error);
      const errorMessage = error.response?.data?.detail || 'Login failed. Please try again.';
      throw new Error(errorMessage);
    }
  };

const router = useRouter(); // ✅ Initialize router at the top of AuthProvider

const logout = () => {
  console.log('Logging out');
  localStorage.removeItem('accessToken');
  localStorage.removeItem('userData');
  localStorage.removeItem('tenantId');
  setUser(null);
  setToken(null);
  setTenantId(null);

  router.replace('/login'); // ✅ Redirect user to login page after logout
};


  const value: AuthContextType = {
    user,
    token,
    tenantId,
    login,
    logout,
    isAuthenticated: !!user && !!token,
    isLoading,
    isAdmin, // Use the calculated value
  };
  console.log('AuthContext value - isAdmin:', isAdmin, 'user.is_superuser:', user?.is_superuser);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};