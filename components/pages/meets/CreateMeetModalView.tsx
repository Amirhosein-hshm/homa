"use client";

import { AppModal } from "@/components/ui/AppModal";
import { Button } from "@/components/ui/button";
import { FormInputField } from "@/components/ui/FormInputField";
import { PlusIcon } from "lucide-react";
import type { CreateMeetFormController } from "./useCreateMeetForm";

type CreateMeetModalViewProps = CreateMeetFormController;

export default function CreateMeetModalView({
  control,
  isPending,
  isValid,
  open,
  onOpenChange,
  onSubmit,
}: CreateMeetModalViewProps) {
  return (
    <AppModal
      open={open}
      onOpenChange={onOpenChange}
      title="ایجاد جلسه جدید"
      description="عنوان جلسه را وارد کنید تا لینک ورود اختصاصی ایجاد شود."
      trigger={
        <Button
          variant="default"
          size="sm"
          className="bg-indigo-600 text-white hover:bg-indigo-700"
        >
          <PlusIcon />
          ایجاد جلسه
        </Button>
      }
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            onClick={() => onOpenChange(false)}
          >
            انصراف
          </Button>
          <Button
            form="createMeetForm"
            type="submit"
            disabled={!isValid || isPending}
            className="bg-indigo-600 text-white hover:bg-indigo-700"
          >
            {isPending ? "در حال ایجاد..." : "ایجاد جلسه"}
          </Button>
        </>
      }
    >
      <form id="createMeetForm" className="space-y-4" onSubmit={onSubmit} noValidate>
        <FormInputField
          id="title"
          name="title"
          control={control}
          label="عنوان جلسه"
          placeholder="مثال: جلسه برنامه‌ریزی هفتگی"
          autoComplete="off"
        />
      </form>
    </AppModal>
  );
}
