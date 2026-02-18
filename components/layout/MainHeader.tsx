import { getCurrentUserProfile } from "@/lib/api/current-user";
import MainHeaderProfile from "@/components/layout/MainHeaderProfile";
import Link from "next/link";

export default async function MainHeader() {
  const profile = await getCurrentUserProfile();

  return (
    <header
      className="h-16 w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 bg-gray-50 border-b border-b-gray-200 "
      role="banner"
    >
      <div className="flex items-center justify-between h-full">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-indigo-600 text-white w-10 h-10 flex items-center justify-center font-semibold">
            م
          </div>
          <div>
            <h1 className="text-[0.9375rem] font-semibold text-slate-900">
              هماهنگی تیم
            </h1>
            <p className="text-sm text-slate-500">
              مدیریت و مشاهده تمام جلسات تیم
            </p>
          </div>
        </div>

        <nav className="text-sm text-slate-600">
          <ul className="flex items-center gap-4">
            <li>
              <Link
                href="/support"
                className="hover:text-indigo-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded px-2 py-1"
              >
                پشتیبانی
              </Link>
            </li>
            <li>
              <MainHeaderProfile {...profile} />
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
