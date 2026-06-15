"use client";

import { useGetMeetByHashMeetsMeetHashGet } from "@/lib/generated/hooks/meets";
import CreateEditMeetSheetView from "./CreateEditMeetSheetView";
import { useCreateEditMeetForm } from "./useCreateEditMeetForm";

type CreateEditMeetSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editMeetHash: string | null;
};

export default function CreateEditMeetSheet({
  open,
  onOpenChange,
  editMeetHash,
}: CreateEditMeetSheetProps) {
  const { data: detailResponse, isLoading: isLoadingDetail } = useGetMeetByHashMeetsMeetHashGet(
    editMeetHash ?? "",
    {
      query: { enabled: !!editMeetHash && open },
    },
  );

  const detailData =
    detailResponse && detailResponse.status === 200
      ? ((detailResponse as { data: { data: { title: string; start_time: string; expires_at: string } } }).data?.data ?? null)
      : null;

  const formController = useCreateEditMeetForm({
    editMeetHash,
    detailData,
    onSuccess: () => onOpenChange(false),
  });

  return (
    <CreateEditMeetSheetView
      {...formController}
      open={open}
      onOpenChange={onOpenChange}
      isEditMode={!!editMeetHash}
      isLoadingDetail={isLoadingDetail}
    />
  );
}
