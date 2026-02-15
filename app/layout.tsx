import type { Metadata } from "next";
import { vazir } from "./fonts";
import "./globals.css";
import Providers from "./providers";

export const metadata: Metadata = {
  title: {
    default: "هما | سامانه جلسات آنلاین ",
    template: "%s | هما",
  },
  description:
    "هما یک ابزار مدیریت وظایف شبیه Jira برای برنامه‌ریزی، پیگیری و همکاری تیم‌هاست.",
  applicationName: "homa",
  // icons: {
  //   icon: [
  //     { url: "", type: "image/svg+xml" },
  //     { url: "", type: "image/x-icon" },
  //   ],
  // },
  openGraph: {
    type: "website",
    locale: "fa_IR",
    siteName: "هما",
    title: "هما | سامانه جلسات آنلاین",
    description: "",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body className={` antialiased ${vazir.variable}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
