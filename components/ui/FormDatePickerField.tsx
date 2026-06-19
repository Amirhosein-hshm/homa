"use client";

import { iranHolidays } from "@/lib/constants/iran-holidays";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import {
  type Control,
  Controller,
  type FieldValues,
  type Path,
  type RegisterOptions,
} from "react-hook-form";
import DatePicker from "react-multi-date-picker";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
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

type FormDatePickerFieldProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  rules?: Omit<
    RegisterOptions<T, Path<T>>,
    "setValueAs" | "disabled" | "valueAsNumber" | "valueAsDate"
  >;
  placeholder?: string;
  enableTime?: boolean;
};

type StandaloneDatePickerProps = {
  value?: string | null;
  onChange?: (value: string | null) => void;
  label?: string;
  placeholder?: string;
  enableTime?: boolean;
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

function toISOStringWithTime(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}

function DatePickerWidget({
  value,
  enableTime,
  onChange,
  onFocus,
  name,
  placeholder,
  error,
}: {
  value: Date | null;
  enableTime?: boolean;
  onChange: (val: unknown) => void;
  onFocus?: () => void;
  name?: string;
  placeholder?: string;
  error?: boolean;
}) {
  return (
    <DatePicker
      value={value}
      onChange={onChange}
      calendar={persian}
      locale={persian_fa}
      range={false}
      format={enableTime ? "YYYY/MM/DD HH:mm:ss" : "YYYY/MM/DD"}
      plugins={enableTime ? [<TimePicker key="time" position="bottom" />] : undefined}
      mapDays={({ date }: { date: JalaliDate }) => {
        const isFriday = date.weekDay.index === 6;
        const key = jalaliKey(date);
        const isHoliday = HOLIDAYS_1405_SET.has(key);
        if (isFriday || isHoliday) {
          return { style: { color: "red", fontWeight: "bold" } };
        }
      }}
      render={(val: string, openCalendar: () => void) => (
        <div className="relative">
          <Input
            value={val}
            onFocus={() => {
              openCalendar();
              onFocus?.();
            }}
            readOnly
            id={name}
            placeholder={placeholder}
            className={cn(error && "border-destructive", "w-full")}
          />
          {val && (
            <span
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onChange(null);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  e.stopPropagation();
                  onChange(null);
                }
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 size-4 rounded hover:bg-slate-100 inline-flex items-center justify-center text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="size-3" />
            </span>
          )}
        </div>
      )}
    />
  );
}

function FormDatePickerField<T extends FieldValues>({
  control,
  name,
  rules,
  placeholder,
  label,
  enableTime,
}: FormDatePickerFieldProps<T>) {
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
              <DatePickerWidget
                value={pickerValue}
                enableTime={enableTime}
                name={name as string}
                placeholder={placeholder}
                error={!!fieldState?.error}
                onChange={(val: unknown) => {
                  const d = toDate(val);
                  if (d === null) return field.onChange(null);
                  if (enableTime) {
                    field.onChange(toISOStringWithTime(d));
                  } else {
                    field.onChange(toISOStringWithoutTimeZone(d));
                  }
                }}
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

export function StandaloneDatePicker({
  value,
  onChange,
  label,
  placeholder,
  enableTime,
}: StandaloneDatePickerProps) {
  const pickerValue = toDate(value) || null;
  return (
    <div className="w-full grow flex flex-col gap-1">
      {label && (
        <label className="block text-xs font-medium text-tint-blue-500 w-full">
          {label}
        </label>
      )}
      <DatePickerWidget
        value={pickerValue}
        enableTime={enableTime}
        placeholder={placeholder}
        onChange={(val: unknown) => {
          const d = toDate(val);
          if (d === null) {
            onChange?.(null);
          } else if (enableTime) {
            onChange?.(toISOStringWithTime(d));
          } else {
            onChange?.(toISOStringWithoutTimeZone(d));
          }
        }}
      />
    </div>
  );
}

export default FormDatePickerField;
