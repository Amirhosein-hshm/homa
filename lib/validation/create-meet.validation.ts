import { z } from "zod";

export const createMeetFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, { message: "عنوان جلسه حداقل ۳ کاراکتر باید باشد." })
    .max(255, { message: "عنوان جلسه نمی‌تواند بیشتر از ۲۵۵ کاراکتر باشد." }),
  start_time: z.string().min(1, { message: "زمان شروع الزامی است." }),
  expires_at: z.string().min(1, { message: "زمان انقضا الزامی است." }),
  guest_usernames: z.array(z.string()).default([]),
});

export type CreateMeetFormInput = z.input<typeof createMeetFormSchema>;

export function transformFormToApi(data: CreateMeetFormInput) {
  return {
    title: data.title.trim(),
    start_time: data.start_time,
    expires_at: data.expires_at,
    guest_usernames: data.guest_usernames.filter(Boolean),
  };
}
