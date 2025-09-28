'use client';

import { useState, useEffect, useRef } from 'react';
import { parseQRCode } from '@/lib/qrCode';
import { getParticipant, updateParticipantGames, createGameCompletion, getActiveGames, getParticipantByStaffIdAndLastName } from '@/lib/database';
import { QRCodeData, Game } from '@/types';
import { ArrowLeft, Camera, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';
import QrScanner from 'qr-scanner';
import ProgressTracker from '@/components/ProgressTracker';

export default function HostPage() {
  const [selectedGame, setSelectedGame] = useState('');
  const [games, setGames] = useState<Game[]>([]);
  const [scannedData, setScannedData] = useState<QRCodeData | null>(null);
  const [participant, setParticipant] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');
  const [isScanning, setIsScanning] = useState(false);
  const [manualStaffId, setManualStaffId] = useState('');
  const [manualLastName, setManualLastName] = useState('');
  const [showProgress, setShowProgress] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const qrScannerRef = useRef<QrScanner | null>(null);

  useEffect(() => {
    loadGames();
  }, []);

  // Cleanup QR scanner on unmount
  useEffect(() => {
    return () => {
      if (qrScannerRef.current) {
        qrScannerRef.current.destroy();
      }
    };
  }, []);

  const loadGames = async () => {
    try {
      const activeGames = await getActiveGames();
      setGames(activeGames);
    } catch (error) {
      console.error('Error loading games:', error);
    }
  };

  const handleQRScan = (qrData: string) => {
    if (!qrData.trim()) {
      setMessage('Please enter QR code data');
      setMessageType('error');
      return;
    }
    
    const parsedData = parseQRCode(qrData);
    if (parsedData) {
      setScannedData(parsedData);
      loadParticipant(parsedData.participantId);
      setMessage('QR code scanned successfully!');
      setMessageType('success');
      
      // Stop the camera after successful scan
      if (qrScannerRef.current) {
        qrScannerRef.current.destroy();
        qrScannerRef.current = null;
        setIsScanning(false);
      }
    } else {
      setMessage('Invalid QR code format. Please check the QR code data.');
      setMessageType('error');
    }
  };

  const loadParticipant = async (participantId: string) => {
    try {
      const participantData = await getParticipant(participantId);
      setParticipant(participantData);
    } catch (error) {
      setMessage('Participant not found');
      setMessageType('error');
    }
  };

  const handleMarkComplete = async () => {
    if (!selectedGame || !scannedData) return;

    setLoading(true);
    try {
      // Check if already completed this game
      if (participant?.completedGames?.includes(selectedGame)) {
        setMessage('Participant has already completed this game');
        setMessageType('error');
        setLoading(false);
        return;
      }

      // Update participant's completed games
      await updateParticipantGames(scannedData.participantId, selectedGame);
      
      // Create game completion record
      await createGameCompletion({
        participantId: scannedData.participantId,
        gameId: selectedGame,
        hostId: 'current-host', // In real app, get from auth
      });

      setMessage('🎉 Game marked as completed successfully! Participant progress updated!');
      setMessageType('success');
      
      // Refresh participant data to show updated progress
      if (scannedData) {
        const updatedParticipant = await getParticipant(scannedData.participantId);
        setParticipant(updatedParticipant);
      }
      
      // Reset form
      setScannedData(null);
      setParticipant(null);
    } catch (error) {
      setMessage('Failed to mark game as completed');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const startCamera = async () => {
    try {
      // Wait a moment for the video element to be rendered
      await new Promise(resolve => setTimeout(resolve, 200));
      
      if (!videoRef.current) {
        setMessage('Video element not found. Please try again.');
        setMessageType('error');
        return;
      }

      // Check if we're on mobile and provide better instructions
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      if (isMobile) {
        setMessage('On mobile: Make sure you allow camera access when prompted. If denied, check browser settings.');
        setMessageType('success');
      }

      // Stop any existing scanner
      if (qrScannerRef.current) {
        qrScannerRef.current.destroy();
        qrScannerRef.current = null;
      }

      // Ensure video element is visible
      if (videoRef.current) {
        videoRef.current.style.display = 'block';
      }

      // Create new QR scanner with mobile-friendly settings
      const qrScanner = new QrScanner(
        videoRef.current,
        (result) => {
          console.log('QR Code detected:', result.data);
          handleQRScan(result.data);
        },
        {
          onDecodeError: (error) => {
            // Silently handle decode errors (normal when no QR code is visible)
            console.log('QR decode error:', error);
          },
          highlightScanRegion: true,
          highlightCodeOutline: true,
          preferredCamera: 'environment', // Use back camera on mobile
          maxScansPerSecond: 5, // Reduce scanning frequency for better performance
        }
      );

      await qrScanner.start();
      qrScannerRef.current = qrScanner;
      setIsScanning(true);
      setMessage('Camera started. Point at QR code to scan.');
      setMessageType('success');
    } catch (error) {
      console.error('Camera error:', error);
      
      // Provide specific mobile troubleshooting
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      if (isMobile) {
        setMessage('Camera access denied on mobile. Try: 1) Allow camera permission 2) Use HTTPS 3) Try manual input instead');
        setMessageType('error');
      } else {
        setMessage('Camera access denied. Please allow camera access and try again.');
        setMessageType('error');
      }
    }
  };

  const stopCamera = () => {
    if (qrScannerRef.current) {
      qrScannerRef.current.destroy();
      qrScannerRef.current = null;
    }
    setIsScanning(false);
    setMessage('Camera stopped');
    setMessageType('success');
  };

  const handleManualEntry = async () => {
    if (!manualStaffId.trim() || !manualLastName.trim()) {
      setMessage('Please enter both Staff ID and Last Name');
      setMessageType('error');
      return;
    }

    try {
      // Find participant by staff ID
      const participantData = await getParticipantByStaffIdAndLastName(manualStaffId, manualLastName);
      if (participantData) {
        const qrData: QRCodeData = {
          staffId: manualStaffId,
          lastName: manualLastName,
          participantId: participantData.id,
        };
        setScannedData(qrData);
        setParticipant(participantData);
        setMessage('Participant found successfully!');
        setMessageType('success');
      } else {
        setMessage('Participant not found. Please check Staff ID and Last Name.');
        setMessageType('error');
      }
    } catch (error) {
      setMessage('Error finding participant. Please try again.');
      setMessageType('error');
    }
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link 
            href="/" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Game Host Scanner
          </h1>
          <p className="text-gray-600">
            Scan participant QR codes to mark games as completed
          </p>
        </div>

        {/* Messages at the top */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            messageType === 'success' 
              ? 'bg-green-100 border border-green-400 text-green-700'
              : 'bg-red-100 border border-red-400 text-red-700'
          }`}>
            {message}
          </div>
        )}

        <div className="space-y-6">
          {/* Game Selection */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Select Game
            </h2>
            <select
              value={selectedGame}
              onChange={(e) => setSelectedGame(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Choose a game...</option>
              {games.map((game) => (
                <option key={game.id} value={game.id}>
                  {game.name}
                </option>
              ))}
            </select>
          </div>

          {/* QR Scanner */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Scan QR Code
            </h2>
            
            <div className="space-y-4">
              {!isScanning ? (
                <button
                  onClick={startCamera}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 flex items-center justify-center"
                >
                  <Camera className="w-5 h-5 mr-2" />
                  Start Camera
                </button>
              ) : (
                <button
                  onClick={stopCamera}
                  className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700"
                >
                  Stop Camera
                </button>
              )}
              
              {/* Always render video element */}
              <div className="relative">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`w-full h-64 bg-gray-100 rounded-lg ${isScanning ? 'block' : 'hidden'}`}
                />
                <canvas ref={canvasRef} className="hidden" />
                {isScanning && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="bg-black bg-opacity-50 text-white p-4 rounded-lg text-center">
                      <p className="text-sm font-semibold">Position QR code within the scanning area</p>
                      <p className="text-xs mt-1">Hold steady for best results</p>
                    </div>
                  </div>
                )}
                {!isScanning && (
                  <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-gray-500 text-center">
                      <Camera className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Camera will appear here when started</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Manual Entry */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Or enter participant details manually:
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Staff ID</label>
                  <input
                    type="text"
                    value={manualStaffId}
                    onChange={(e) => setManualStaffId(e.target.value)}
                    placeholder="Enter Staff ID"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Last Name</label>
                  <input
                    type="text"
                    value={manualLastName}
                    onChange={(e) => setManualLastName(e.target.value)}
                    placeholder="Enter Last Name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>
              <button
                onClick={handleManualEntry}
                className="mt-3 w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700"
              >
                Find Participant
              </button>
            </div>
          </div>

          {/* Scanned Participant Info */}
          {scannedData && participant && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Participant Information
              </h2>
              <div className="space-y-2">
                <p><strong>Staff ID:</strong> {scannedData.staffId}</p>
                <p><strong>Name:</strong> {scannedData.lastName}</p>
                <p><strong>Completed Games:</strong> {participant.completedGames?.length || 0}</p>
              </div>

              {selectedGame && (
                <div className="mt-4">
                  {participant.completedGames?.includes(selectedGame) ? (
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Already completed this game
                    </div>
                  ) : (
                    <button
                      onClick={handleMarkComplete}
                      disabled={loading}
                      className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {loading ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      ) : (
                        <>
                          <CheckCircle className="w-5 h-5 mr-2" />
                          Mark Game as Completed
                        </>
                      )}
                    </button>
                  )}
                </div>
              )}

              {/* Progress Tracker Toggle */}
              <div className="mt-6">
                <button
                  onClick={() => setShowProgress(!showProgress)}
                  className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700"
                >
                  {showProgress ? 'Hide' : 'Show'} Participant's Stamp Collection Progress
                </button>
                {showProgress && (
                  <div className="mt-4">
                    <ProgressTracker staffId={scannedData.staffId} lastName={scannedData.lastName} />
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
