import { createServerRequestOptions } from "@/lib/api/server-request-options";
import { getMeApiAuthMeGet } from "@/lib/generated";

export type CurrentUserProfile = {
  avatarSrc: string;
  fullName: string;
  username: string;
};

const FALLBACK_PROFILE: CurrentUserProfile = {
  avatarSrc: "/images/avatar-user.svg",
  fullName: "کاربر",
  username: "user",
};

const normalizeText = (value: unknown): string =>
  typeof value === "string" ? value.trim() : "";

const buildFullName = (firstName: string, lastName: string): string => {
  const fullName = [firstName, lastName].filter(Boolean).join(" ").trim();
  return fullName || FALLBACK_PROFILE.fullName;
};

const buildUsername = (username: string): string => {
  const sanitizedUsername = username.replace(/^@+/, "").trim();
  return sanitizedUsername || FALLBACK_PROFILE.username;
};

export async function getCurrentUserProfile(): Promise<CurrentUserProfile> {
  try {
    const request = await createServerRequestOptions();
    const response = await getMeApiAuthMeGet(request);
    const payload =
      response.status === 200 && response.data.success
        ? response.data.payload
        : null;

    if (!payload) {
      return FALLBACK_PROFILE;
    }

    const firstName = normalizeText(payload.first_name);
    const lastName = normalizeText(payload.last_name);
    const username = buildUsername(normalizeText(payload.username));

    return {
      avatarSrc: FALLBACK_PROFILE.avatarSrc,
      fullName: buildFullName(firstName, lastName),
      username,
    };
  } catch {
    return FALLBACK_PROFILE;
  }
}
