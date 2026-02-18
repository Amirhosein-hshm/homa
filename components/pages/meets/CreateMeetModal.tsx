"use client";

import CreateMeetModalView from "./CreateMeetModalView";
import { useCreateMeetForm } from "./useCreateMeetForm";

export default function CreateMeetModal() {
  const controller = useCreateMeetForm();
  return <CreateMeetModalView {...controller} />;
}
