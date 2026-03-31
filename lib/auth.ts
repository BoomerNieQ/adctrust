import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./prisma";

const DHL_EMAIL_REGEX = /^[a-zA-Z]+\.[a-zA-Z]+@dhl\.com$/i;

export const OWNER_EMAIL = "dominique.bollen@dhl.com";

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      id: "dhl-email",
      name: "DHL E-mail",
      credentials: {
        email: { label: "DHL E-mailadres", type: "email" },
      },
      async authorize(credentials) {
        const raw = credentials?.email?.trim().toLowerCase() ?? "";
        if (!raw || !DHL_EMAIL_REGEX.test(raw)) return null;

        const [firstRaw, lastRaw] = raw.split("@")[0].split(".");
        const firstName = capitalize(firstRaw);
        const lastName  = capitalize(lastRaw);
        const isOwner   = raw === OWNER_EMAIL;

        const user = await prisma.user.upsert({
          where:  { email: raw },
          update: { lastLogin: new Date(), ...(isOwner ? { isAdmin: true } : {}) },
          create: { email: raw, firstName, lastName, isAdmin: isOwner },
          select: { id: true, email: true, firstName: true, lastName: true, isAdmin: true },
        });

        return { id: user.id, email: user.email, name: user.firstName,
                 firstName: user.firstName, lastName: user.lastName, isAdmin: user.isAdmin };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id        = user.id;
        token.firstName = (user as any).firstName;
        token.lastName  = (user as any).lastName;
        token.isAdmin   = (user as any).isAdmin;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id                 = token.id as string;
      session.user.name               = token.firstName as string;
      (session.user as any).firstName = token.firstName;
      (session.user as any).lastName  = token.lastName;
      (session.user as any).isAdmin   = token.isAdmin;
      return session;
    },
  },
  pages: { signIn: "/", error: "/" },
};
