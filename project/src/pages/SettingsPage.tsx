import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { getSettings, saveSettings } from '../utils/localStorage';
import { Settings } from '../types';
import { Toast } from '../components/ui/Toast';

const SettingsPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [showToast, setShowToast] = useState(false);
  
  // Form state
  const [darkMode, setDarkMode] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [language, setLanguage] = useState('en');
  
  useEffect(() => {
    if (currentUser) {
      // Load settings from localStorage
      const userSettings = getSettings(currentUser.id);
      
      if (userSettings) {
        setSettings(userSettings);
        setDarkMode(userSettings.darkMode);
        setEmailNotifications(userSettings.emailNotifications);
        setPushNotifications(userSettings.pushNotifications);
        setLanguage(userSettings.language);
      } else {
        // Create default settings
        const defaultSettings: Settings = {
          id: `settings-${currentUser.id}`,
          userId: currentUser.id,
          darkMode: false,
          emailNotifications: true,
          pushNotifications: false,
          language: 'en'
        };
        
        setSettings(defaultSettings);
      }
    }
  }, [currentUser]);
  
  const handleSaveSettings = () => {
    if (!currentUser || !settings) return;
    
    const updatedSettings: Settings = {
      ...settings,
      darkMode,
      emailNotifications,
      pushNotifications,
      language
    };
    
    // Save to localStorage
    saveSettings(updatedSettings);
    setSettings(updatedSettings);
    
    // Show toast notification
    setShowToast(true);
  };
  
  if (!settings) {
    return (
      <div className="text-center py-10">
        <p>Loading settings...</p>
      </div>
    );
  }
  
  return (
    <div className="max-w-3xl mx-auto">
      {showToast && (
        <Toast
          message="Settings saved successfully!"
          type="success"
          onClose={() => setShowToast(false)}
        />
      )}
      
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Appearance & Preferences</CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-6">
            {/* Theme Setting */}
            <div>
              <h3 className="text-base font-medium mb-2">Theme</h3>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={darkMode}
                  onChange={(e) => setDarkMode(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Dark Mode</span>
              </label>
              <p className="mt-1 text-xs text-gray-500">
                Switch between light and dark theme.
              </p>
            </div>
            
            {/* Notifications Settings */}
            <div>
              <h3 className="text-base font-medium mb-2">Notifications</h3>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={emailNotifications}
                    onChange={(e) => setEmailNotifications(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Email Notifications</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={pushNotifications}
                    onChange={(e) => setPushNotifications(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Push Notifications</span>
                </label>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Configure how you receive notifications.
              </p>
            </div>
            
            {/* Language Setting */}
            <div>
              <h3 className="text-base font-medium mb-2">Language</h3>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
              </select>
              <p className="mt-1 text-xs text-gray-500">
                Select your preferred language.
              </p>
            </div>
          </div>
        </CardContent>
        
        <CardFooter>
          <Button onClick={handleSaveSettings}>
            Save Settings
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SettingsPage;