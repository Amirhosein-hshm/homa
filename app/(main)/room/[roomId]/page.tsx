import RoomControls from "@/components/pages/room/RoomControls";
import RoomMainSection from "@/components/pages/room/RoomMainSection";

export async function generateMetadata() {
  return {
    title: { absolute: "جلسه رفع مشکلات" },
    description: "جلسه رفع مشکلات در مورد تیم هما",
  };
}
export default async function Page() {
  return (
    <>
      <RoomMainSection />
      <RoomControls />
    </>
  );
}
