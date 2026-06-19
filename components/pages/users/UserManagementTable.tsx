"use client";

import { useState } from "react";
import { Filter } from "lucide-react";

import { SmartPagination } from "@/components/ui/SmartPagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { AsyncUserSelect } from "@/components/ui/AsyncUserSelect";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useListUsersUsersGet } from "@/lib/generated/hooks";
import type { ListUsersUsersGetParams } from "@/lib/generated/types/operations";
import type { PaginatedResponseDTOGetMeResponseDTO } from "@/lib/generated/types/model";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { UserManagementTableAction } from "./UserManagementTableAction";

const PAGE_SIZE = 20;

export function UserManagementTable() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [open, setOpen] = useState(false);
  const [filterUsername, setFilterUsername] = useState(searchParams.get("username") ?? "");

  const uiPage = Math.max(Number(searchParams.get("page") ?? 0), 0);
  const apiPage = uiPage + 1;
  const username = searchParams.get("username") || undefined;

  const params: ListUsersUsersGetParams = {
    page: apiPage,
    size: PAGE_SIZE,
    username: username ?? null,
  };

  const { data, isLoading } = useListUsersUsersGet(params);

  const paginated =
    data && data.status === 200
      ? (data as { data: PaginatedResponseDTOGetMeResponseDTO; status: 200 }).data
      : null;

  const users = paginated?.data ?? [];
  const total = paginated?.total ?? 0;

  const hasActiveFilters = !!searchParams.get("username");

  const handleOpen = () => {
    setFilterUsername(searchParams.get("username") ?? "");
    setOpen(true);
  };

  const handleApply = () => {
    const params = new URLSearchParams();
    if (filterUsername) params.set("username", filterUsername);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    setOpen(false);
  };

  const handleClearAll = () => {
    setFilterUsername("");
  };

  return (
    <div className="flex flex-col h-full gap-2">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-700">مدیریت کاربران</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={handleOpen}
          className="gap-2"
        >
          <Filter className="size-4" />
          فیلترها
          {hasActiveFilters && (
            <span className="size-2 rounded-full bg-indigo-600" />
          )}
        </Button>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>فیلتر کاربران</SheetTitle>
          </SheetHeader>

          <div className="flex flex-col gap-4 px-4 py-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">نام کاربری</label>
              <AsyncUserSelect
                mode="single"
                value={filterUsername}
                onChange={(val) => setFilterUsername(val as string)}
                placeholder="جستجوی کاربر..."
              />
            </div>
          </div>

          <SheetFooter className="flex-row gap-2">
            <Button variant="outline" onClick={handleClearAll}>
              پاک کردن همه
            </Button>
            <Button onClick={handleApply}>
              اعمال فیلترها
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <div className="flex-1 min-h-0 overflow-y-auto border rounded-lg">
        <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="bg-slate-50 text-xs font-semibold text-slate-500 text-center">ردیف</TableHead>
              <TableHead className="bg-slate-50 text-xs font-semibold text-slate-500 text-center">نام کاربری</TableHead>
              <TableHead className="bg-slate-50 text-xs font-semibold text-slate-500 text-center">نام و نام خانوادگی</TableHead>
              <TableHead className="bg-slate-50 text-xs font-semibold text-slate-500 text-center">ایمیل</TableHead>
              <TableHead className="bg-slate-50 text-xs font-semibold text-slate-500 text-center">نقش</TableHead>
              <TableHead className="bg-slate-50 text-xs font-semibold text-slate-500 text-center">وضعیت</TableHead>
              <TableHead className="bg-slate-50 text-xs font-semibold text-slate-500 text-center">عملیات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-slate-400">
                  در حال بارگذاری...
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-slate-400">
                  کاربری یافت نشد.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user, index) => (
                <TableRow key={user.id} className="hover:bg-slate-50 transition">
                  <TableCell className="text-xs text-slate-700 text-center">
                    {uiPage * PAGE_SIZE + index + 1}
                  </TableCell>
                  <TableCell className="text-xs text-slate-700 text-center font-medium">
                    {user.username}
                  </TableCell>
                  <TableCell className="text-xs text-slate-700 text-center">
                    {user.first_name} {user.last_name}
                  </TableCell>
                  <TableCell className="text-xs text-slate-700 text-center" dir="ltr">
                    {user.email}
                  </TableCell>
                  <TableCell className="text-xs text-center">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                        user.role === "SuperAdmin"
                          ? "bg-purple-100 text-purple-700"
                          : user.role === "Admin"
                            ? "bg-blue-100 text-blue-700"
                            : user.role === "Host"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {user.role === "SuperAdmin"
                        ? "مدیر ارشد"
                        : user.role === "Admin"
                          ? "مدیر"
                          : user.role === "Host"
                            ? "میزبان"
                            : "کاربر"}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs text-center">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                        user.is_active
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {user.is_active ? "فعال" : "غیرفعال"}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs text-center">
                    <UserManagementTableAction
                      userId={user.id}
                      username={user.username}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        </div>
      </div>

      <div className="shrink-0">
        <SmartPagination total={total} pageSize={PAGE_SIZE} />
      </div>
    </div>
  );
}
