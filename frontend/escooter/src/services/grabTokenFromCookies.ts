"use server";
import { cookies } from 'next/headers';

export async function getAuthToken() {
  const cookieStore = await cookies();
  const token = (await cookieStore.get("token")?.value) || "";
  return token;
}