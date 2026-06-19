"use client";

import { InputHTMLAttributes, useId } from "react";
import {
  Control,
  Controller,
  FieldValues,
  Path,
  RegisterOptions,
} from "react-hook-form";

import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { Input } from "./input";
import { Label } from "./label";

const normalizeNumber = (value: string) =>
  value.replace(/[۰-۹]/g, (d) => {
    const index = "۰۱۲۳۴۵۶۷۸۹".indexOf(d);
    return String(index);
  });

const toPersianDigits = (value: string) =>
  value.replace(/[0-9]/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);

interface Props<
  T extends FieldValues,
> extends InputHTMLAttributes<HTMLInputElement> {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  rules?: RegisterOptions<T, Path<T>>;
  type?: HTMLInputElement["type"];
  nuSeparator?: boolean;
  clearable?: boolean;
  "data-cy"?: string;
}

function FormInputField<T extends FieldValues>({
  label,
  name,
  control,
  className,
  rules,
  type = "text",
  nuSeparator = false,
  clearable = false,
  id,
  ...props
}: Props<T>) {
  const reactId = useId();
  const inputId = id ?? `${name}-${reactId}`;
  const errorId = `${inputId}-error`;

  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <Label htmlFor={inputId} className="text-sm font-medium cursor-pointer">
          {label}
        </Label>
      )}

      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({ field, fieldState }) => {
          const hasError = Boolean(fieldState.error);

          const displayValue =
            field.value === undefined || field.value === null
              ? ""
              : type === "number" && nuSeparator
                ? toPersianDigits(
                    String(field.value).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                  )
                : String(field.value);

          return (
            <>
              <div className="relative">
                <Input
                  {...props}
                  {...field}
                  id={inputId}
                  type={type}
                  data-cy={props["data-cy"]}
                  inputMode={type === "number" ? "numeric" : undefined}
                  value={displayValue}
                  aria-invalid={hasError}
                  aria-describedby={hasError ? errorId : undefined}
                  onChange={(e) => {
                    if (type !== "number" || !nuSeparator) {
                      field.onChange(e.target.value);
                      return;
                    }

                    const raw = normalizeNumber(e.target.value).replace(/,/g, "");
                    const num = Number(raw);
                    field.onChange(!isNaN(num) ? num : undefined);
                  }}
                  className={cn(
                    "w-full px-3 py-2 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-100",
                    hasError && "border-destructive focus:ring-destructive/20",
                    className,
                    clearable && displayValue && "pl-8",
                  )}
                />
                {clearable && displayValue && (
                  <button
                    type="button"
                    onClick={() => field.onChange(type === "number" ? null : "")}
                    className="absolute left-2 top-1/2 -translate-y-1/2 size-4 rounded hover:bg-slate-100 inline-flex items-center justify-center text-slate-400 hover:text-slate-600"
                  >
                    <X className="size-3" />
                  </button>
                )}
              </div>

              {hasError && (
                <p
                  id={errorId}
                  role="alert"
                  className="text-destructive text-[0.625rem] font-medium mt-0.5"
                >
                  {fieldState.error?.message}
                </p>
              )}
            </>
          );
        }}
      />
    </div>
  );
}

export { FormInputField };
