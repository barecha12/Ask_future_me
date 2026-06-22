import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [solutions, setSolutions] = useLocalStorage('ask_future_me_solutions', []);
  const [theme, setTheme] = useLocalStorage('ask_future_me_theme', 'light');
  
  // User Profile
  const [userName, setUserName] = useLocalStorage('ask_future_me_username', 'User');

  // Auth state
  const [password, setPassword] = useLocalStorage('ask_future_me_password', 'admin');
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('ask_future_me_auth') === 'true';
  });

  const login = (inputPassword) => {
    if (inputPassword === password) {
      setIsAuthenticated(true);
      sessionStorage.setItem('ask_future_me_auth', 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('ask_future_me_auth');
  };

  const updateProfile = (newName, newPassword) => {
    if (newName) setUserName(newName);
    if (newPassword) setPassword(newPassword);
  };

  const changePassword = (newPassword) => {
    setPassword(newPassword);
  };

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const addSolution = (solutionData) => {
    const newSolution = {
      ...solutionData,
      id: crypto.randomUUID(),
      isFavorite: false,
      views: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setSolutions(prev => [newSolution, ...prev]);
    return newSolution;
  };

  const toggleFavorite = (id) => {
    setSolutions(prev => prev.map(sol => 
      sol.id === id ? { ...sol, isFavorite: !sol.isFavorite, updatedAt: new Date().toISOString() } : sol
    ));
  };

  const updateSolution = (id, updatedData) => {
    setSolutions(prev => prev.map(sol => 
      sol.id === id ? { ...sol, ...updatedData, updatedAt: new Date().toISOString() } : sol
    ));
  };

  const deleteSolution = (id) => {
    setSolutions(prev => prev.filter(sol => sol.id !== id));
  };

  const recordView = (id) => {
    setSolutions(prev => prev.map(sol => 
      sol.id === id ? { ...sol, views: sol.views + 1, lastViewed: new Date().toISOString() } : sol
    ));
  };

  const importData = (data) => {
    // Basic validation
    if (Array.isArray(data)) {
      setSolutions(data);
      return true;
    }
    return false;
  };

  const clearAllData = () => {
    setSolutions([]);
  };

  return (
    <AppContext.Provider value={{
      solutions,
      theme,
      toggleTheme,
      addSolution,
      updateSolution,
      deleteSolution,
      toggleFavorite,
      recordView,
      importData,
      clearAllData,
      password,
      userName,
      isAuthenticated,
      login,
      logout,
      changePassword,
      updateProfile
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};
