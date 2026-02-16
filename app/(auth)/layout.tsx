import AuthFooter from "@/components/layout/AuthFooter";
import AuthHeader from "@/components/layout/AuthHeader";
import { redirectIfAuthenticated } from "@/lib/api/session";

export const dynamic = "force-dynamic";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await redirectIfAuthenticated();

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <AuthHeader />
      <main className="flex-1 flex items-center justify-center overflow-hidden">
        {children}
      </main>
      <AuthFooter />
    </div>
  );
}
