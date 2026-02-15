import LoginForm from "@/components/pages/auth/LoginForm";
import LoginInfoPanel from "@/components/pages/auth/LoginInfoPanel";
import { Card } from "@/components/ui/card";

export default function Login() {
  return (
    <Card className="bg-white rounded-xl card-shadow p-6 w-[70%]  grid grid-cols-12 gap-6">
      <LoginInfoPanel />
      <LoginForm />
    </Card>
  );
}
