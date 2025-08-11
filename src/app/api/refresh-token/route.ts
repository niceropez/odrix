import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.refreshToken) {
      return NextResponse.json(
        { error: "No refresh token available" },
        { status: 401 }
      );
    }

    console.log("🔄 API: Refreshing Strava token...");
    console.log("📋 Client ID available:", !!process.env.STRAVA_CLIENT_ID);
    console.log(
      "📋 Client Secret available:",
      !!process.env.STRAVA_CLIENT_SECRET
    );

    const response = await fetch("https://www.strava.com/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: process.env.STRAVA_CLIENT_ID!,
        client_secret: process.env.STRAVA_CLIENT_SECRET!,
        grant_type: "refresh_token",
        refresh_token: session.refreshToken as string,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("❌ API: Token refresh failed:", error);
      return NextResponse.json(
        { error: "Token refresh failed", details: error },
        { status: 400 }
      );
    }

    const tokens = await response.json();
    console.log("✅ API: Token refresh successful");

    return NextResponse.json({
      access_token: tokens.access_token,
      expires_at: tokens.expires_at,
      refresh_token: tokens.refresh_token,
    });
  } catch (error) {
    console.error("❌ API: Error in token refresh:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
