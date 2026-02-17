"use server";

import { createServerRequestOptions } from "@/lib/api/server-request-options";
import {
  clearSession,
  extractSessionToken,
  setSessionFromToken,
} from "@/lib/api/session";
import {
  actionSuccess,
  actionHandler,
  resolveActionResult,
  type ActionResult,
} from "@/lib/action/wrapper";
import {
  createUserApiUsersPost,
  loginApiAuthLoginPost,
  logoutApiAuthLogoutPost,
} from "@/lib/generated";
import type { UserCreate, UserLogin } from "@/lib/generated/types/model";

const buildLoginInput = (payload: UserLogin): UserLogin => ({
  username: String(payload.username ?? ""),
  password: String(payload.password ?? ""),
});

type LoginResponse = Awaited<ReturnType<typeof loginApiAuthLoginPost>>;
type LoginSuccessResponse = Extract<LoginResponse, { status: 200 }>;

const isLoginSuccessResponse = (
  response: LoginResponse,
): response is LoginSuccessResponse =>
  response.status === 200 && response.data.success;

type SignUpResponse = Awaited<ReturnType<typeof createUserApiUsersPost>>;
type SignUpSuccessResponse = Extract<SignUpResponse, { status: 200 }>;

const isSignUpSuccessResponse = (
  response: SignUpResponse,
): response is SignUpSuccessResponse =>
  response.status === 200 && response.data.success;

const buildSignUpInput = (payload: UserCreate): UserCreate => ({
  first_name: String(payload.first_name ?? "").trim(),
  last_name: String(payload.last_name ?? "").trim(),
  email: String(payload.email ?? "").trim(),
  username: String(payload.username ?? "").trim(),
  password: String(payload.password ?? ""),
});

export async function loginAction(
  payload: UserLogin,
): Promise<ActionResult<{ redirectTo: string }>> {
  const loginResult = await actionHandler(
    loginApiAuthLoginPost(buildLoginInput(payload)),
  );

  return resolveActionResult(loginResult, {
    isSuccess: isLoginSuccessResponse,
    errorStatus: (response) => (response.status === 200 ? 401 : response.status),
    mapSuccess: async (response) => {
      const sessionToken = extractSessionToken(
        response.data.payload,
        response.headers.get("authorization"),
      );

      if (!sessionToken) {
        throw new Error("توکن معتبر از سرور دریافت نشد.");
      }

      await setSessionFromToken(sessionToken);
      return { redirectTo: "/meets" };
    },
  });
}

export async function signUpAction(
  payload: UserCreate,
): Promise<ActionResult<{ redirectTo: string }>> {
  const signUpResult = await actionHandler(
    createUserApiUsersPost(buildSignUpInput(payload)),
  );

  return resolveActionResult(signUpResult, {
    isSuccess: isSignUpSuccessResponse,
    mapSuccess: async () => ({ redirectTo: "/login" }),
  });
}

export async function logoutAction(): Promise<
  ActionResult<{ redirectTo: string }>
> {
  try {
    const request = await createServerRequestOptions();
    await actionHandler(logoutApiAuthLogoutPost(request));
  } finally {
    await clearSession();
  }

  return actionSuccess({ redirectTo: "/login" }, 200);
}
