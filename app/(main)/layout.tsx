import MainFooter from "@/components/layout/mainFooter";
import MainHeader from "@/components/layout/MainHeader";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <MainHeader />
      <main className="overflow-y-hidden my-2">{children}</main>
      <MainFooter />
    </>
  );
}
