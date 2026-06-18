import { z } from "zod/v4";

export const editProfileSchema = z.object({
  first_name: z.string({ required: "نام الزامی است" }).min(1, "نام الزامی است").max(255),
  last_name: z.string({ required: "نام خانوادگی الزامی است" }).min(1, "نام خانوادگی الزامی است").max(255),
  username: z.string({ required: "نام کاربری الزامی است" }).min(3, "نام کاربری باید حداقل ۳ کاراکتر باشد").max(50),
  email: z.string({ required: "ایمیل الزامی است" }).email("ایمیل نامعتبر است"),
  role: z.string().optional(),
  is_active: z.boolean().optional(),
});

export type EditProfileInput = z.infer<typeof editProfileSchema>;
