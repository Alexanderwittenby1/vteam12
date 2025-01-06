import NextAuth from "next-auth";
import { authOptions } from "@/auth/authSetup";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };