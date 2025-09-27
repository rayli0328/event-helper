import { createGame, createGameHost } from './database';

export const initializeSampleData = async () => {
  try {
    // Create sample games
    const games = [
      {
        name: 'Treasure Hunt',
        description: 'Find hidden treasures around the venue',
        hostId: '',
        isActive: true,
      },
      {
        name: 'Photo Challenge',
        description: 'Take creative photos with specific themes',
        hostId: '',
        isActive: true,
      },
      {
        name: 'Quiz Master',
        description: 'Answer trivia questions about the company',
        hostId: '',
        isActive: true,
      },
      {
        name: 'Team Building',
        description: 'Complete team-based challenges',
        hostId: '',
        isActive: true,
      },
      {
        name: 'Speed Networking',
        description: 'Meet and connect with colleagues',
        hostId: '',
        isActive: true,
      },
      {
        name: 'Innovation Lab',
        description: 'Create solutions for company challenges',
        hostId: '',
        isActive: true,
      },
    ];

    const createdGames = [];
    for (const game of games) {
      const gameId = await createGame(game);
      createdGames.push({ ...game, id: gameId });
    }

    // Create sample game hosts
    const hosts = [
      { name: 'Alice Johnson', gameId: createdGames[0].id, isActive: true },
      { name: 'Bob Smith', gameId: createdGames[1].id, isActive: true },
      { name: 'Carol Davis', gameId: createdGames[2].id, isActive: true },
      { name: 'David Wilson', gameId: createdGames[3].id, isActive: true },
      { name: 'Emma Brown', gameId: createdGames[4].id, isActive: true },
      { name: 'Frank Miller', gameId: createdGames[5].id, isActive: true },
    ];

    for (const host of hosts) {
      await createGameHost(host);
    }

    console.log('Sample data initialized successfully!');
    return true;
  } catch (error) {
    console.error('Error initializing sample data:', error);
    return false;
  }
};
