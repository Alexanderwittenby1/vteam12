import React, { useState } from 'react';
import { AlertCircle, Check, X, EyeOff, Eye } from 'lucide-react';
import Cookies from 'js-cookie';

interface ChangePasswordFormProps {
  onBack: () => void;
  user?: {
    user_id: number;
    email: string;
  };
}

const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({ onBack, user }) => {
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';



  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const token = Cookies.get('token');
      
      if (!token) {
        throw new Error('You need to be logged in');
      }

      // Check if passwords match

      if (newPassword !== confirmPassword) {
        throw new Error('New passwords do not match');
      }

      const response = await fetch(`${API_BASE_URL}/user/updatePassword`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          password: newPassword
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: `HTTP error! status: ${response.status}`
        }));
        throw new Error(errorData.message || 'Failed to update password');
      }

      const data = await response.json();
      console.log('Password updated successfully:', data);
      
      setSuccess(true);
      setTimeout(() => {
        onBack();
      }, 1500);

    } catch (err) {
      console.error('Error updating password:', err);
      setError(err instanceof Error ? err.message : 'Failed to update password');
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
        <h2 className="text-xl font-semibold ml-2">Change Password</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          {/* New Password Field */}
          <div className="mb-4">
            <label 
              htmlFor="newPassword" 
              className="block text-sm text-gray-600 mb-2"
            >
              New Password
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                disabled={isLoading || success}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                aria-label={showNewPassword ? "Hide password" : "Show password"}
              >
                {showNewPassword ? <EyeOff className="h-5 w-5 text-gray-500" /> : <Eye className="h-5 w-5 text-gray-500" />}
              </button>
            </div>
          </div>

          {/* Confirm Password Field */}
          <div>
            <label 
              htmlFor="confirmPassword" 
              className="block text-sm text-gray-600 mb-2"
            >
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                disabled={isLoading || success}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5 text-gray-500" /> : <Eye className="h-5 w-5 text-gray-500" />}
              </button>
            </div>
          </div>
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
            <span>Password updated successfully!</span>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || success || !newPassword || !confirmPassword}
          className={`w-full p-3 rounded-lg font-medium text-white
            ${isLoading || success || !newPassword || !confirmPassword
              ? 'bg-blue-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {isLoading ? 'Updating...' : success ? 'Updated!' : 'Update Password'}
        </button>
      </form>
    </div>
  );
};

export default ChangePasswordForm;