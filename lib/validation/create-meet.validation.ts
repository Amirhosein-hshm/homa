import type { MeetCreate } from "@/lib/generated/types/model";
import { z } from "zod";

export type CreateMeetInput = MeetCreate;

export const createMeetSchema: z.ZodType<CreateMeetInput> = z.object({
  title: z
    .string()
    .trim()
    .min(1, { message: "عنوان جلسه الزامی است." })
    .max(120, { message: "عنوان جلسه نمی‌تواند بیشتر از ۱۲۰ کاراکتر باشد." }),
});
