import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/db";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async signIn({ user }) {
      try {
        if (!user.email) return false;

      const existingUser = await prisma.user.findFirst({
  where: {
    email: user.email,
  },
});

if (!existingUser) {
  await prisma.user.create({
    data: {
      email: user.email,
      name: user.name || "Google User",
      phone: `google_${Math.random()
  .toString(36)
  .substring(2, 12)}`,
      role: "CUSTOMER",
      blocked: false,
    },
  });
}

        return true;
      } catch (err) {
        console.error(err);
        return false;
      }
    },

    async jwt({ token, user }) {
      if (user?.email) {
        token.email = user.email;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.email = token.email as string;
      }

      return session;
    },
  },

  pages: {
    signIn: "/login",
  },
});

export { handler as GET, handler as POST };