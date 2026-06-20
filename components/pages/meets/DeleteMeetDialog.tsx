"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDeleteMeetMeetsMeetHashDelete } from "@/lib/generated/hooks/meets";
import { useQueryClient } from "@tanstack/react-query";
import type { MeetListItemData } from "@/lib/generated/types/model";

type DeleteMeetDialogProps = {
  meet: MeetListItemData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function DeleteMeetDialog({ meet, open, onOpenChange }: DeleteMeetDialogProps) {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useDeleteMeetMeetsMeetHashDelete({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/meets"] });
        queryClient.invalidateQueries({ queryKey: ["/users/me"] });
        queryClient.invalidateQueries({ queryKey: ["/users/me/invitations"] });
        queryClient.invalidateQueries({ queryKey: ["/users/me/managed-meets"] });
        onOpenChange(false);
      },
    },
  });

  const handleDelete = () => {
    if (!meet) return;
    mutate({ meetHash: meet.meet_hash });
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogTitle>حذف جلسه</AlertDialogTitle>
          <AlertDialogDescription>
            آیا از حذف جلسه «{meet?.title}» اطمینان دارید؟ این عملیات قابل بازگشت نیست.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>انصراف</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={isPending}
            onClick={handleDelete}
          >
            {isPending ? "در حال حذف..." : "حذف جلسه"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
