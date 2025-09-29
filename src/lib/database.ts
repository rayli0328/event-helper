import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  setDoc,
  deleteDoc,
  query, 
  where, 
  orderBy,
  writeBatch,
  Timestamp 
} from 'firebase/firestore';
import { db } from './firebase';
import { Participant, Game, GameCompletion, GameHost, QRCodeData, GiftRedemption } from '@/types';

// Participants
export const createParticipant = async (participant: Omit<Participant, 'id' | 'createdAt'>) => {
  const docRef = await addDoc(collection(db, 'participants'), {
    ...participant,
    giftRedeemed: false,
    createdAt: Timestamp.now(),
  });
  return docRef.id;
};

export const getParticipant = async (id: string) => {
  const docRef = doc(db, 'participants', id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Participant;
  }
  return null;
};

export const getParticipantByStaffId = async (staffId: string) => {
  const q = query(collection(db, 'participants'), where('staffId', '==', staffId));
  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    const doc = querySnapshot.docs[0];
    return { id: doc.id, ...doc.data() } as Participant;
  }
  return null;
};

export const getParticipantByStaffIdAndLastName = async (staffId: string, lastName: string) => {
  // Get all participants and filter case-insensitively
  // Note: Firestore doesn't support case-insensitive queries directly
  const q = query(collection(db, 'participants'));
  const querySnapshot = await getDocs(q);
  
  // Filter participants with case-insensitive matching
  const participants = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Participant));
  
  const matchingParticipant = participants.find(participant => 
    participant.staffId.toLowerCase() === staffId.toLowerCase() &&
    participant.lastName.toLowerCase() === lastName.toLowerCase()
  );
  
  return matchingParticipant || null;
};

export const updateParticipantGames = async (participantId: string, gameId: string) => {
  const participant = await getParticipant(participantId);
  if (participant) {
    // Check if game is already completed to prevent duplicates
    if (!participant.completedGames.includes(gameId)) {
      const updatedGames = [...participant.completedGames, gameId];
      const docRef = doc(db, 'participants', participantId);
      await updateDoc(docRef, {
        completedGames: updatedGames,
      });
    }
  }
};

export const batchUpdateParticipantGames = async (participantId: string, gameIds: string[]) => {
  const participant = await getParticipant(participantId);
  if (participant) {
    const batch = writeBatch(db);
    
    // Filter out already completed games
    const newGames = gameIds.filter(gameId => !participant.completedGames.includes(gameId));
    
    if (newGames.length > 0) {
      const updatedGames = [...participant.completedGames, ...newGames];
      const participantRef = doc(db, 'participants', participantId);
      batch.update(participantRef, {
        completedGames: updatedGames,
      });
      
      // Create game completion records for each new game
      newGames.forEach(gameId => {
        const completionRef = doc(collection(db, 'gameCompletions'));
        batch.set(completionRef, {
          participantId,
          gameId,
          hostId: 'batch-update',
          completedAt: Timestamp.now(),
        });
      });
      
      await batch.commit();
    }
  }
};

// Games
export const createGame = async (game: Omit<Game, 'id' | 'createdAt'>) => {
  const docRef = await addDoc(collection(db, 'games'), {
    ...game,
    createdAt: Timestamp.now(),
  });
  return docRef.id;
};

export const getGames = async () => {
  const querySnapshot = await getDocs(collection(db, 'games'));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Game));
};

export const getActiveGames = async () => {
  try {
    // First try to get games with isActive: true (without ordering to avoid index requirement)
    const activeQuery = query(
      collection(db, 'games'), 
      where('isActive', '==', true)
    );
    const activeSnapshot = await getDocs(activeQuery);
    
    if (!activeSnapshot.empty) {
      const games = activeSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Game));
      // Sort manually to avoid index requirement
      return games.sort((a, b) => {
        if (a.createdAt && b.createdAt) {
          return a.createdAt.getTime() - b.createdAt.getTime();
        }
        return 0;
      });
    }
    
    // If no active games found, get all games (for backward compatibility)
    console.log('No active games found, fetching all games...');
    const allQuery = query(collection(db, 'games'));
    const allSnapshot = await getDocs(allQuery);
    const games = allSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Game));
    
    // Sort manually to avoid index requirement
    return games.sort((a, b) => {
      if (a.createdAt && b.createdAt) {
        return a.createdAt.getTime() - b.createdAt.getTime();
      }
      return 0;
    });
    
  } catch (error) {
    console.error('Error fetching games:', error);
    // Fallback: get all games without any filtering
    const fallbackQuery = query(collection(db, 'games'));
    const fallbackSnapshot = await getDocs(fallbackQuery);
    return fallbackSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Game));
  }
};

export const deleteGame = async (gameId: string) => {
  const docRef = doc(db, 'games', gameId);
  await deleteDoc(docRef);
};

// Game Completions
export const createGameCompletion = async (completion: Omit<GameCompletion, 'id' | 'completedAt'>) => {
  const docRef = await addDoc(collection(db, 'gameCompletions'), {
    ...completion,
    completedAt: Timestamp.now(),
  });
  return docRef.id;
};

export const getParticipantCompletions = async (participantId: string) => {
  // Optimized query with specific where clause and ordering
  const q = query(
    collection(db, 'gameCompletions'), 
    where('participantId', '==', participantId),
    orderBy('completedAt', 'desc')
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as GameCompletion));
};

// Game Hosts
export const createGameHost = async (host: Omit<GameHost, 'id'>) => {
  const docRef = await addDoc(collection(db, 'gameHosts'), host);
  return docRef.id;
};

export const getGameHosts = async () => {
  const querySnapshot = await getDocs(collection(db, 'gameHosts'));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as GameHost));
};

export const getGameHostByGameId = async (gameId: string) => {
  const q = query(collection(db, 'gameHosts'), where('gameId', '==', gameId));
  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    const doc = querySnapshot.docs[0];
    return { id: doc.id, ...doc.data() } as GameHost;
  }
  return null;
};

// Gift Redemption
export const redeemGift = async (participantId: string, redeemedBy: string) => {
  const batch = writeBatch(db);
  
  // Update participant's gift redemption status
  const participantRef = doc(db, 'participants', participantId);
  batch.update(participantRef, {
    giftRedeemed: true,
    giftRedeemedAt: Timestamp.now(),
  });
  
  // Create gift redemption record
  const redemptionRef = doc(collection(db, 'giftRedemptions'));
  batch.set(redemptionRef, {
    participantId,
    redeemedAt: Timestamp.now(),
    redeemedBy,
  });
  
  await batch.commit();
  return redemptionRef.id;
};

export const getGiftRedemptions = async () => {
  const q = query(
    collection(db, 'giftRedemptions'),
    orderBy('redeemedAt', 'desc')
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as GiftRedemption));
};

// Configuration functions
export const getConfiguration = async (): Promise<{ eventName: string; eventDescription: string }> => {
  try {
    const configRef = doc(db, 'configuration', 'event');
    const configSnap = await getDoc(configRef);
    
    if (configSnap.exists()) {
      const data = configSnap.data();
      return {
        eventName: data.eventName || 'Event Name Placeholder',
        eventDescription: data.eventDescription || 'Start your stamp collection journey',
      };
    } else {
      // Return default values if no configuration exists
      return {
        eventName: 'Event Name Placeholder',
        eventDescription: 'Start your stamp collection journey',
      };
    }
  } catch (error) {
    console.error('Error getting configuration:', error);
    return {
      eventName: 'Event Name Placeholder',
      eventDescription: 'Start your stamp collection journey',
    };
  }
};

export const updateConfiguration = async (eventName: string, eventDescription: string): Promise<void> => {
  try {
    const configRef = doc(db, 'configuration', 'event');
    await updateDoc(configRef, {
      eventName,
      eventDescription,
      updatedAt: Timestamp.now(),
    });
  } catch (error: any) {
    // If document doesn't exist, create it
    if (error.code === 'not-found') {
      const configRef = doc(db, 'configuration', 'event');
      await setDoc(configRef, {
        eventName,
        eventDescription,
        updatedAt: Timestamp.now(),
      });
    } else {
      console.error('Error updating configuration:', error);
      throw error;
    }
  }
};

// Report functions
export const getAllParticipants = async () => {
  const q = query(collection(db, 'participants'), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Participant));
};

export const getParticipantReport = async () => {
  try {
    console.log('Starting report generation...');
    const participants = await getAllParticipants();
    console.log('Participants loaded:', participants.length);
    
    const games = await getActiveGames();
    console.log('Games loaded:', games.length);
    
    const giftRedemptions = await getGiftRedemptions();
    console.log('Gift redemptions loaded:', giftRedemptions.length);
    
    // Create a map of gift redemptions for quick lookup
    const redemptionMap = new Map();
    giftRedemptions.forEach(redemption => {
      redemptionMap.set(redemption.participantId, redemption);
    });
    
    // Create report data with error handling for each participant
    const reportData = participants.map((participant, index) => {
      try {
        const redemption = redemptionMap.get(participant.id);
        const completedGamesCount = participant.completedGames?.length || 0;
        const totalGames = games.length;
        const completionPercentage = totalGames > 0 ? Math.round((completedGamesCount / totalGames) * 100) : 0;
        
        return {
          staffId: participant.staffId,
          lastName: participant.lastName,
          createdAt: participant.createdAt?.toDate ? participant.createdAt.toDate() : (participant.createdAt || new Date()),
          completedGames: completedGamesCount,
          totalGames: totalGames,
          completionPercentage: completionPercentage,
          giftRedeemed: participant.giftRedeemed || false,
          giftRedeemedAt: redemption?.redeemedAt?.toDate ? redemption.redeemedAt.toDate() : (redemption?.redeemedAt || null),
          completedGameIds: participant.completedGames || [],
        };
      } catch (participantError) {
        console.error(`Error processing participant ${index}:`, participantError);
        // Return a safe fallback for this participant
        return {
          staffId: participant.staffId || 'Unknown',
          lastName: participant.lastName || 'Unknown',
          createdAt: new Date(),
          completedGames: 0,
          totalGames: games.length,
          completionPercentage: 0,
          giftRedeemed: false,
          giftRedeemedAt: null,
          completedGameIds: [],
        };
      }
    });
    
    console.log('Report data generated:', reportData.length, 'participants');
    
    return {
      participants: reportData,
      games: games,
      summary: {
        totalParticipants: participants.length,
        totalGames: games.length,
        participantsWithGifts: participants.filter(p => p.giftRedeemed).length,
        averageCompletion: participants.length > 0 
          ? Math.round(participants.reduce((sum, p) => sum + ((p.completedGames?.length || 0) / games.length * 100), 0) / participants.length)
          : 0,
      }
    };
  } catch (error) {
    console.error('Error generating participant report:', error);
    throw new Error(`Failed to generate report: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};
