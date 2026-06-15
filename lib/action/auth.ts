"use server";

import {
  actionHandler,
  actionSuccess,
  type ActionResult,
} from "@/lib/action/wrapper";
import {
  clearSession,
  getRefreshToken,
  setSessionFromToken,
  type SessionTokenInput,
} from "@/lib/api/session";
import {
  logoutUserUsersLogoutPost,
  type RefreshTokenRequestDTO,
} from "@/lib/generated";

export async function setAuthSessionAction(
  tokenPayload: SessionTokenInput,
): Promise<ActionResult<null>> {
  try {
    await setSessionFromToken(tokenPayload);
    return actionSuccess(null, 200);
  } catch {
    return {
      success: false,
      error: "خطا در ذخیره‌سازی نشست کاربری",
      status: 500,
    };
  }
}

export async function clearAuthSessionAction(): Promise<
  ActionResult<null>
> {
  try {
    await clearSession();
    return actionSuccess(null, 200);
  } catch {
    return {
      success: false,
      error: "خطا در پاک‌سازی نشست کاربری",
      status: 500,
    };
  }
}

export async function logoutAction(): Promise<
  ActionResult<{ redirectTo: string }>
> {
  try {
    const refreshToken = await getRefreshToken();
    if (refreshToken) {
      const body: RefreshTokenRequestDTO = { refresh_token: refreshToken };
      await actionHandler(logoutUserUsersLogoutPost(body));
    }
  } finally {
    await clearSession();
  }

  return actionSuccess({ redirectTo: "/login" }, 200);
}
