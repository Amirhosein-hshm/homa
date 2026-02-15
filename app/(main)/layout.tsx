import MainFooter from "@/components/layout/mainFooter";
import MainHeader from "@/components/layout/MainHeader";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <MainHeader />
      <main className="flex-1 overflow-y-hidden my-2">{children}</main>
      <MainFooter />
    </div>
  );
}
