import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { authenticate } from "./auth-provider";

const secret = process.env.NEXTAUTH_SECRET;

const protectedRoutes: { [key: string]: string[] } = {
  '/payment': ['user', 'admin'],
  '/profile': ['user', 'admin'],
  '/logout': ['user', 'admin'],
  '/mobile/profile': ['user', 'admin'],
  '/admin': ['admin'] 
};

export async function middleware(request: NextRequest) {
  const roles = protectedRoutes[request.nextUrl.pathname];

  if (roles) {
    // Försök att autentisera med NextAuth.js
    const token = await getToken({ req: request, secret });
    const user = token?.user;

    if (user && roles.includes(user.role)) {
      return NextResponse.next();
    }

    // Om NextAuth.js autentisering misslyckas, försök med egen autentisering
    const customUser = await authenticate(request);
    console.log("User in mw", customUser);

    if (customUser && roles.includes(customUser.role)) {
      return NextResponse.next();
    }

    // Om ingen autentisering lyckas, omdirigera till inloggningssidan
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}