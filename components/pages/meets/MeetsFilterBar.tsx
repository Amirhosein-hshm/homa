"use client";

import { Input } from "@/components/ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";

export default function MeetsFilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const titleQuery = searchParams.get("title_query") ?? "";
  const startDate = searchParams.get("start_date") ?? "";
  const endDate = searchParams.get("end_date") ?? "";

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
        className="w-48 text-sm"
      />
      <Input
        type="date"
        placeholder="از تاریخ"
        defaultValue={startDate}
        onChange={(e) => updateParam("start_date", e.target.value)}
        className="w-40 text-sm"
      />
      <Input
        type="date"
        placeholder="تا تاریخ"
        defaultValue={endDate}
        onChange={(e) => updateParam("end_date", e.target.value)}
        className="w-40 text-sm"
      />
    </div>
  );
}
