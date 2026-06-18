"use client";

import { MyProfileFormView } from "./MyProfileFormView";
import { useMyProfileForm } from "./useMyProfileForm";

export default function MyProfileForm() {
  const controller = useMyProfileForm();
  return <MyProfileFormView {...controller} />;
}
