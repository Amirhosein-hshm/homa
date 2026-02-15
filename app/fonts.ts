import localFont from "next/font/local";

export const vazir = localFont({
  src: [
    {
      path: "../public/images/fonts/vazir/Vazir-Thin.woff2",
      weight: "100",
      style: "normal",
    },
    {
      path: "../public/images/fonts/vazir/Vazir.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/images/fonts/vazir/Vazir-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/images/fonts/vazir/Vazir-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  display: "swap",
  variable: "--font-vazir",
});
