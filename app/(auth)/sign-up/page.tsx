import SignUpForm from "@/components/pages/auth/SignUpform";
import SignUpPanelInfo from "@/components/pages/auth/SignUpPanelInfo";
import { Card } from "@/components/ui/card";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ثبت نام سامانه ",
  description: "ثبت نام برای ورود به سامانه",
};

export default async function Page() {
  return (
    <Card className="bg-white rounded-xl card-shadow p-6 w-full max-w-5xl lg:w-[70%] grid grid-cols-12 gap-6">
      <SignUpPanelInfo />
      <SignUpForm />
    </Card>
  );
}
