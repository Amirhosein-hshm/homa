import { isAuthenticated } from "@/lib/api/session";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function Home() {
  const loggedIn = await isAuthenticated();
  redirect(loggedIn ? "/meets" : "/login");
}
