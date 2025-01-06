'use client';

import React, { useState, useEffect, ReactNode } from 'react';
import { sendMessage, registerMessageHandler, connectWebSocket } from '../../components/websocketClient';

const WebSocketButton = ({ user }: { user: ReactNode }) => {
  const [rideTime, setRideTime] = useState<number | null>(null);
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [rideStarted, setRideStarted] = useState<boolean>(false);
  // const [loading, setLoading] = useState<boolean>(true);
  const [startPosition, setStartPosition] = useState<{ lat: number; lng: number } | null>(null);
  const user_id = user.user_id;
  

  useEffect(() => {
    connectWebSocket();


    registerMessageHandler((data) => {
      if (data.action === 'ride_ended') {
        setRideTime(data.totalTime);
        setRideStarted(false);
      }
    });
  }, []);

  const getPosition = () => {
    return new Promise<{ lat: number; lng: number }>((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          (error) => {
            reject(error);
          }
        );
      } else {
        reject(new Error('Geolocation is not supported by this browser.'));
      }
    });
  };

  const calculateDistance = (startPos: { lat: number; lng: number }, endPos: { lat: number; lng: number }) => {
    const toRad = (value: number) => (value * Math.PI) / 180;
    const R = 6371; // Radius of the Earth in km
    const dLat = toRad(endPos.lat - startPos.lat);
    const dLng = toRad(endPos.lng - startPos.lng);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(startPos.lat)) * Math.cos(toRad(endPos.lat)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    console.log('Distance:', distance);
    return distance * 1000; // meters
  };

  const bookScooter = async () => {
    try {
      const pos = await getPosition();
      console.log('Current position:', pos);
      setPosition(pos);
      setStartPosition(pos);
      sendMessage({
        action: 'start_ride',
        message: 'Starting the ride!',
        userId: user_id,
        scooterId: 1,
        startLocation: `POINT(${pos.lng} ${pos.lat})`,
        
      });
      setRideStarted(true);
    } catch (error) {
      console.error('Error getting position:', error);
    }
  };

  const endRide = async () => {
    try {
      const endPos = await getPosition();
      const distance = startPosition ? calculateDistance(startPosition, endPos) : null;
      sendMessage({
        action: 'end_ride',
        message: 'Ending the ride!',
        userId: user_id,
        scooterId: 1,
        endLocation: `POINT(${endPos.lng} ${endPos.lat})`,
        distance: distance,
      });
    } catch (error) {
      console.error('Error getting position:', error);
    }
  };

  

  return (
    <div>
      {!rideStarted ? (
        <button className='btn btn-primary' onClick={bookScooter}>Book scooter</button>
      ) : (
        <button className='btn btn-primary' onClick={endRide}>End Ride</button>
      )}
      {rideTime !== null && (
        <div>
          <p>Your ride lasted: {rideTime} seconds</p>
          <p>Total cost: {rideTime * 1.5} SEK</p>
        </div>
      )}
    </div>
  );
};

export default WebSocketButton;