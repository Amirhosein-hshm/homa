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
import { useDeleteUserUsersUserIdDelete } from "@/lib/generated/hooks";
import { getGetCurrentUserProfileUsersMeGetQueryKey, getListUsersUsersGetQueryKey } from "@/lib/generated/endpoints/users/users";
import { useQueryClient } from "@tanstack/react-query";

type DeleteUserDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: number;
  username: string;
};

export function DeleteUserDialog({
  open,
  onOpenChange,
  userId,
  username,
}: DeleteUserDialogProps) {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useDeleteUserUsersUserIdDelete({
    mutation: {
      onSuccess: (response) => {
        if (response.status === 200) {
          queryClient.invalidateQueries({
            queryKey: getListUsersUsersGetQueryKey(),
          });
          queryClient.invalidateQueries({
            queryKey: getGetCurrentUserProfileUsersMeGetQueryKey(),
          });
          onOpenChange(false);
        }
      },
    },
  });

  const handleDelete = () => {
    mutate({ userId });
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>حذف کاربر</AlertDialogTitle>
          <AlertDialogDescription>
            آیا از حذف کاربر <span className="font-semibold">{username}</span>{" "}
            اطمینان دارید؟ این عمل قابل بازگشت نیست.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>انصراف</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isPending}
            className="bg-red-600 hover:bg-red-700"
          >
            {isPending ? "در حال حذف..." : "حذف"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
