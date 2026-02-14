import AuthFooter from "@/components/layout/AuthFooter";
import AuthHeader from "@/components/layout/AuthHeader";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
