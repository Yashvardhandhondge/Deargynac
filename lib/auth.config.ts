import type { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

/**
 * Edge-safe: no top-level Mongoose/Node DB imports — those run only inside `authorize`
 * (Node route handlers), not when middleware bundles this file.
 */
export const authConfig: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      name: "OTP",
      credentials: {
        phone: { label: "Phone", type: "text" },
        userId: { label: "User ID", type: "text" },
        role: { label: "Role", type: "text" },
        isAnonymous: { label: "Anonymous", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.userId) return null;
        const { connectDB } = await import("@/lib/db");
        const { User } = await import("@/models/User");
        await connectDB();
        const user = await User.findById(credentials.userId).lean();
        if (!user) return null;
        return {
          id: (user as any)._id.toString(),
          name: (user as any).name || (user as any).alias || "Anonymous",
          email: (user as any).email || "",
          role: (user as any).role,
          isAnonymous: (user as any).isAnonymous,
          phone: (user as any).phone,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.isAnonymous = (user as any).isAnonymous;
        token.phone = (user as any).phone;
        token.userId = (user as any).id;
        token.id = (user as any).id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).isAnonymous = token.isAnonymous;
        (session.user as any).phone = token.phone;
        (session.user as any).userId = token.userId;
        (session.user as any).id = token.userId ?? token.id;
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
