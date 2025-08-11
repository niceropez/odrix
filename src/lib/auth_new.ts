import { AuthOptions } from "next-auth";

// 🔍 Debug de variables de entorno
console.log("🔍 Environment Variables Debug:");
console.log(
  "   STRAVA_CLIENT_ID:",
  process.env.STRAVA_CLIENT_ID ? "✅ Exists" : "❌ Missing"
);
console.log(
  "   STRAVA_CLIENT_SECRET:",
  process.env.STRAVA_CLIENT_SECRET ? "✅ Exists" : "❌ Missing"
);
console.log("   NEXTAUTH_URL:", process.env.NEXTAUTH_URL);
console.log(
  "   NEXTAUTH_SECRET:",
  process.env.NEXTAUTH_SECRET ? "✅ Exists" : "❌ Missing"
);

export const authOptions: AuthOptions = {
  providers: [
    {
      id: "strava",
      name: "Strava",
      type: "oauth",
      authorization: {
        url: "https://www.strava.com/oauth/authorize",
        params: {
          scope: "read,activity:read_all,profile:read_all",
          response_type: "code",
        },
      },
      token: "https://www.strava.com/oauth/token",
      userinfo: "https://www.strava.com/api/v3/athlete",
      clientId: process.env.STRAVA_CLIENT_ID,
      clientSecret: process.env.STRAVA_CLIENT_SECRET,
      profile(profile: any) {
        console.log("🎯 Strava profile received:", profile);
        const user = {
          id: profile.id?.toString() || String(profile.id),
          name:
            `${profile.firstname || ""} ${profile.lastname || ""}`.trim() ||
            profile.username ||
            "Strava User",
          email: profile.email || null,
          image: profile.profile_medium || profile.profile || null,
          stravaId: profile.id,
        };
        console.log("👤 User object created:", user);
        return user;
      },
    },
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      console.log(
        "🔐 JWT callback - account:",
        !!account,
        "profile:",
        !!profile
      );
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.stravaId = profile?.id;
        console.log("✅ Tokens saved to JWT");
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      session.refreshToken = token.refreshToken as string;
      session.stravaId = token.stravaId as number;
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  debug: true, // 🔍 Siempre habilitar debug
};
