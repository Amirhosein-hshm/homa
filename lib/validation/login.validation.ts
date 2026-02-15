import { z } from "zod";

export const loginSchema = z.object({
  username: z
    .string()
    .trim()
    .nonempty({ message: "نام کاربری الزامی است." })
    .regex(/^[a-zA-Z\s]+$/, {
      message: "نام کاربری فقط می‌تواند شامل حروف انگلیسی  باشد.",
    }),
  password: z
    .string()
    .nonempty({ message: "رمز عبور الزامی است." }),
});

export type LoginInput = z.infer<typeof loginSchema>;
