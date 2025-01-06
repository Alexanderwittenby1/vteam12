import GitHubProvider from "next-auth/providers/github";

export const authOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      session.user.role = token.role; // Lägg till roll till sessionen
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role; // Lägg till roll till JWT-token
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};