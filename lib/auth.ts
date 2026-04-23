import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "./db";
import { User } from "@/models/User";

export const { handlers, auth, signIn, signOut } = NextAuth({
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
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).isAnonymous = token.isAnonymous;
        (session.user as any).phone = token.phone;
        (session.user as any).userId = token.userId;
        (session.user as any).id = token.userId;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
});
