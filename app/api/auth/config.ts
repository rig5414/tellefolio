import { NextAuthOptions, Session, User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GitHubProvider from 'next-auth/providers/github';

interface ExtendedUser extends User {
  id: string;
}

interface ExtendedSession extends Session {
  user: ExtendedUser;
  githubAccessToken?: string;
}

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'adminpassword.';

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
          return {
            id: '1',
            name: 'Admin',
            email: ADMIN_USERNAME,
          };
        }

        console.log('Invalid credentials');
        throw new Error('Invalid username or password');
      },
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      authorization: { params: { scope: 'read:user repo' } },
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile, user }) {
      console.log('JWT callback:', { token, account, profile, user });
      // Persist the access token to the token right after signin
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      console.log('Session callback:', { session, token });
      // Send access token to client
      (session as ExtendedSession).githubAccessToken = token.accessToken as string;
      return session;
    },
    async redirect({ url, baseUrl }) {
      console.log('Redirect callback:', { url, baseUrl });
      // Handle callback URLs with query parameters properly
      if (url.startsWith(baseUrl)) return url;
      // Allows callback URLs with additional query parameters
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      return baseUrl;
    },
  },
  session: {
    strategy: "jwt",
  },
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET,
};

//
// Required in your .env.local:
// GITHUB_CLIENT_ID=your_github_client_id
// GITHUB_CLIENT_SECRET=your_github_client_secret
