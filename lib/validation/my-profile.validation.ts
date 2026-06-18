import { z } from "zod";

export const myProfileSchema = z.object({
  first_name: z.string().trim().min(1, { message: "نام الزامی است" }).max(255),
  last_name: z.string().trim().min(1, { message: "نام خانوادگی الزامی است" }).max(255),
  username: z.string().trim().min(3, { message: "نام کاربری باید حداقل ۳ کاراکتر باشد" }).max(50),
  email: z.string().trim().min(1, { message: "ایمیل الزامی است" }).email({ message: "ایمیل نامعتبر است" }),
});

export type MyProfileInput = z.infer<typeof myProfileSchema>;
