"use server";

import {
  actionHandler,
  resolveActionResult,
  type ActionResult,
} from "@/lib/action/wrapper";
import { createServerRequestOptions } from "@/lib/api/server-request-options";
import { createMeetApiMeetsPost } from "@/lib/generated";
import type { MeetCreate } from "@/lib/generated/types/model";

const buildCreateMeetInput = (payload: MeetCreate): MeetCreate => ({
  title: String(payload.title ?? "").trim(),
});

type CreateMeetResponse = Awaited<ReturnType<typeof createMeetApiMeetsPost>>;
type CreateMeetSuccessResponse = Extract<CreateMeetResponse, { status: 200 }>;

const isCreateMeetSuccessResponse = (
  response: CreateMeetResponse,
): response is CreateMeetSuccessResponse =>
  response.status === 200 && response.data.success;

export async function createMeetAction(
  payload: MeetCreate,
): Promise<ActionResult<{ meetId: string; joinToken: string }>> {
  const request = await createServerRequestOptions();
  const createMeetResult = await actionHandler(
    createMeetApiMeetsPost(buildCreateMeetInput(payload), request),
  );

  return resolveActionResult(createMeetResult, {
    isSuccess: isCreateMeetSuccessResponse,
    mapSuccess: async (response) => {
      const createdMeet = response.data.payload;

      if (!createdMeet) {
        throw new Error("اطلاعات جلسه ایجاد شده دریافت نشد.");
      }

      return {
        meetId: createdMeet.id,
        joinToken: createdMeet.join_token,
      };
    },
  });
}
