"use client";

import { useGetCurrentUserProfileUsersMeGet } from "@/lib/generated/hooks";
import { cn } from "@/lib/utils";
import {
  CalendarIcon,
  ListIcon,
  MailQuestionIcon,
  UsersIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    href: "/meets/all",
    label: "همه جلسات",
    icon: ListIcon,
    minRole: null,
    exceptRoles: ["User", "Host"],
  },
  {
    href: "/meets/managed",
    label: "جلسات من",
    icon: CalendarIcon,
    minRole: null,
    exceptRoles: ["User"],
  },
  {
    href: "/meets/invitations",
    label: "دعوت‌نامه‌ها",
    icon: MailQuestionIcon,
    minRole: null,
    exceptRoles: null,
  },
  {
    href: "/users",
    label: "مدیریت کاربران",
    icon: UsersIcon,
    minRole: null,
    exceptRoles: ["User", "Host"],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { data } = useGetCurrentUserProfileUsersMeGet();
  const role: string =
    data && data.status === 200
      ? ((data as { data: { data: { role: string } } }).data?.data?.role ??
        "User")
      : "User";

  const visibleItems = navItems.filter((item) => {
    if (item.exceptRoles && item.exceptRoles.includes(role)) {
      return false;
    }
    return true;
  });

  return (
    <aside className="w-56 shrink-0 border-l border-gray-200 bg-white h-full flex flex-col overflow-y-auto">
      <nav className="flex flex-col gap-1 p-3">
        {visibleItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
              )}
            >
              <Icon className="size-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
