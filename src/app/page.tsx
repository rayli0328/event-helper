'use client';

import Link from 'next/link';
import { QrCode, Users, Trophy, Settings, LogIn, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function Home() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <div className="flex justify-between items-center mb-4">
            <div></div>
            <h1 className="text-4xl font-bold text-gray-900">
              Event Helper
            </h1>
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">
                    {user.email}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="inline-flex items-center text-red-600 hover:text-red-800"
                  >
                    <LogOut className="w-4 h-4 mr-1" />
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="inline-flex items-center text-blue-600 hover:text-blue-800"
                >
                  <LogIn className="w-4 h-4 mr-1" />
                  Login
                </Link>
              )}
            </div>
          </div>
          <p className="text-xl text-gray-600">
            QR Code Game Management System
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link 
            href="/participant"
            className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 text-center hover:scale-105"
          >
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
              <QrCode className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Generate QR Code
            </h3>
            <p className="text-gray-600 text-sm">
              Create your unique QR code with staff ID and last name
            </p>
          </Link>

          <Link 
            href="/host"
            className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 text-center hover:scale-105"
          >
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
              <Users className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Game Host
            </h3>
            <p className="text-gray-600 text-sm">
              Scan participant QR codes to mark games as completed
            </p>
          </Link>

          <Link 
            href="/gift-corner"
            className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 text-center hover:scale-105"
          >
            <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-yellow-200 transition-colors">
              <Trophy className="w-8 h-8 text-yellow-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Gift Corner
            </h3>
            <p className="text-gray-600 text-sm">
              Verify all 6 games completed and give gifts
            </p>
          </Link>

          <Link 
            href="/admin"
            className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 text-center hover:scale-105"
          >
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
              <Settings className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Admin Panel
            </h3>
            <p className="text-gray-600 text-sm">
              Manage games, hosts, and view analytics
            </p>
          </Link>
        </div>


        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm">
            Select your role to get started with the event management system
          </p>
        </div>
      </div>
    </div>
  );
}
