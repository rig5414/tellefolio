// app/api/auth/[...nextauth]/route.ts

import NextAuth, { NextAuthOptions, Session, User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { JWT } from 'next-auth/jwt';

interface ExtendedUser extends User {
  id: string;
}

interface ExtendedSession extends Session {
  user: ExtendedUser;
}

// Define your admin credentials securely
// In a real app, you'd hash this password and compare with a hashed one from a DB
// For this simple admin, direct comparison is okay initially, but be aware.
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'adminpassword.'; // CHANGE THIS!

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        console.log('Authorization attempt for username:', credentials?.username);

        if (!credentials?.username || !credentials?.password) {
          console.log('Missing credentials');
          throw new Error('Please enter both username and password');
        }

        if (
          credentials.username === ADMIN_USERNAME &&
          credentials.password === ADMIN_PASSWORD
        ) {
          console.log('Authorization successful');
          // Return a user object if authentication is successful
          // The `id` field is required by NextAuth
          return { id: '1', name: 'Admin', email: ADMIN_USERNAME };
        }

        console.log('Invalid credentials');
        // If you return null, an error will be displayed to the user
        throw new Error('Invalid username or password');
      },
    }),
  ],
  pages: {
    signIn: '/auth/signin', // Custom sign-in page (we'll create this next)
    error: '/auth/signin', // Will show errors on the sign-in page
  },
  session: {
    strategy: 'jwt' as const,
    maxAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: { id: string } }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }): Promise<ExtendedSession> {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id as string,
        },
      };
    },
  },
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET, // IMPORTANT: Generate a secure secret!
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };