import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowLeftIcon, HomeIcon, SearchXIcon } from "lucide-react";
import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type ButtonVariant = ComponentProps<typeof Button>["variant"];

type NotFoundAction = {
  href: string;
  label: string;
  variant?: ButtonVariant;
  icon?: ReactNode;
};

type AppNotFoundViewProps = {
  className?: string;
  fullScreen?: boolean;
  code?: string;
  title?: string;
  description?: string;
  primaryAction?: NotFoundAction;
  secondaryAction?: NotFoundAction;
};

const defaultPrimaryAction: NotFoundAction = {
  href: "/",
  label: "بازگشت به مسیر اصلی",
  variant: "default",
  icon: <HomeIcon className="size-4" />,
};

const defaultSecondaryAction: NotFoundAction = {
  href: "/meets",
  label: "رفتن به فهرست جلسات",
  variant: "outline",
  icon: <ArrowLeftIcon className="size-4" />,
};

export default function AppNotFoundView({
  className,
  fullScreen = true,
  code = "404",
  title = "صفحه مورد نظر پیدا نشد",
  description = "ممکن است آدرس اشتباه باشد یا صفحه حذف شده باشد. از مسیرهای زیر ادامه بدهید.",
  primaryAction = defaultPrimaryAction,
  secondaryAction = defaultSecondaryAction,
}: AppNotFoundViewProps) {
  return (
    <section
      className={cn(
        "relative isolate flex w-full items-center justify-center overflow-hidden px-4 py-4 sm:px-6 lg:px-8",
        fullScreen ? "min-h-screen" : "h-full min-h-0",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-rose-50 via-white to-red-50/40" />
      <div className="pointer-events-none absolute -right-16 -top-16 -z-10 h-72 w-72 rounded-full bg-red-200/45 blur-3xl" />
      <div className="pointer-events-none absolute -left-24 bottom-6 -z-10 h-80 w-80 rounded-full bg-rose-200/40 blur-3xl" />

      <Card className="w-full max-w-2xl border-red-200/80 bg-white/95 py-8 shadow-[0_18px_45px_-30px_rgba(127,29,29,0.28)] backdrop-blur">
        <CardHeader className="gap-3 text-center">
          <span className="mx-auto mb-1 flex size-16 items-center justify-center rounded-3xl border border-red-200 bg-red-50 text-red-700">
            <SearchXIcon className="size-8" />
          </span>

          <span
            className="mx-auto inline-flex h-8 items-center rounded-full border border-red-200 bg-red-50 px-3 text-sm font-medium text-red-700"
          >
            خطای {code}
          </span>

          <CardTitle className="pt-2 text-2xl text-red-900 sm:text-3xl">
            {title}
          </CardTitle>
          <CardDescription className="mx-auto max-w-2xl text-base leading-8 text-slate-600">
            {description}
          </CardDescription>
        </CardHeader>

        <CardContent className="grid gap-3 sm:grid-cols-2">
          <Button
            asChild
            variant={primaryAction.variant ?? "default"}
            className={cn(
              "h-11 text-sm",
              (primaryAction.variant ?? "default") === "default" &&
                "bg-red-600 text-white hover:bg-red-700",
            )}
          >
            <Link href={primaryAction.href}>
              {primaryAction.icon}
              {primaryAction.label}
            </Link>
          </Button>

          <Button
            asChild
            variant={secondaryAction.variant ?? "outline"}
            className="h-11 border-slate-300 text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900"
          >
            <Link href={secondaryAction.href}>
              {secondaryAction.icon}
              {secondaryAction.label}
            </Link>
          </Button>
        </CardContent>
      </Card>
    </section>
  );
}
