'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';

interface User {
  userId: string;
  name: string;
  email: string;
  phone: string;
  unique_id: string;
  profilePic: string;
}

export default function UserDetailsPage() {
  const [user, setUser] = useState<User | null>(null);
  const params = useParams();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/users/${params.userId}`);
        setUser(response.data.user);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };
    fetchUser();
  }, [params.userId]);

  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link');
    }
  };

  const shareOnWhatsApp = () => {
    const url = window.location.href;
    const text = `Check out ${user?.name}'s profile!`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
  };

  const shareToSpecificWhatsApp = () => {
    const phoneNumber = prompt('Enter WhatsApp number (with country code):');
    if (phoneNumber) {
      const url = window.location.href;
      const text = `Hi! Check out ${user?.name}'s profile:`;
      window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <Link href="/users" className="text-blue-600 hover:text-blue-800">
              ← Back to Users
            </Link>
            <div className="flex gap-2">
              <button
                onClick={copyLink}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 ${copied ? 'bg-green-500 text-white' : 'bg-gray-500 hover:bg-gray-600 text-white'}`}
              >
                {copied ? '✓ Copied!' : '📋 Copy Link'}
              </button>
              <button
                onClick={shareOnWhatsApp}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                📱 Share WhatsApp
              </button>
              <button
                onClick={shareToSpecificWhatsApp}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                👤 Send to Person
              </button>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <img
              src={user.profilePic}
              alt={user.name}
              className="w-32 h-32 rounded-full mx-auto mb-4"
            />
            <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
          </div>
          <div className="space-y-4">
            <div className="border-b pb-4">
              <label className="block text-sm font-medium text-gray-500">Email</label>
              <p className="text-lg text-gray-900">{user.email}</p>
            </div>
            <div className="border-b pb-4">
              <label className="block text-sm font-medium text-gray-500">Phone</label>
              <p className="text-lg text-gray-900">{user.phone}</p>
            </div>
            <div className="border-b pb-4">
              <label className="block text-sm font-medium text-gray-500">User ID</label>
              <p className="text-lg text-gray-900">{user.unique_id}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Internal ID</label>
              <p className="text-lg text-gray-900 font-mono">{user.userId}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}