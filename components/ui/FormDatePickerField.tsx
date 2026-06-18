"use client";

import { iranHolidays } from "@/lib/constants/iran-holidays";
import { cn } from "@/lib/utils";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import {
  Control,
  Controller,
  FieldValues,
  Path,
  RegisterOptions,
} from "react-hook-form";
import DatePicker from "react-multi-date-picker";
import { Input } from "./input";

const HOLIDAYS_1405_SET = new Set(iranHolidays);

type JalaliDate = {
  year: number;
  month: { number: number };
  day: number;
  weekDay: { index: number };
};

const jalaliKey = (date: JalaliDate) => {
  const y = date.year;
  const m = String(date.month.number).padStart(2, "0");
  const d = String(date.day).padStart(2, "0");
  return `${y}/${m}/${d}`;
};

type CustomDatePickerProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  rules?: Omit<
    RegisterOptions<T, Path<T>>,
    "setValueAs" | "disabled" | "valueAsNumber" | "valueAsDate"
  >;
  placeholder?: string;
};

function isObjectWithToDate(v: unknown): v is { toDate: () => Date } {
  return (
    typeof v === "object" &&
    v !== null &&
    "toDate" in (v as Record<string, unknown>) &&
    typeof (v as { toDate?: unknown }).toDate === "function"
  );
}

function isDateLike(v: unknown): v is Date {
  return v instanceof Date;
}

function isString(v: unknown): v is string {
  return typeof v === "string";
}

function toDate(value: unknown): Date | null {
  if (value === null || value === undefined) return null;
  if (isDateLike(value)) return value;
  if (isObjectWithToDate(value)) return value.toDate();
  if (Array.isArray(value)) return toDate(value[0]);
  if (isString(value)) {
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d;
  }
  const d = new Date(value as unknown as string);
  return isNaN(d.getTime()) ? null : d;
}

function toISOStringWithoutTimeZone(date: Date) {
  return new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
  ).toISOString();
}

function FormDatePickerField<T extends FieldValues>({
  control,
  name,
  rules,
  placeholder,
  label,
}: CustomDatePickerProps<T>) {
  return (
    <div className="w-full grow flex flex-col gap-1">
      {label && (
        <label
          className={cn("block text-xs font-medium text-tint-blue-500 w-full")}
        >
          {label}
        </label>
      )}

      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field, fieldState }) => {
          const pickerValue = toDate(field.value) || null;
          return (
            <>
              <DatePicker
                value={pickerValue}
                onChange={(val: unknown) => {
                  const d = toDate(val);
                  if (d === null) return field.onChange(null);
                  field.onChange(toISOStringWithoutTimeZone(d));
                }}
                calendar={persian}
                locale={persian_fa}
                range={false}
                mapDays={({ date }: { date: JalaliDate }) => {
                  const isFriday = date.weekDay.index === 6;
                  const key = jalaliKey(date);
                  const isHoliday = HOLIDAYS_1405_SET.has(key);
                  if (isFriday || isHoliday) {
                    return { style: { color: "red", fontWeight: "bold" } };
                  }
                }}
                render={(val: string, openCalendar: () => void) => (
                  <Input
                    value={val}
                    onFocus={openCalendar}
                    readOnly
                    id={name}
                    placeholder={placeholder}
                    className={cn(
                      fieldState?.error && "border-destructive",
                      "w-full",
                    )}
                  />
                )}
              />
              {fieldState?.error && (
                <p className="text-destructive text-[0.625rem] font-medium mt-[0.125rem]">
                  {fieldState.error.message}
                </p>
              )}
            </>
          );
        }}
      />
    </div>
  );
}

export default FormDatePickerField;
