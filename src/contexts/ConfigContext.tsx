'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { getConfiguration, updateConfiguration } from '@/lib/database';

interface ConfigContextType {
  eventName: string;
  eventDescription: string;
  updateConfig: (name: string, description: string) => Promise<void>;
  loading: boolean;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export function ConfigProvider({ children }: { children: React.ReactNode }) {
  const [eventName, setEventName] = useState('Event Name Placeholder');
  const [eventDescription, setEventDescription] = useState('Start your stamp collection journey');
  const [loading, setLoading] = useState(true);

  const updateConfig = async (name: string, description: string) => {
    try {
      await updateConfiguration(name, description);
      setEventName(name);
      setEventDescription(description);
    } catch (error) {
      console.error('Error updating configuration:', error);
      throw error;
    }
  };

  useEffect(() => {
    const loadConfiguration = async () => {
      try {
        setLoading(true);
        const config = await getConfiguration();
        setEventName(config.eventName);
        setEventDescription(config.eventDescription);
      } catch (error) {
        console.error('Error loading configuration:', error);
      } finally {
        setLoading(false);
      }
    };

    loadConfiguration();
  }, []);

  const value = {
    eventName,
    eventDescription,
    updateConfig,
    loading,
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
