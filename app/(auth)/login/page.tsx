import LoginForm from "@/components/pages/auth/LoginForm";
import LoginInfoPanel from "@/components/pages/auth/LoginInfoPanel";
import { Card } from "@/components/ui/card";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ورود به سامانه",
  description: "برای دسترسی به جلسات، وارد حساب کاربری خود شوید.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Login() {
  return (
    <Card className="bg-white rounded-xl card-shadow p-6 w-full max-w-5xl lg:w-[70%] grid grid-cols-12 gap-6">
      <LoginInfoPanel />
      <LoginForm />
    </Card>
  );
}
