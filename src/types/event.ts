export interface Event {
  id: string;
  name: string;
  description: string;
  location: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string; // Admin user ID
  qrCodeUrl?: string;
  eventCode: string; // Unique identifier for the event
}

export interface EventParticipant {
  eventId: string;
  staffId: string;
  lastName: string;
  qrCode: string;
  completedGames: string[];
  giftRedeemed: boolean;
  giftRedeemedAt?: Date;
  createdAt: Date;
}

export interface EventGame {
  eventId: string;
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: Date;
}

export interface EventGameHost {
  eventId: string;
  id: string;
  name: string;
  gameId: string;
  createdAt: Date;
}

export interface EventGiftRedemption {
  eventId: string;
  participantId: string;
  redeemedAt: Date;
  redeemedBy: string;
}

export interface EventConfiguration {
  eventId: string;
  eventName: string;
  eventDescription: string;
  updatedAt: Date;
}

