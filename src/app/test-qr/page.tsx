'use client';

import { useState } from 'react';
import { generateQRCode } from '@/lib/qrCode';
import { QRCodeData } from '@/types';
import { ArrowLeft, Download } from 'lucide-react';
import Link from 'next/link';

export default function TestQRPage() {
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const generateTestQR = async () => {
    setLoading(true);
    try {
      const testData: QRCodeData = {
        staffId: '123456',
        lastName: 'Li',
        participantId: 'test-participant-123',
      };
      
      const qrUrl = await generateQRCode(testData);
      setQrCodeUrl(qrUrl);
    } catch (error) {
      console.error('Error generating QR code:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadQR = () => {
    if (qrCodeUrl) {
      const link = document.createElement('a');
      link.download = 'test-qr-code.png';
      link.href = qrCodeUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
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
            Test QR Code Generator
          </h1>
          <p className="text-gray-600">
            Generate a test QR code for scanning
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Generate Test QR Code
          </h2>
          
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">Test Data:</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>Staff ID: 123456</li>
                <li>Last Name: Li</li>
                <li>Participant ID: test-participant-123</li>
              </ul>
            </div>

            <button
              onClick={generateTestQR}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                'Generate Test QR Code'
              )}
            </button>

            {qrCodeUrl && (
              <div className="text-center">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Test QR Code
                  </h3>
                  <div className="flex justify-center mb-4">
                    <img 
                      src={qrCodeUrl} 
                      alt="Test QR Code" 
                      className="border-2 border-gray-200 rounded-lg"
                    />
                  </div>
                  <button
                    onClick={downloadQR}
                    className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 flex items-center mx-auto"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download QR Code
                  </button>
                  <p className="text-sm text-gray-600 mt-2">
                    Use this QR code to test the Game Host Scanner
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
