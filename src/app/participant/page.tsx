'use client';

import { useState } from 'react';
import { generateQRCode, downloadQRCode } from '@/lib/qrCode';
import { createParticipant, getParticipantByStaffId } from '@/lib/database';
import { QRCodeData } from '@/types';
import { ArrowLeft, Download, QrCode } from 'lucide-react';
import Link from 'next/link';

export default function ParticipantPage() {
  const [staffId, setStaffId] = useState('');
  const [lastName, setLastName] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleGenerateQR = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Check if participant already exists
      const existingParticipant = await getParticipantByStaffId(staffId);
      
      if (existingParticipant) {
        // Generate QR code for existing participant
        const qrData: QRCodeData = {
          staffId: existingParticipant.staffId,
          lastName: existingParticipant.lastName,
          participantId: existingParticipant.id,
        };
        const qrUrl = await generateQRCode(qrData);
        setQrCodeUrl(qrUrl);
        setSuccess('QR code generated for existing participant!');
      } else {
        // Create new participant
        const participantId = await createParticipant({
          staffId,
          lastName,
          qrCode: '', // Will be generated
          completedGames: [],
        });

        const qrData: QRCodeData = {
          staffId,
          lastName,
          participantId,
        };
        const qrUrl = await generateQRCode(qrData);
        setQrCodeUrl(qrUrl);
        setSuccess('New participant created and QR code generated!');
      }
    } catch (err) {
      setError('Failed to generate QR code. Please try again.');
      console.error('Error generating QR code:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (qrCodeUrl) {
      downloadQRCode(qrCodeUrl, `qr-code-${staffId}-${lastName}.png`);
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
            Generate Your QR Code
          </h1>
          <p className="text-gray-600">
            Enter your staff ID and last name to generate your unique QR code
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <form onSubmit={handleGenerateQR} className="space-y-4">
            <div>
              <label htmlFor="staffId" className="block text-sm font-medium text-gray-700 mb-2">
                Staff ID
              </label>
              <input
                type="text"
                id="staffId"
                value={staffId}
                onChange={(e) => setStaffId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your staff ID"
                required
              />
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your last name"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <QrCode className="w-5 h-5 mr-2" />
                  Generate QR Code
                </>
              )}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {success && (
            <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
              {success}
            </div>
          )}

          {qrCodeUrl && (
            <div className="mt-6 text-center">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Your QR Code
                </h3>
                <div className="flex justify-center mb-4">
                  <img 
                    src={qrCodeUrl} 
                    alt="QR Code" 
                    className="border-2 border-gray-200 rounded-lg"
                  />
                </div>
                <button
                  onClick={handleDownload}
                  className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 flex items-center mx-auto"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download QR Code
                </button>
                <p className="text-sm text-gray-600 mt-2">
                  Save this QR code to your mobile device. Game hosts will scan it to mark your game completions.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
