"use client";

import { Controller } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { AsyncUserSelect } from "@/components/ui/AsyncUserSelect";
import FormDatePickerField from "@/components/ui/FormDatePickerField";
import { FormInputField } from "@/components/ui/FormInputField";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { CreateEditMeetFormController } from "./useCreateEditMeetForm";

type CreateEditMeetSheetViewProps = CreateEditMeetFormController & {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEditMode: boolean;
  isLoadingDetail: boolean;
};

export default function CreateEditMeetSheetView({
  control,
  isPending,
  isValid,
  open,
  onOpenChange,
  onSubmit,
  isEditMode,
  isLoadingDetail,
  resetForm,
}: CreateEditMeetSheetViewProps) {
  const handleClose = () => {
    if (isPending) return;
    resetForm();
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent side="right" className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>{isEditMode ? "ویرایش جلسه" : "ایجاد جلسه جدید"}</SheetTitle>
          <SheetDescription>
            {isEditMode
              ? "اطلاعات جلسه را ویرایش کنید."
              : "اطلاعات جلسه جدید را وارد کنید."}
          </SheetDescription>
        </SheetHeader>

        {isEditMode && isLoadingDetail ? (
          <div className="flex items-center justify-center py-12 text-sm text-slate-500">
            در حال دریافت اطلاعات جلسه...
          </div>
        ) : (
          <form id="meetForm" onSubmit={onSubmit} noValidate className="flex flex-col gap-4 px-4 py-2">
            <FormInputField
              id="title"
              name="title"
              control={control}
              label="عنوان جلسه"
              placeholder="مثال: جلسه برنامه‌ریزی هفتگی"
              autoComplete="off"
            />
            <FormDatePickerField
              name="start_time"
              control={control}
              label="زمان شروع"
              placeholder="تاریخ و زمان شروع جلسه"
              enableTime
            />
            <FormDatePickerField
              name="expires_at"
              control={control}
              label="زمان انقضا"
              placeholder="تاریخ و زمان پایان جلسه"
              enableTime
            />
            <Controller
              name="guest_usernames"
              control={control}
              render={({ field }) => (
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium">مهمانان</label>
                  <AsyncUserSelect
                    mode="multiple"
                    value={field.value ?? []}
                    onChange={(val) => field.onChange(val)}
                    placeholder="انتخاب مهمانان..."
                  />
                </div>
              )}
            />
          </form>
        )}

        <SheetFooter>
          <Button type="button" variant="outline" disabled={isPending} onClick={handleClose}>
            انصراف
          </Button>
          <Button
            form="meetForm"
            type="submit"
            disabled={!isValid || isPending || isLoadingDetail}
          >
            {isPending ? "در حال ذخیره..." : isEditMode ? "ویرایش جلسه" : "ایجاد جلسه"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
