'use client';

import { useState, useRef, useEffect } from 'react';
import { parseQRCode } from '@/lib/qrCode';
import { getParticipant, getActiveGames } from '@/lib/database';
import { QRCodeData, Game } from '@/types';
import { ArrowLeft, Camera, Trophy, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';
import QrScanner from 'qr-scanner';

export default function GiftCornerPage() {
  const [scannedData, setScannedData] = useState<QRCodeData | null>(null);
  const [participant, setParticipant] = useState<any>(null);
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');
  const [isScanning, setIsScanning] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
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
    setLoading(true);
    try {
      const participantData = await getParticipant(participantId);
      setParticipant(participantData);
      setMessage('');
      setMessageType('');
    } catch (error) {
      setMessage('Participant not found');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const startCamera = async () => {
    try {
      // Wait a moment for the video element to be rendered
      await new Promise(resolve => setTimeout(resolve, 100));
      
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

  const isEligibleForGift = () => {
    if (!participant || !games.length) return false;
    return participant.completedGames?.length >= games.length;
  };

  const getCompletionStatus = () => {
    if (!participant || !games.length) return { completed: 0, total: 0 };
    return {
      completed: participant.completedGames?.length || 0,
      total: games.length
    };
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
            Gift Corner
          </h1>
          <p className="text-gray-600">
            Scan participant QR codes to verify all games completed
          </p>
        </div>

        <div className="space-y-6">
          {/* QR Scanner */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Scan Participant QR Code
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
                  className="w-full h-64 bg-gray-100 rounded-lg"
                  style={{ display: isScanning ? 'block' : 'none' }}
                />
              </div>
            </div>

            {/* Manual QR Input */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Or enter QR code data manually:
              </label>
              <textarea
                placeholder="Paste QR code data here..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                onChange={(e) => handleQRScan(e.target.value)}
              />
            </div>
          </div>

          {/* Participant Verification */}
          {scannedData && participant && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Participant Verification
              </h2>
              
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">Participant Details</h3>
                  <p><strong>Staff ID:</strong> {scannedData.staffId}</p>
                  <p><strong>Name:</strong> {scannedData.lastName}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">Game Completion Status</h3>
                  <div className="flex items-center justify-between mb-2">
                    <span>Games Completed:</span>
                    <span className="font-semibold">
                      {getCompletionStatus().completed} / {getCompletionStatus().total}
                    </span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${(getCompletionStatus().completed / getCompletionStatus().total) * 100}%` 
                      }}
                    ></div>
                  </div>

                  <div className="space-y-2">
                    {games.map((game) => {
                      const isCompleted = participant.completedGames?.includes(game.id);
                      return (
                        <div key={game.id} className="flex items-center justify-between">
                          <span className="text-sm">{game.name}</span>
                          {isCompleted ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-600" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Gift Eligibility */}
                <div className={`p-4 rounded-lg ${
                  isEligibleForGift() 
                    ? 'bg-green-100 border border-green-400' 
                    : 'bg-yellow-100 border border-yellow-400'
                }`}>
                  {isEligibleForGift() ? (
                    <div className="text-center">
                      <Trophy className="w-12 h-12 text-green-600 mx-auto mb-2" />
                      <h3 className="text-lg font-semibold text-green-800 mb-2">
                        🎉 Congratulations! 🎉
                      </h3>
                      <p className="text-green-700 mb-4">
                        This participant has completed all {games.length} games and is eligible for a gift!
                      </p>
                      <button className="bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700">
                        Give Gift
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <XCircle className="w-12 h-12 text-yellow-600 mx-auto mb-2" />
                      <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                        Not Yet Eligible
                      </h3>
                      <p className="text-yellow-700">
                        This participant needs to complete {getCompletionStatus().total - getCompletionStatus().completed} more game(s) to be eligible for a gift.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Messages */}
          {message && (
            <div className={`p-4 rounded-lg ${
              messageType === 'success' 
                ? 'bg-green-100 border border-green-400 text-green-700'
                : 'bg-red-100 border border-red-400 text-red-700'
            }`}>
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
