import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc,
  query, 
  where, 
  orderBy,
  Timestamp 
} from 'firebase/firestore';
import { db } from './firebase';
import { Event, EventParticipant, EventGame, EventGameHost, EventGiftRedemption, EventConfiguration } from '@/types/event';

// Event Management Functions
export const createEvent = async (eventData: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  const docRef = await addDoc(collection(db, 'events'), {
    ...eventData,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  return docRef.id;
};

export const getEvent = async (eventId: string): Promise<Event | null> => {
  const docRef = doc(db, 'events', eventId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const data = docSnap.data();
    return {
      id: docSnap.id,
      ...data,
      startDate: data.startDate?.toDate() || new Date(),
      endDate: data.endDate?.toDate() || new Date(),
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
    } as Event;
  }
  return null;
};

export const getAllEvents = async (): Promise<Event[]> => {
  const q = query(collection(db, 'events'), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      startDate: data.startDate?.toDate() || new Date(),
      endDate: data.endDate?.toDate() || new Date(),
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
    } as Event;
  });
};

export const updateEvent = async (eventId: string, eventData: Partial<Event>): Promise<void> => {
  const docRef = doc(db, 'events', eventId);
  await updateDoc(docRef, {
    ...eventData,
    updatedAt: Timestamp.now(),
  });
};

export const deleteEvent = async (eventId: string): Promise<void> => {
  const docRef = doc(db, 'events', eventId);
  await deleteDoc(docRef);
};

// Event-Specific Data Functions
export const getEventParticipants = async (eventId: string): Promise<EventParticipant[]> => {
  const q = query(collection(db, 'participants'), where('eventId', '==', eventId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate() || new Date(),
    giftRedeemedAt: doc.data().giftRedeemedAt?.toDate() || null,
  })) as EventParticipant[];
};

export const getEventGames = async (eventId: string): Promise<EventGame[]> => {
  const q = query(collection(db, 'games'), where('eventId', '==', eventId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate() || new Date(),
  })) as EventGame[];
};

export const getEventGameHosts = async (eventId: string): Promise<EventGameHost[]> => {
  const q = query(collection(db, 'gameHosts'), where('eventId', '==', eventId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate() || new Date(),
  })) as EventGameHost[];
};

export const getEventGiftRedemptions = async (eventId: string): Promise<EventGiftRedemption[]> => {
  const q = query(collection(db, 'giftRedemptions'), where('eventId', '==', eventId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    redeemedAt: doc.data().redeemedAt?.toDate() || new Date(),
  })) as EventGiftRedemption[];
};

export const getEventConfiguration = async (eventId: string): Promise<EventConfiguration | null> => {
  const docRef = doc(db, 'configuration', eventId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const data = docSnap.data();
    return {
      eventId,
      eventName: data.eventName || 'Event Name Placeholder',
      eventDescription: data.eventDescription || 'Start your stamp collection journey',
      updatedAt: data.updatedAt?.toDate() || new Date(),
    };
  }
  return null;
};

export const updateEventConfiguration = async (eventId: string, eventName: string, eventDescription: string): Promise<void> => {
  const docRef = doc(db, 'configuration', eventId);
  await updateDoc(docRef, {
    eventName,
    eventDescription,
    updatedAt: Timestamp.now(),
  });
};

