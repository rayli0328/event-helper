export interface Participant {
  id: string;
  staffId: string;
  lastName: string;
  qrCode: string;
  completedGames: string[];
  createdAt: Date;
}

export interface Game {
  id: string;
  name: string;
  description: string;
  hostId: string;
  isActive: boolean;
  createdAt: Date;
}

export interface GameCompletion {
  id: string;
  participantId: string;
  gameId: string;
  completedAt: Date;
  hostId: string;
}

export interface GameHost {
  id: string;
  name: string;
  gameId: string;
  isActive: boolean;
}

export interface QRCodeData {
  staffId: string;
  lastName: string;
  participantId: string;
}
