import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Header from './Header';
import SideNavigation from './SideNavigation';
import { initializeMockData } from '../../utils/mockData';
import LoginPage from '../../pages/LoginPage';
import { getSettings, saveSettings } from '../../utils/localStorage';
import ChatBot from '../ui/ChatBot';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isAuthenticated, currentUser } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  useEffect(() => {
    // Initialize mock data in localStorage
    initializeMockData();
    
    // Load dark mode from settings if available
    if (currentUser) {
      const userSettings = getSettings(currentUser.id);
      if (userSettings) {
        setIsDarkMode(userSettings.darkMode);
        document.documentElement.classList.toggle('dark', userSettings.darkMode);
      }
    }
  }, [currentUser]);
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };
  
  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    document.documentElement.classList.toggle('dark', newDarkMode);
    
    // Save to settings if user is logged in
    if (currentUser) {
      const userSettings = getSettings(currentUser.id) || {
        id: `settings-${currentUser.id}`,
        userId: currentUser.id,
        darkMode: newDarkMode,
        emailNotifications: true,
        pushNotifications: false,
        language: 'en'
      };
      
      userSettings.darkMode = newDarkMode;
      saveSettings(userSettings);
    }
  };
  
  if (!isAuthenticated) {
    return <LoginPage />;
  }
  
  return (
    <div className={`h-screen flex flex-col ${isDarkMode ? 'dark' : ''}`}>
      <Header 
        toggleMobileMenu={toggleMobileMenu} 
        toggleDarkMode={toggleDarkMode}
        isDarkMode={isDarkMode}
      />
      
      <div className="flex flex-1 overflow-hidden">
        <SideNavigation 
          isMobileMenuOpen={isMobileMenuOpen} 
          closeMobileMenu={closeMobileMenu} 
        />
        
        <main 
          className={`flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 md:ml-64 bg-gray-50 dark:bg-gray-900 dark:text-white transition-colors duration-200`}
          onClick={isMobileMenuOpen ? closeMobileMenu : undefined}
        >
          {children}
        </main>
      </div>

      <ChatBot />
    </div>
  );
};

export default Layout;