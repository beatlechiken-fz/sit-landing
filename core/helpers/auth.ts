import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!,
);

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const { data: user } = await supabase
          .from("admin_users")
          .select("id, email, password")
          .eq("email", credentials.email)
          .single();

        if (!user) return null;

        const passwordOk = await bcrypt.compare(
          credentials.password as string,
          user.password,
        );
        if (!passwordOk) return null;

        return { id: String(user.id), email: user.email };
      },
    }),
  ],
  pages: {
    signIn: "/admin",
  },
  callbacks: {
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const isStorePage = request.nextUrl.pathname.startsWith("/store");
      if (isStorePage) return isLoggedIn;
      return true;
    },
  },
  session: {
    strategy: "jwt", // cookie segura httpOnly automática
    maxAge: 60 * 60 * 8, // 8 horas
  },
});
