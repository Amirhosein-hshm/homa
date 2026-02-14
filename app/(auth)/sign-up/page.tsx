import SignUpForm from "@/components/pages/sign-up/SignUpform";
import SignUpPanelInfo from "@/components/pages/sign-up/SignUpPanelInfo";
import { Card } from "@/components/ui/card";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ثبت نام سامانه ",
  description: "ثبت نام برای ورود به سامانه",
};

export default async function Page() {
  return (
    <Card className="bg-white rounded-xl card-shadow p-6 w-[70%]  grid grid-cols-12 gap-6">
      <SignUpPanelInfo />
      <SignUpForm />
    </Card>
  );
}
