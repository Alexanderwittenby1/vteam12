'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { sendMessage, registerMessageHandler } from '../websocketClient';

interface Scooter {
  scooter_id: number;
  latitude: string;
  longitude: string;
  battery_level: string;
  status: string;
  is_available: number;
}

interface BookingPanelProps {
  show: boolean;
  onClose: () => void;
  userData: {
    user_id: number;
    balance: number;
  };
  scooter: Scooter;
}

export default function BookingPanel({ show, onClose, userData, scooter }: BookingPanelProps) {
  const [rideTime, setRideTime] = useState<number | null>(null);
  const [rideStarted, setRideStarted] = useState<boolean>(false);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [startTime, setStartTime] = useState<string>('');
  const [startLocation, setStartLocation] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isEndingRide, setIsEndingRide] = useState<boolean>(false);
  const [isStartingRide, setIsStartingRide] = useState<boolean>(false);
  const router = useRouter();

  // Check if the scooter is available for riding
  const isScooterAvailable = scooter.status.toLowerCase() === 'available' && scooter.is_available === 1;
  
  // Check if user can start a ride (has sufficient balance and scooter is available)
  const canStartRide = userData?.balance >= 20 && isScooterAvailable;

  const handleRideEnd = useCallback(() => {
    setRideTime(Math.floor(elapsedTime / 1000));
    setRideStarted(false);
    setIsEndingRide(false);
    
    setTimeout(() => {
      onClose();
      router.refresh();
    }, 3000);
  }, [elapsedTime, onClose, router]);

  useEffect(() => {
    const handleMessage = (data: any) => {
      console.log('WebSocket message received:', data);
      
      if (data.action === 'ride_update') {
        setElapsedTime(data.elapsedTime);
        setStartTime(data.readableStartTime);
      }
      
      if (data.message === 'Message received' && isEndingRide) {
        handleRideEnd();
      }

      if (data.status === 'error') {
        setError(data.message || 'An error occurred');
        setIsEndingRide(false);
        setIsStartingRide(false);
      }
    };

    registerMessageHandler(handleMessage);
  }, [handleRideEnd, isEndingRide]);

  const startRide = async () => {
    if (!canStartRide) {
      setError(
        !isScooterAvailable 
          ? 'This scooter is not available for rent' 
          : 'Insufficient balance to start ride'
      );
      return;
    }

    try {
      setIsStartingRide(true);
      const startLocationPoint = `POINT(${scooter.longitude} ${scooter.latitude})`;
      setStartLocation(startLocationPoint);

      const message = {
        action: 'start_ride',
        message: 'Starting ride!',
        userId: userData.user_id,
        scooterId: scooter.scooter_id,
        startTime: new Date().toISOString(),
        startLocation: startLocationPoint
      };
      
      console.log('Starting ride:', message);
      sendMessage(message);
      
      // Add a small delay for animation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setRideStarted(true);
      setIsStartingRide(false);
      setError('');
    } catch (error) {
      console.error('Error starting ride:', error);
      setError('Could not start ride. Please try again.');
      setIsStartingRide(false);
    }
  };

  const endRide = useCallback(async () => {
    if (!userData || isEndingRide) return;
    
    try {
      setIsEndingRide(true);

      const endTime = new Date().toISOString();
      const totalSeconds = Math.floor(elapsedTime / 1000);
      const timeFee = totalSeconds * 1.5;
      const parkingFee = 0;
      const totalCost = timeFee + parkingFee;

      const message = {
        action: 'end_ride',
        message: 'Ending ride!',
        userId: userData.user_id,
        scooterId: scooter.scooter_id,
        startLocation: startLocation,
        endLocation: `POINT(${scooter.longitude} ${scooter.latitude})`,
        startTime: startTime,
        endTime: endTime,
        totalTime: totalSeconds,
        distance: 0,
        cost: totalCost,
        timeFee: timeFee,
        parkingFee: parkingFee,
        paymentStatus: 'completed'
      };

      console.log('Ending ride:', message);
      sendMessage(message);

      setTimeout(() => {
        if (isEndingRide) {
          setIsEndingRide(false);
          setError('Did not receive end ride confirmation. Please try again.');
        }
      }, 5000);
    } catch (error) {
      console.error('Error ending ride:', error);
      setError('Could not end ride. Please try again.');
      setIsEndingRide(false);
    }
  }, [userData, scooter, elapsedTime, isEndingRide, startLocation, startTime]);

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-xl shadow-lg p-4 mb-[56px] animate-slide-up">
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto cursor-pointer" onClick={onClose} />
        <button
          onClick={onClose}
          className="absolute right-4 top-4 px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors duration-200 transform hover:scale-105 active:scale-95"
        >
          Close
        </button>
      </div>
      
      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg mb-4 animate-shake">
          {error}
          <button 
            onClick={() => setError('')}
            className="ml-2 text-red-700 underline"
          >
            Dismiss
          </button>
        </div>
      )}
      
      <div className="space-y-4">
        <div className="flex justify-start items-center">
          <h2 className="text-lg font-semibold">Balance: {userData?.balance || 0} SEK</h2>
        </div>

        {userData?.balance < 20 && !rideStarted && (
          <div className="bg-yellow-100 text-yellow-800 p-3 rounded-lg animate-pulse">
            Minimum balance of 20 SEK required to start riding
          </div>
        )}

        {!isScooterAvailable && !rideStarted && (
          <div className="bg-yellow-100 text-yellow-800 p-3 rounded-lg">
            This scooter is currently {scooter.status} and cannot be rented
          </div>
        )}

        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Status</span>
            <span className={`px-2 py-1 rounded-full text-sm ${
              isScooterAvailable 
                ? 'bg-green-100 text-green-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {scooter.status}
            </span>
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-sm text-gray-600">Battery Level</span>
            <span className="text-sm font-medium">{scooter.battery_level}%</span>
          </div>
        </div>

        {!rideStarted ? (
          <button
            onClick={startRide}
            disabled={!canStartRide || isStartingRide}
            className={`w-full py-3 rounded-lg transition-all duration-300 transform ${
              !canStartRide
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : isStartingRide
                ? 'bg-green-500 text-white animate-pulse scale-95'
                : 'bg-green-500 text-white hover:bg-green-600 hover:scale-105 active:scale-95'
            }`}
          >
            {isStartingRide 
              ? 'Starting Ride...' 
              : scooter.status === 'available' && !canStartRide
                ? 'Insufficient Balance'
                : scooter.status === 'available'
                ? 'Start Ride'
                : `Scooter ${scooter.status} - Cannot Start Ride`}
          </button>
        ) : (
          <>
            <div className="bg-blue-50 p-3 rounded-lg mb-4 transition-all duration-300">
              <div className="animate-fade-in">
                {startTime && <p>Started at: {startTime}</p>}
                <p>Elapsed time: {Math.floor(elapsedTime / 1000)} seconds</p>
                <p>Estimated cost: {((elapsedTime / 1000) * 1.5).toFixed(2)} SEK</p>
              </div>
            </div>
            <button
              onClick={endRide}
              disabled={isEndingRide}
              className={`w-full py-3 rounded-lg transition-all duration-300 transform ${
                isEndingRide
                  ? 'bg-red-500 text-white animate-pulse scale-95'
                  : 'bg-red-500 text-white hover:bg-red-600 hover:scale-105 active:scale-95'
              }`}
            >
              {isEndingRide ? 'Ending Ride...' : 'End Ride'}
            </button>
          </>
        )}

        {rideTime !== null && (
          <div className="bg-gray-100 p-3 rounded-lg animate-fade-in">
            <p>Ride duration: {rideTime} seconds</p>
            <p>Final cost: {(rideTime * 1.5).toFixed(2)} SEK</p>
          </div>
        )}
      </div>
    </div>
  );
}