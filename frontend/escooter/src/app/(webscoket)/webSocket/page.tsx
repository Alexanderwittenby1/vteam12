import React from 'react'
import WebSocketButton from '@/components/websocketButton/webSocketButton'
import { fetchUserData } from '@/services/fetchUserData'
import { cookies } from 'next/headers';

const cookieStore = await cookies();
const token = cookieStore.get('token')?.value || '';
const user = await fetchUserData(token);

const page = () => {
  return (
    <>
        <WebSocketButton user={user} />
        
    </>
  )
}

export default page