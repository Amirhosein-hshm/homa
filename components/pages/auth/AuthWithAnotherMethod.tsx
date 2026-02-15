import GithubIcon from "@/components/icons/GithubIcon";
import GoogleIcon from "@/components/icons/GoogleIcon";

export default function AuthWithAnotherMethod() {
  return (
    <>
      <div className="relative my-5">
        <hr className="border-slate-100" />
        <span
          className="absolute inset-x-0 top-1/2 -translate-y-1/2 mx-auto w-fit bg-white px-3 text-xs text-slate-400"
          role="presentation"
        >
          یا ورود با
        </span>
      </div>

      <div
        className="flex gap-3"
        role="group"
        aria-label="ورود با سرویس‌های خارجی"
      >
        <button
          type="button"
          aria-label="ورود با گوگل"
          data-provider="google"
          className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 border rounded-md hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition"
        >
          <GoogleIcon aria-hidden="true" />
          <span>گوگل</span>
        </button>

        <button
          type="button"
          aria-label="ورود با گیت‌هاب"
          data-provider="github"
          className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 border rounded-md hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition"
        >
          <GithubIcon aria-hidden="true" />
          <span>گیت‌هاب</span>
        </button>
      </div>
    </>
  );
}
