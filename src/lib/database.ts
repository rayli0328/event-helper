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
  // Optimized query with compound where clause
  const q = query(
    collection(db, 'participants'), 
    where('staffId', '==', staffId),
    where('lastName', '==', lastName)
  );
  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    const doc = querySnapshot.docs[0];
    return { id: doc.id, ...doc.data() } as Participant;
  }
  return null;
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
  // Optimized query with specific where clause and ordering
  const q = query(
    collection(db, 'games'), 
    where('isActive', '==', true),
    orderBy('createdAt', 'asc')
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Game));
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
