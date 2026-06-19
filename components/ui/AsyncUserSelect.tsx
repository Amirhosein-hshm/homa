"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { Check, ChevronsUpDown, Loader2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useListUsersUsersGet } from "@/lib/generated/hooks";
import type { ListUsersUsersGetParams } from "@/lib/generated/types/operations";

interface AsyncUserSelectProps {
  mode: "single" | "multiple";
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function AsyncUserSelect({
  mode,
  value: externalValue,
  onChange,
  placeholder,
  disabled,
}: AsyncUserSelectProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const singleValue = typeof externalValue === "string" ? externalValue : "";
  const multipleValues = Array.isArray(externalValue) ? externalValue : [];

  const params: ListUsersUsersGetParams = {
    page: 1,
    size: 20,
    username: searchTerm || null,
  };

  const { data, isFetching } = useListUsersUsersGet(params);

  const users =
    data && data.status === 200
      ? ((data as { data: { data: { username: string; first_name: string; last_name: string }[]; total: number }; status: 200 }).data?.data ?? [])
      : [];

  const debouncedSetSearch = useCallback((value: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setSearchTerm(value);
    }, 400);
  }, []);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const handleSelect = (username: string) => {
    if (mode === "single") {
      onChange?.(username);
      setOpen(false);
    } else {
      const alreadySelected = multipleValues.includes(username);
      const next = alreadySelected
        ? multipleValues.filter((u) => u !== username)
        : [...multipleValues, username];
      onChange?.(next);
    }
  };

  const handleRemove = (username: string) => {
    if (mode === "multiple") {
      onChange?.(multipleValues.filter((u) => u !== username));
    }
  };

  const handleClear = () => {
    if (mode === "single") {
      onChange?.("");
    } else {
      onChange?.([]);
    }
  };

  return (
    <div className="flex flex-col gap-1">
      {mode === "multiple" && multipleValues.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-1">
          {multipleValues.map((username) => (
            <span
              key={username}
              className="inline-flex items-center gap-1 rounded-full bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 text-xs font-medium text-indigo-700"
            >
              {username}
              <button
                type="button"
                onClick={() => handleRemove(username)}
                className="size-3.5 rounded-full hover:bg-indigo-200 inline-flex items-center justify-center"
              >
                <X className="size-2.5" />
              </button>
            </span>
          ))}
        </div>
      )}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className={cn(
              "w-full justify-between text-sm font-normal",
              mode === "single" && !singleValue && "text-muted-foreground",
            )}
          >
            {mode === "single"
              ? singleValue || placeholder || "انتخاب کاربر..."
              : placeholder || "انتخاب کاربران..."}
            <div className="flex items-center gap-1">
              {singleValue || multipleValues.length > 0 ? (
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleClear();
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      e.stopPropagation();
                      handleClear();
                    }
                  }}
                  className="size-4 rounded hover:bg-slate-100 inline-flex items-center justify-center cursor-pointer"
                >
                  <X className="size-3" />
                </span>
              ) : null}
              <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
          <Command shouldFilter={false}>
            <CommandInput
              placeholder="جستجوی کاربر..."
              onValueChange={debouncedSetSearch}
            />
            <CommandList>
              {isFetching && (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="size-4 animate-spin text-slate-400" />
                </div>
              )}
              {!isFetching && users.length === 0 && (
                <CommandEmpty>
                  {searchTerm ? "کاربری یافت نشد." : "برای جستجو تایپ کنید..."}
                </CommandEmpty>
              )}
              <CommandGroup>
                {users.map((user) => {
                  const isSelected = mode === "single"
                    ? singleValue === user.username
                    : multipleValues.includes(user.username);
                  return (
                    <CommandItem
                      key={user.username}
                      value={user.username}
                      onSelect={() => handleSelect(user.username)}
                    >
                      <Check
                        className={cn(
                          "size-4",
                          isSelected ? "opacity-100" : "opacity-0",
                        )}
                      />
                      <span className="ml-auto">
                        {user.first_name} {user.last_name}
                      </span>
                      <span className="text-xs text-slate-400 dir-ltr" dir="ltr">
                        @{user.username}
                      </span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
