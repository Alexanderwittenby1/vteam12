import React, { useState, useEffect } from 'react';
import { AlertCircle, Check, X } from 'lucide-react';
import Cookies from 'js-cookie';

interface ChangeEmailFormProps {
  onBack: () => void;
  user?: {
    user_id: number;
    email: string;
  };
}

const ChangeEmailForm: React.FC<ChangeEmailFormProps> = ({ onBack, user }) => {
  const [newEmail, setNewEmail] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

  useEffect(() => {
    if (user?.email) {
      setNewEmail(user.email);
    }
  }, [user]);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const token = Cookies.get('token'); 
      console.log('Token:', token);
      
      
      if (!user?.user_id || !token) {
        throw new Error('You need to be logged in');
      }

      // Validate email before sending
      if (!validateEmail(newEmail.trim())) {
        throw new Error('Please enter a valid email address');
      }

      // Check if new email is different from current email
      if (newEmail.trim() === user.email) {
        throw new Error('New email must be different from current email');
      }

      const response = await fetch(`${API_BASE_URL}/user/updatePassword`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email: newEmail.trim()
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: `HTTP error! status: ${response.status}`
        }));
        throw new Error(errorData.message || 'Failed to update email');
      }

      const data = await response.json();
      console.log('Email updated successfully:', data);
      
      setSuccess(true);
      setTimeout(() => {
        onBack();
      }, 1500);

    } catch (err) {
      console.error('Error updating email:', err);
      setError(err instanceof Error ? err.message : 'Failed to update email');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return <div className="p-4 text-gray-600">Loading user data...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="flex items-center mb-6">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-full"
          type="button"
          aria-label="Go back"
        >
          <X className="h-6 w-6" />
        </button>
        <h2 className="text-xl font-semibold ml-2">Change Email</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <label 
            htmlFor="email" 
            className="block text-sm text-gray-600 mb-2"
          >
            Enter new email address
          </label>
          <input
            type="email"
            id="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="your.new@email.com"
            required
            disabled={isLoading || success}
          />
        </div>

        {error && (
          <div className="bg-red-50 p-3 rounded-lg flex items-center gap-2 text-red-600">
            <AlertCircle className="h-5 w-5" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-green-50 p-3 rounded-lg flex items-center gap-2 text-green-600">
            <Check className="h-5 w-5" />
            <span>Email updated successfully!</span>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || success || !validateEmail(newEmail.trim()) || newEmail.trim() === user.email}
          className={`w-full p-3 rounded-lg font-medium text-white
            ${isLoading || success || !validateEmail(newEmail.trim()) || newEmail.trim() === user.email
              ? 'bg-blue-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {isLoading ? 'Updating...' : success ? 'Updated!' : 'Update Email'}
        </button>
      </form>
    </div>
  );
};

export default ChangeEmailForm;