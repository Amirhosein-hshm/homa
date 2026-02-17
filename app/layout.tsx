import type { Metadata } from "next";
import { vazir } from "./fonts";
import "./globals.css";
import Providers from "./providers";

const APP_NAME = "هما";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
const APP_TITLE = "هما | مدیریت هوشمند جلسات آنلاین";
const APP_DESCRIPTION =
  "هما یک پلتفرم مدیریت جلسات آنلاین برای برنامه‌ریزی، پیگیری، هماهنگی تیمی و اجرای جلسه با تجربه کاربری سریع و امن است.";

export const metadata: Metadata = {
  title: {
    default: APP_TITLE,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  applicationName: APP_NAME,
  metadataBase: new URL(APP_URL),
  referrer: "origin-when-cross-origin",
  alternates: {
    canonical: "/",
  },
  category: "productivity",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  keywords: [
    "هما",
    "مدیریت جلسات",
    "جلسات آنلاین",
    "هماهنگی تیم",
    "برنامه‌ریزی جلسه",
    "تقویم تیمی",
    "collaboration software",
    "team meeting management",
  ],
  authors: [{ name: "تیم محصول هما", url: APP_URL }],
  creator: "تیم فنی هما",
  publisher: "هما",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [{ url: "/favicon.ico", sizes: "any" }],
    shortcut: ["/favicon.ico"],
    apple: [{ url: "/favicon.ico" }],
  },
  openGraph: {
    type: "website",
    locale: "fa_IR",
    url: APP_URL,
    siteName: APP_NAME,
    title: APP_TITLE,
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: APP_TITLE,
    description: APP_DESCRIPTION,
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
