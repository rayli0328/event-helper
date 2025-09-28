'use client';

import { Shield, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <Shield className="w-16 h-16 text-red-400 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Access Denied
        </h1>
        <p className="text-gray-600 mb-6">
          You don't have permission to access this page. Please contact your administrator if you believe this is an error.
        </p>
        
        <div className="space-y-3">
          <Link
            href="/"
            className="inline-flex items-center bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Home
          </Link>
          
          <div className="text-sm text-gray-500">
            <p>Need access? Contact your administrator with your email address.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
