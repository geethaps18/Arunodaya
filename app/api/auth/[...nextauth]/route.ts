// app/api/auth/[...nextauth]/route.ts

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
        if (!user.email) {
          console.log("NO EMAIL");
          return false;
        }

        const existingUser = await prisma.user.findFirst({
          where: {
            email: user.email,
          },
        });

        if (!existingUser) {
          await prisma.user.create({
            data: {
              name: user.name || "Google User",
              email: user.email,
              phone: "",
              role: "USER",
              blocked: false,
            },
          });
        }

        return true;
      } catch (error) {
        console.error("GOOGLE SIGNIN ERROR:", error);

        // IMPORTANT
        return "/login?error=GoogleSignin";
      }
    },

    async jwt({ token, user }) {
      if (user?.email) {
        token.email = user.email;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user && token.email) {
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