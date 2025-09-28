export interface Participant {
  id: string;
  staffId: string;
  lastName: string;
  qrCode: string;
  completedGames: string[];
  giftRedeemed: boolean;
  giftRedeemedAt?: Date;
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

export interface GiftRedemption {
  id: string;
  participantId: string;
  redeemedAt: Date;
  redeemedBy: string; // Staff member who processed the redemption
}
