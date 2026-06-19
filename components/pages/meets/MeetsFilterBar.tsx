"use client";

import { useCallback, useState } from "react";
import { Filter } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StandaloneDatePicker } from "@/components/ui/FormDatePickerField";
import { AsyncUserSelect } from "@/components/ui/AsyncUserSelect";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export default function MeetsFilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [open, setOpen] = useState(false);

  const [titleQuery, setTitleQuery] = useState(searchParams.get("title_query") ?? "");
  const [startDate, setStartDate] = useState(searchParams.get("start_date") ?? "");
  const [endDate, setEndDate] = useState(searchParams.get("end_date") ?? "");
  const [guestUsername, setGuestUsername] = useState(searchParams.get("guest_username") ?? "");

  const hasActiveFilters = !!(searchParams.get("title_query") || searchParams.get("start_date") || searchParams.get("end_date") || searchParams.get("guest_username"));

  const handleOpen = () => {
    setTitleQuery(searchParams.get("title_query") ?? "");
    setStartDate(searchParams.get("start_date") ?? "");
    setEndDate(searchParams.get("end_date") ?? "");
    setGuestUsername(searchParams.get("guest_username") ?? "");
    setOpen(true);
  };

  const handleApply = useCallback(() => {
    const params = new URLSearchParams();
    if (titleQuery) params.set("title_query", titleQuery);
    if (startDate) params.set("start_date", startDate);
    if (endDate) params.set("end_date", endDate);
    if (guestUsername) params.set("guest_username", guestUsername);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    setOpen(false);
  }, [titleQuery, startDate, endDate, guestUsername, pathname, router]);

  const handleClearAll = useCallback(() => {
    setTitleQuery("");
    setStartDate("");
    setEndDate("");
    setGuestUsername("");
  }, []);

  return (
    <>
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

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>فیلترهای جستجو</SheetTitle>
          </SheetHeader>

          <div className="flex flex-col gap-4 px-4 py-4">
            <Input
              placeholder="جستجوی عنوان جلسه..."
              value={titleQuery}
              onChange={(e) => setTitleQuery(e.target.value)}
              className="text-sm"
            />
            <StandaloneDatePicker
              value={startDate || null}
              onChange={(val) => setStartDate(val ?? "")}
              label="از تاریخ"
            />
            <StandaloneDatePicker
              value={endDate || null}
              onChange={(val) => setEndDate(val ?? "")}
              label="تا تاریخ"
            />
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">مهمان</label>
              <AsyncUserSelect
                mode="single"
                value={guestUsername}
                onChange={(val) => setGuestUsername(val as string)}
                placeholder="انتخاب مهمان..."
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
    </>
  );
}
