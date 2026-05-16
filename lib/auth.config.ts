import type { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

function sessionUserFromDb(user: {
  _id: { toString(): string };
  name?: string;
  alias?: string;
  email?: string;
  username?: string;
  role?: string;
  isAnonymous?: boolean;
  phone?: string;
}) {
  const id = user._id.toString();
  return {
    id,
    name: user.name || user.alias || "User",
    email: user.email || "",
    role: user.role ?? "patient",
    isAnonymous: Boolean(user.isAnonymous),
    phone: user.phone,
    username: user.username,
  };
}

/**
 * Edge-safe: no top-level Mongoose/Node DB imports — those run only inside `authorize`
 * (Node route handlers), not when middleware bundles this file.
 */
export const authConfig: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
        userId: { label: "User ID", type: "text" },
        role: { label: "Role", type: "text" },
        isAnonymous: { label: "Anonymous", type: "text" },
      },
      async authorize(credentials) {
        const { connectDB } = await import("@/lib/db");
        const { User } = await import("@/models/User");
        const { normalizeUsername, verifyPassword } = await import(
          "@/lib/authCredentials"
        );

        await connectDB();

        if (credentials?.username && credentials?.password) {
          const username = normalizeUsername(String(credentials.username));
          const user = await User.findOne({ username }).lean();
          if (!user) return null;
          if (user.isActive === false) return null;
          const ok = await verifyPassword(
            String(credentials.password),
            user.passwordHash
          );
          if (!ok) return null;
          return sessionUserFromDb(user);
        }

        if (credentials?.userId) {
          const user = await User.findById(credentials.userId).lean();
          if (!user) return null;
          return sessionUserFromDb(user);
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role;
        token.isAnonymous = (user as { isAnonymous?: boolean }).isAnonymous;
        token.phone = (user as { phone?: string }).phone;
        token.username = (user as { username?: string }).username;
        token.userId = (user as { id?: string }).id;
        token.id = (user as { id?: string }).id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { role?: string }).role = token.role as string;
        (session.user as { isAnonymous?: boolean }).isAnonymous =
          token.isAnonymous as boolean;
        (session.user as { phone?: string }).phone = token.phone as string;
        (session.user as { username?: string }).username = token.username as string;
        (session.user as { userId?: string }).userId =
          (token.userId as string) ?? (token.id as string);
        (session.user as { id?: string }).id =
          (token.userId as string) ?? (token.id as string);
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      try {
        if (new URL(url).origin === baseUrl) return url;
      } catch {
        /* ignore */
      }
      return baseUrl;
    },
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET,
  trustHost: true,
};
