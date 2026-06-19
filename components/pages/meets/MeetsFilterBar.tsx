"use client";

import { Input } from "@/components/ui/input";
import { StandaloneDatePicker } from "@/components/ui/FormDatePickerField";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";

export default function MeetsFilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const titleQuery = searchParams.get("title_query") ?? "";
  const startDate = searchParams.get("start_date") ?? "";
  const endDate = searchParams.get("end_date") ?? "";
  const guestUsername = searchParams.get("guest_username") ?? "";

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete("page");
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, pathname, router],
  );

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      updateParam("title_query", e.target.value);
    }, 300);
  };

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Input
        placeholder="جستجوی عنوان جلسه..."
        defaultValue={titleQuery}
        onChange={handleTitleChange}
        className="w-full sm:w-48 text-sm"
      />
      <StandaloneDatePicker
        value={startDate || null}
        onChange={(val) => updateParam("start_date", val ?? "")}
        label="از تاریخ"
      />
      <StandaloneDatePicker
        value={endDate || null}
        onChange={(val) => updateParam("end_date", val ?? "")}
        label="تا تاریخ"
      />
      <Input
        placeholder="نام کاربری مهمان..."
        defaultValue={guestUsername}
        onChange={(e) => updateParam("guest_username", e.target.value)}
        className="w-full sm:w-40 text-sm"
      />
    </div>
  );
}
