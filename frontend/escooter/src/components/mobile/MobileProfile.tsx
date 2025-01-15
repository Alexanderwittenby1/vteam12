'use client';

import React, { useState } from 'react';
import { Settings, Wallet, Receipt, MessageSquare, ChevronRight, Bike, Gift, MessageCircle } from 'lucide-react';
import RecentTransactions from '../UserDashboard/RecentTransactions';
import ChangeEmailForm from '@/components/account/ChangeNameForm';
import ChangePasswordForm from '@/components/account/ChangePasswordForm';
import MicromobilityReport from './MicromobilityReport';
import Cookies from 'js-cookie';

interface User {
  user_id: number;
  email: string;
  name?: string;
  balance: number;
}

interface MobileProfileProps {
  initialUser: User;
}

const MobileProfile: React.FC<MobileProfileProps> = ({ initialUser }) => {
  const [activeView, setActiveView] = useState('main');
  const [user, setUser] = useState(initialUser);

  const AccountSettings = () => {
    const [showEmailForm, setShowEmailForm] = useState(false);
    const [showPasswordForm, setShowPasswordForm] = useState(false);

    const token = Cookies.get('token');

    if (showEmailForm) {
      return (
        <ChangeEmailForm 
          onBack={() => setShowEmailForm(false)} 
          user={user}
        />
      );
    } else if (showPasswordForm) {
      return (
        <ChangePasswordForm 
          onBack={() => setShowPasswordForm(false)} 
          user={user}
          token={token} // Add this line
        />
      );
    }

    return (
      <div className="space-y-4 p-4">
        <h2 className="text-xl font-semibold mb-6">Account Settings</h2>
        <button 
          onClick={() => setShowEmailForm(true)}
          className="w-full p-4 bg-white rounded-lg shadow-sm flex items-center justify-between"
        >
          <span>Change Email</span>
          <ChevronRight className="h-5 w-5 text-gray-400" />
        </button>
        <button 
          onClick={() => setShowPasswordForm(true)}
          className="w-full p-4 bg-white rounded-lg shadow-sm flex items-center justify-between"
        >
          <span>Change Password</span>
          <ChevronRight className="h-5 w-5 text-gray-400" />
        </button>
        <button className="w-full p-4 bg-red-50 rounded-lg shadow-sm flex items-center justify-between text-red-600">
          <span>Delete Account</span>
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    );
  };

  const WalletView = () => (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-6">Wallet</h2>
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <p className="text-gray-500 mb-2">Current Balance</p>
        <p className="text-3xl font-bold">{user.balance} kr</p>
      </div>
    </div>
  );

  const MainView = () => (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Hi there, {user.name || 'User'}!</h1>
        <button 
          onClick={() => setActiveView('account')}
          className="flex items-center space-x-2 px-4 py-2 rounded-full border border-gray-200"
        >
          <Settings className="h-5 w-5" />
          <span>Account</span>
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <button 
          onClick={() => setActiveView('wallet')}
          className="p-4 bg-white rounded-lg shadow-sm flex flex-col items-center"
        >
          <Wallet className="h-6 w-6 mb-2" />
          <span>Wallet</span>
        </button>
        <button 
          onClick={() => setActiveView('receipts')}
          className="p-4 bg-white rounded-lg shadow-sm flex flex-col items-center"
        >
          <Receipt className="h-6 w-6 mb-2" />
          <span>Receipts</span>
        </button>
        <button 
          onClick={() => setActiveView('helpCenter')}
          className="p-4 bg-white rounded-lg shadow-sm flex flex-col items-center"
        >
          <MessageSquare className="h-6 w-6 mb-2" />
          <span>Help Center</span>
        </button>
      </div>

      <div className="space-y-4">
        <div className="bg-white p-4 rounded-lg shadow-sm flex items-center space-x-4">
          <Bike className="h-8 w-8" />
          <div className="flex-1">
            <h3 className="font-semibold">Activity Score</h3>
            <p className="text-gray-500">Understand your parking</p>
          </div>
          <ChevronRight className="h-5 w-5 text-gray-400" />
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm flex items-center space-x-4">
          <Gift className="h-8 w-8" />
          <div className="flex-1">
            <h3 className="font-semibold">Invite friends</h3>
            <p className="text-gray-500">Get 100,00 kr in ride credits</p>
          </div>
          <ChevronRight className="h-5 w-5 text-gray-400" />
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm flex items-center space-x-4">
          <MessageCircle className="h-8 w-8" />
          <div className="flex-1">
            <h3 className="font-semibold">Give us some feedback</h3>
            <p className="text-gray-500">Help us make a better service</p>
          </div>
          <ChevronRight className="h-5 w-5 text-gray-400" />
        </div>
      </div>
    </div>
  );

  const renderView = () => {
    switch (activeView) {
      case 'account':
        return user ? <AccountSettings /> : null;
      case 'wallet':
        return <WalletView />;
      case 'receipts':
        return (
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-6">Recent Transactions</h2>
            <RecentTransactions />
          </div>
        );
      case 'helpCenter':
        return <MicromobilityReport />;
      default:
        return <MainView />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {activeView !== 'main' && (
        <button 
          onClick={() => setActiveView('main')}
          className="p-4 text-blue-600 flex items-center space-x-2"
        >
          <ChevronRight className="h-5 w-5 rotate-180" />
          <span>Back</span>
        </button>
      )}
      {renderView()}
    </div>
  );
};

export default MobileProfile;

