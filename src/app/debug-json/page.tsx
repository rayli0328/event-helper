'use client';

import { useState } from 'react';
import { generateQRCode } from '@/lib/qrCode';
import { QRCodeData } from '@/types';
import { ArrowLeft, Copy } from 'lucide-react';
import Link from 'next/link';

export default function DebugJSONPage() {
  const [jsonData, setJsonData] = useState('');
  const [copied, setCopied] = useState(false);

  const generateSampleData = () => {
    const sampleData: QRCodeData = {
      staffId: '123456',
      lastName: 'Li',
      participantId: 'test-participant-123',
    };
    
    const jsonString = JSON.stringify(sampleData);
    setJsonData(jsonString);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(jsonData);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
            JSON Data Debug
          </h1>
          <p className="text-gray-600">
            See exactly what JSON data looks like for QR code scanning
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Sample QR Code Data
            </h2>
            
            <button
              onClick={generateSampleData}
              className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 mb-4"
            >
              Generate Sample JSON Data
            </button>

            {jsonData && (
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">JSON Data:</h3>
                  <pre className="text-sm text-gray-700 bg-white p-3 rounded border overflow-x-auto">
                    {jsonData}
                  </pre>
                  <button
                    onClick={copyToClipboard}
                    className="mt-2 bg-green-600 text-white py-1 px-3 rounded text-sm hover:bg-green-700 flex items-center"
                  >
                    <Copy className="w-4 h-4 mr-1" />
                    {copied ? 'Copied!' : 'Copy to Clipboard'}
                  </button>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="font-medium text-blue-900 mb-2">How to Use:</h3>
                  <ol className="text-sm text-blue-700 space-y-1">
                    <li>1. Copy the JSON data above</li>
                    <li>2. Go to Game Host Scanner page</li>
                    <li>3. Select a game from the dropdown</li>
                    <li>4. Paste the JSON data in the manual input field</li>
                    <li>5. The system should recognize the participant</li>
                  </ol>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              What This JSON Contains:
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="font-medium">staffId:</span>
                <span className="text-gray-600">123456</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">lastName:</span>
                <span className="text-gray-600">Li</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">participantId:</span>
                <span className="text-gray-600">test-participant-123</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
