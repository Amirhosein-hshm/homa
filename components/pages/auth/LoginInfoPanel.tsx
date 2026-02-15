import { LOGIN_INFO } from "@/lib/constants/auth";
import { Check } from "lucide-react";
import Image from "next/image";

export default function LoginInfoPanel() {
  return (
    <aside
      className="col-span-5 hidden lg:flex flex-col justify-between gap-2  border-slate-200 border-l pl-6"
      aria-labelledby="login-info-title"
    >
      <header>
        <h2 id="login-info-title" className="text-lg font-bold text-slate-900">
          ورود به سامانه
        </h2>
        <p className="text-sm text-replay text-slate-600">
          دسترسی سریع و امن به جلسات و داشبورد تیمی
        </p>
      </header>
      <ul
        className="mt-4 space-y-2 text-sm text-slate-700"
        aria-label="مزایای ورود"
      >
        {LOGIN_INFO.map((item) => (
          <li key={item.id} className="flex items-start gap-3 text-xs">
            <Check
              className="mt-0.5 stroke-emerald-600"
              size={20}
              aria-hidden="true"
              focusable="false"
            />
            <span>{item.label}</span>
          </li>
        ))}
      </ul>
      <figure className=" relative  aspect-video max-h-[50%]">
        <Image
          src="/images/login-demo.avif"
          alt="نمایی از داشبورد تیمی سامانه هما"
          className="rounded-sm w-full h-full object-cover"
          loading="lazy"
          decoding="async"
          width={500}
          quality={100}
          height={200}
        />
        <figcaption className="sr-only">پیش‌نمایش صفحه ورود</figcaption>
      </figure>
    </aside>
  );
}
