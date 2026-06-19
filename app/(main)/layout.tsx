import MainFooter from "@/components/layout/mainFooter";
import MainHeader from "@/components/layout/MainHeader";
import Sidebar from "@/components/layout/Sidebar";
import { requireAuthenticated } from "@/lib/api/session";

export const dynamic = "force-dynamic";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuthenticated();

  return (
    <div className="h-screen flex flex-col">
      <MainHeader />
      <div className="flex-1 min-h-0 overflow-hidden flex py-2">
        <div className="hidden md:flex">
          <Sidebar />
        </div>
        <main className="flex-1 min-h-0 overflow-y-auto p-4">{children}</main>
      </div>
      <MainFooter />
    </div>
  );
}
