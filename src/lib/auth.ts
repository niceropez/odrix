import { AuthOptions } from "next-auth";

// Function to refresh Strava token
async function refreshStravaToken(refreshToken: string) {
  console.log("🔄 Refreshing Strava token...");
  console.log("📋 Client ID available:", !!process.env.STRAVA_CLIENT_ID);
  console.log(
    "📋 Client Secret available:",
    !!process.env.STRAVA_CLIENT_SECRET
  );
  console.log("📋 Refresh token length:", refreshToken?.length);

  const response = await fetch("https://www.strava.com/oauth/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: process.env.STRAVA_CLIENT_ID!,
      client_secret: process.env.STRAVA_CLIENT_SECRET!,
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    console.error("❌ Token refresh failed:", error);
    console.error("❌ Response status:", response.status);
    console.error(
      "❌ Response headers:",
      Object.fromEntries(response.headers.entries())
    );
    throw new Error(`Token refresh failed: ${response.status}`);
  }

  const tokens = await response.json();
  console.log("✅ Token refresh successful");

  return tokens;
}

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
      token: {
        url: "https://www.strava.com/oauth/token",
        async request({ client, params, checks, provider }) {
          console.log("🔑 Token request - params:", params);
          console.log("🔑 Token request - client_id:", client.client_id);
          console.log("🔑 Token request - redirect_uri:", params.redirect_uri);

          const response = await fetch("https://www.strava.com/oauth/token", {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
              client_id: provider.clientId!,
              client_secret: provider.clientSecret!,
              code: params.code as string,
              grant_type: "authorization_code",
              redirect_uri: params.redirect_uri as string,
            }),
          });

          console.log("🔑 Token response status:", response.status);
          const tokens = await response.json();
          console.log(
            "🔑 Token response:",
            response.ok ? "✅ Success" : "❌ Error",
            tokens
          );

          if (!response.ok) {
            throw new Error(
              `Token exchange failed: ${response.status} ${JSON.stringify(
                tokens
              )}`
            );
          }

          return { tokens };
        },
      },
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
        // Initial sign in
        console.log("🔍 Account object received:", account);
        console.log(
          "🔍 Account expires_at:",
          account.expires_at,
          "type:",
          typeof account.expires_at
        );

        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt = account.expires_at; // Unix timestamp
        token.stravaId = profile?.id;

        console.log("✅ Initial tokens saved to JWT");
        console.log(
          "🔍 Saved expiresAt:",
          token.expiresAt,
          "type:",
          typeof token.expiresAt
        );
        console.log(
          "⏰ Token expires at:",
          new Date((account.expires_at || 0) * 1000)
        );
        return token;
      }

      // Check if token is expired and refresh if needed
      const now = Math.floor(Date.now() / 1000);
      const expiresAt = token.expiresAt as number;

      console.log("⏰ Current time:", new Date(now * 1000));
      console.log("⏰ Token expires at:", new Date(expiresAt * 1000));
      console.log("⏰ Time until expiry:", (expiresAt - now) / 60, "minutes");

      // Refresh token if it expires in the next 5 minutes
      if (expiresAt && expiresAt - now < 300) {
        console.log("🔄 Token expiring soon, refreshing...");
        try {
          const refreshedTokens = await refreshStravaToken(
            token.refreshToken as string
          );

          token.accessToken = refreshedTokens.access_token;
          token.refreshToken = refreshedTokens.refresh_token;
          token.expiresAt = refreshedTokens.expires_at;

          console.log("✅ Token refreshed successfully");
          console.log(
            "⏰ New expiry:",
            new Date(refreshedTokens.expires_at * 1000)
          );

          return token;
        } catch (error) {
          console.error("❌ Error refreshing token:", error);
          // Return token as is, might need to re-authenticate
          return token;
        }
      }

      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      session.refreshToken = token.refreshToken as string;
      session.stravaId = token.stravaId as number;
      session.expiresAt = token.expiresAt as number;
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  debug: true, // 🔍 Siempre habilitar debug
};
