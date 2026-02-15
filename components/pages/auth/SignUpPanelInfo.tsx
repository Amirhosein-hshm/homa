import { SIGN_UP_INFO } from "@/lib/constants/auth";
import { Check } from "lucide-react";
import Image from "next/image";
export default function SignUpPanelInfo() {
  return (
    <aside
      className="col-span-5 hidden lg:flex flex-col justify-between gap-2 pr-4 border-slate-200 border-l pl-3"
      aria-labelledby="login-info-title"
    >
      <header>
        <h2 id="login-info-title" className="text-sm font-bold text-slate-900">
          عضویت رایگان
        </h2>
        <p className="mt-1 text-replay text-slate-600">
          همین حالا حساب بسازید و از تمام امکانات پلتفرم استفاده کنید.
        </p>
      </header>
      <ul
        className=" space-y-2 text-sm text-slate-700"
        aria-label="مزایای ورود"
      >
        {SIGN_UP_INFO.map((item) => (
          <li key={item.id} className="flex items-start gap-3">
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
      <figure className="ml-4 relative aspect-video">
        <Image
          src="/images/register-demo.avif"
          alt="نمایی از  تیم سامانه  هما"
          className="rounded-sm w-full  h-full object-cover"
          loading="lazy"
          decoding="async"
          width={500}
          quality={100}
          height={450}
        />
        <figcaption className="sr-only">
          پیش‌نمایش ثبت نام برای ورود به سامانه
        </figcaption>
      </figure>
    </aside>
  );
}
