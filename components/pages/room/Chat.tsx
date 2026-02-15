import ChatForm from "./ChatForm";

export default async function Chat() {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm flex flex-col">
      <h3 className="text-sm font-medium mb-2">چت</h3>
      <div
        id="chatBox"
        className="flex-1 overflow-auto min-h-[120px] max-h-64 space-y-2 text-sm mb-3"
      >
        <div className="text-xs text-slate-400">
          چت جلسه برای شرکت‌کنندگان قابل مشاهده است
        </div>
        <div className="p-2 bg-slate-100 rounded-md text-slate-700">
          جمشید: سلام
        </div>
        <div className="p-2 bg-indigo-50 rounded-md text-slate-700">
          شما: برای جلسه آماده اید؟
        </div>
      </div>

      <ChatForm />
    </div>
  );
}
