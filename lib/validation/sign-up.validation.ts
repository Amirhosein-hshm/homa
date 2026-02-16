import type { UserCreate } from "@/lib/generated/types/model";
import { z } from "zod";

export type SignUpInput = UserCreate & {
  passwordConfirm: string;
};

export const signUpSchema: z.ZodType<SignUpInput> = z
  .object({
    first_name: z.string().trim().min(1, { message: "نام الزامی است." }),
    last_name: z.string().trim().min(1, { message: "نام خانوادگی الزامی است." }),
    username: z
      .string()
      .trim()
      .min(1, { message: "نام کاربری الزامی است." })
      .max(64, { message: "نام کاربری نمی‌تواند بیشتر از ۶۴ کاراکتر باشد." }),
    email: z
      .string()
      .trim()
      .min(1, { message: "ایمیل الزامی است." })
      .email({ message: "ایمیل معتبر نیست." }),
    password: z.string().min(8, { message: "رمز عبور باید حداقل ۸ کاراکتر باشد." }),
    passwordConfirm: z
      .string()
      .min(1, { message: "تأیید رمز عبور الزامی است." }),
  })
  .superRefine((value, context) => {
    if (value.password !== value.passwordConfirm) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["passwordConfirm"],
        message: "تأیید رمز عبور با رمز عبور یکسان نیست.",
      });
    }
  });
