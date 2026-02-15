"use client";

import useChat from "@/lib/hooks/useChat";

export default function ChatForm() {
  const { handleSubmit, onSubmit } = useChat();
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      id="chatForm"
      className="flex gap-2"
    >
      <input
        id="chatInput"
        className="flex-1 px-3 py-2 rounded-md border border-slate-200 text-sm"
        placeholder="ارسال پیام"
      />
      <button className="px-3 py-2 bg-indigo-600 text-white rounded-md text-sm">
        ارسال
      </button>
    </form>
  );
}
