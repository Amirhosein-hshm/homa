"use client";

import { EditProfileFormView } from "./EditProfileFormView";
import { useEditProfileForm } from "./useEditProfileForm";

export default function EditProfileForm() {
  const controller = useEditProfileForm();
  return <EditProfileFormView {...controller} />;
}
