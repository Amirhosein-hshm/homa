import { z } from "zod";

export const loginSchema = z.object({
  username: z
    .string()
    .trim()
    .min(1, { message: "نام کاربری الزامی است." })
    .max(64, { message: "نام کاربری نمی‌تواند بیشتر از ۶۴ کاراکتر باشد." }),
  password: z.string().min(1, { message: "رمز عبور الزامی است." }),
});

export type LoginInput = z.infer<typeof loginSchema>;
