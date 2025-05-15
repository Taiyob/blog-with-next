import NextAuth from "next-auth";
import { authOptions } from "@/lib/authOptions";

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

// import NextAuth from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import GoogleProvider from "next-auth/providers/google";
// import { compare } from "bcryptjs";
// import { getUserByEmail } from "@/lib/auth";

// const handler = NextAuth({
//   providers: [
//     // 🌟 Custom Login
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         email: { label: "Email", type: "email" },
//         password: { label: "Password", type: "password" },
//       },

//       async authorize(
//         credentials: Record<"email" | "password", string> | undefined
//       ) {
//         const email = credentials?.email;
//         const password = credentials?.password;

//         if (!email || !password) {
//           throw new Error("Email and password are required.");
//         }

//         // 🔐 Your DB logic here (example with MongoDB or Prisma)
//         const user = await getUserByEmail(email); // Fetch from DB

//         if (!user) throw new Error("No user found");

//         const isValid = await compare(password, user.password);
//         if (!isValid) throw new Error("Invalid password");

//         return {
//           id: user.id.toString(),
//           name: user.name ?? null,
//           email: user.email ?? null,
//           image: null,
//         };
//       },
//     }),

//     // 🌐 Social Auth
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//     }),
//   ],

//   session: {
//     strategy: "jwt",
//   },

//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) {
//         token.id = user.id;
//         token.email = user.email ?? undefined;
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       if (token) {
//         session.user.id = token.id;
//       }
//       return session;
//     },
//   },

//   secret: process.env.NEXTAUTH_SECRET,
// });

// export { handler as GET, handler as POST };
