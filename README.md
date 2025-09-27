# Event Helper - QR Code Game Management System

A Next.js application for managing event games using QR codes. Participants generate unique QR codes, game hosts scan them to mark completions, and gift corner staff verify all games are completed.

## Features

- **Participant QR Code Generation**: Each participant can generate a unique QR code with their staff ID and last name
- **Game Host Scanning**: Game hosts can scan participant QR codes to mark games as completed
- **Multiple Games Support**: Support for 6+ different games with different hosts
- **Gift Corner Verification**: Staff can verify all games are completed before giving gifts
- **Admin Panel**: Manage games, hosts, and view analytics

## Tech Stack

- **Frontend**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **QR Code**: qrcode library
- **Icons**: Lucide React

## Setup Instructions

### Prerequisites

1. **Node.js**: Install Node.js (version 18 or higher)
   - Download from [nodejs.org](https://nodejs.org/)
   - Verify installation: `node --version`

2. **Firebase Project**: Create a Firebase project
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable Firestore Database
   - Get your Firebase configuration

### Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Configuration**
   - Copy `.env.example` to `.env.local`
   - Add your Firebase configuration:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

3. **Firebase Firestore Rules**
   Add these rules to your Firestore database:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if true; // For development only
       }
     }
   }
   ```

4. **Run the Application**
   ```bash
   npm run dev
   ```

5. **Initialize Sample Data**
   - Go to the Admin Panel
   - Create sample games and hosts, or use the setup script

## Usage

### For Participants
1. Go to "Generate QR Code" page
2. Enter your Staff ID and Last Name
3. Download the generated QR code to your mobile device

### For Game Hosts
1. Go to "Game Host" page
2. Select the game you're hosting
3. Scan participant QR codes or enter data manually
4. Mark games as completed

### For Gift Corner Staff
1. Go to "Gift Corner" page
2. Scan participant QR codes
3. Verify all 6 games are completed
4. Give gifts to eligible participants

### For Administrators
1. Go to "Admin Panel"
2. Create and manage games
3. Assign game hosts
4. View system analytics

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── admin/             # Admin panel pages
│   ├── gift-corner/       # Gift corner pages
│   ├── host/              # Game host pages
│   ├── participant/       # Participant pages
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable components
├── lib/                   # Utility libraries
│   ├── database.ts        # Firestore operations
│   ├── firebase.ts        # Firebase configuration
│   ├── qrCode.ts          # QR code utilities
│   └── setup.ts           # Sample data setup
└── types/                 # TypeScript type definitions
    └── index.ts           # App types
```

## Database Schema

### Collections

- **participants**: Store participant information
- **games**: Store game details
- **gameHosts**: Store game host assignments
- **gameCompletions**: Track game completions

### Key Fields

- **Participant**: `staffId`, `lastName`, `completedGames[]`
- **Game**: `name`, `description`, `isActive`
- **GameCompletion**: `participantId`, `gameId`, `completedAt`

## Development

### Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run lint`: Run ESLint

### Adding New Features

1. Create new pages in `src/app/`
2. Add components in `src/components/`
3. Update types in `src/types/`
4. Add database operations in `src/lib/database.ts`

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms

1. Build the application: `npm run build`
2. Deploy the `.next` folder to your hosting platform
3. Configure environment variables

## Troubleshooting

### Common Issues

1. **Firebase Connection**: Verify environment variables are correct
2. **QR Code Generation**: Ensure qrcode library is installed
3. **Camera Access**: Check browser permissions for camera access
4. **Database Rules**: Ensure Firestore rules allow read/write access

### Support

For issues and questions:
1. Check the console for error messages
2. Verify Firebase configuration
3. Ensure all dependencies are installed
4. Check browser compatibility for camera features

## License

This project is open source and available under the MIT License.
