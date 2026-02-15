import MeetingTable from "@/components/pages/meets/MeetTable";
import { Metadata } from "next";
import { Suspense } from "react";
export const metadata: Metadata = {
  title: {
    absolute: "لیست جلسات",
  },
  description: "لیست جلسات",
};

export default async function Page() {
  return (
    <Suspense fallback={null}>
      <MeetingTable />
    </Suspense>
  );
}
