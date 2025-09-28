'use client';

import { createContext, useContext, useState, useEffect } from 'react';

interface ConfigContextType {
  eventName: string;
  eventDescription: string;
  updateConfig: (name: string, description: string) => void;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export function ConfigProvider({ children }: { children: React.ReactNode }) {
  const [eventName, setEventName] = useState('Event Name Placeholder');
  const [eventDescription, setEventDescription] = useState('Start your stamp collection journey');

  const updateConfig = (name: string, description: string) => {
    setEventName(name);
    setEventDescription(description);
    // In a real app, you'd save this to localStorage or a database
    localStorage.setItem('eventConfig', JSON.stringify({ name, description }));
  };

  useEffect(() => {
    // Load configuration from localStorage on mount
    const savedConfig = localStorage.getItem('eventConfig');
    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig);
        setEventName(config.name);
        setEventDescription(config.description);
      } catch (error) {
        console.error('Error loading config:', error);
      }
    }
  }, []);

  const value = {
    eventName,
    eventDescription,
    updateConfig,
  };

  return (
    <ConfigContext.Provider value={value}>
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfig() {
  const context = useContext(ConfigContext);
  if (context === undefined) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
}
