import {
  clearSession,
  getRefreshToken,
  setSessionFromToken,
} from "@/lib/api/session";
import { refreshTokenUsersRefreshPost } from "@/lib/generated";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const refreshToken = await getRefreshToken();
    if (!refreshToken) {
      return NextResponse.json(
        { error: "No refresh token available" },
        { status: 401 },
      );
    }

    const result = await refreshTokenUsersRefreshPost({
      refresh_token: refreshToken,
    });

    if (result.status !== 200) {
      await clearSession();
      return NextResponse.json(
        { error: "Refresh failed" },
        { status: 401 },
      );
    }

    const data = result.data as {
      access_token: string;
      refresh_token: string;
      token_type?: string;
    };

    await setSessionFromToken({
      token: data.access_token,
      refresh_token: data.refresh_token,
      type: data.token_type || "Bearer",
      title: "refreshed-token",
    });

    return NextResponse.json({
      access_token: data.access_token,
      token_type: data.token_type || "Bearer",
    });
  } catch {
    await clearSession();
    return NextResponse.json(
      { error: "Refresh failed" },
      { status: 401 },
    );
  }
}
