'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { Event } from '@/types/event';

interface EventContextType {
  currentEvent: Event | null;
  setCurrentEvent: (event: Event | null) => void;
  events: Event[];
  loadEvents: () => Promise<void>;
  createEvent: (eventData: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  loading: boolean;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export function EventProvider({ children }: { children: React.ReactNode }) {
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const loadEvents = async () => {
    try {
      setLoading(true);
      // TODO: Implement loadEvents from database
      // For now, return empty array
      setEvents([]);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  const createEvent = async (eventData: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
    try {
      // TODO: Implement createEvent in database
      // For now, return a mock ID
      const newEvent: Event = {
        ...eventData,
        id: `event-${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      setEvents(prev => [...prev, newEvent]);
      return newEvent.id;
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const value = {
    currentEvent,
    setCurrentEvent,
    events,
    loadEvents,
    createEvent,
    loading,
  };

  return (
    <EventContext.Provider value={value}>
      {children}
    </EventContext.Provider>
  );
}

export function useEvent() {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error('useEvent must be used within an EventProvider');
  }
  return context;
}

