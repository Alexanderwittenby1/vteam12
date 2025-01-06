"use client"

import React, { ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { toast, Toaster } from 'sonner'; // Importera Toaster
import { changePassword } from '../../app/api/changePassword/route';
import { redirect, Redirect } from 'next/navigation';

interface FormData {
  newPassword: string;
}

interface ChangePasswordProps {
  token: string;
  user: ReactNode;
}

const ChangePassword: React.FC<ChangePasswordProps> = ({ token, user }) => {
  console.log("token in ChangePassword", token);
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    console.log(data.newPassword);
    const success = await changePassword(data.newPassword, token);
    console.log(success);

    if (success) {
      toast.success('Password changed successfully');
      redirect('/profile');
      
    } else {
      toast.error('Failed to change password');
    }
  };

  return (
    <div className="container rounded bg-white mt-5 mb-5">
      <Toaster position="top-right" /> {/* Lägg till Toaster-komponenten */}
      <div className="row">
        <div className="col-md-3 border-right">
          <div className="d-flex flex-column align-items-center text-center p-3 py-5">
            <img className="rounded-circle mt-5" width="150px" src="https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg" alt="Profile" />
            <span className="font-weight-bold"></span>
            <span className="text-black-50">{user.email}</span>
          </div>
        </div>
        <div className="col-md-5 border-right">
          <div className="p-3 py-5">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="text-right">Profile Settings</h4>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="row mt-2">
                <div className="col-md-12">
                  <label className="labels" htmlFor="newPassword">New Password</label>
                  <input
                    id="newPassword"
                    type="password"
                    placeholder="******"
                    autoComplete="new-password"
                    {...register('newPassword', { required: 'New password is required', minLength: { value: 6, message: 'Password must be at least 6 characters long' } })}
                    className="form-control"
                  />
                  {errors.newPassword && <p className="text-danger mt-1">{errors.newPassword.message}</p>}
                </div>
              </div>
              <div className="mt-5 text-center">
                <button type="submit" className="btn btn-primary profile-button">Change Password</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;