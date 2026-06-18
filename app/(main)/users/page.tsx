"use client";

import { UserManagementTable } from "@/components/pages/users/UserManagementTable";

export default function UsersPage() {
  return (
    <div className="h-full flex flex-col">
      <UserManagementTable />
    </div>
  );
}
