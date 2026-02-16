export const HTTP_STATUS_MESSAGES: Record<number, string> = {
  200: "عملیات با موفقیت انجام شد.",
  201: "با موفقیت ایجاد شد.",
  204: "با موفقیت حذف شد.",
  400: "درخواست نامعتبر است.",
  401: "ابتدا وارد حساب کاربری شوید.",
  403: "دسترسی غیرمجاز.",
  404: "یافت نشد.",
  409: "تداخل در اطلاعات.",
  422: "خطای اعتبارسنجی مقادیر.",
  429: "تعداد درخواست‌ها بیش از حد مجاز است.",
  500: "خطای سرور. کمی بعد تلاش کنید.",
  503: "سرویس موقتاً در دسترس نیست.",
};

export const DEFAULT_ERROR_MESSAGE = "خطای غیرمنتظره‌ای رخ داد.";
export const SUCCESS_MESSAGE_DEFAULT = "عملیات با موفقیت انجام شد.";
export const DEFAULT_CLIENT_ERROR_MESSAGE = "درخواست قابل پردازش نیست.";
export const DEFAULT_SERVER_ERROR_MESSAGE = "خطای سرور. کمی بعد تلاش کنید.";

export const getStatusMessage = (status?: number): string | undefined => {
  if (typeof status !== "number") {
    return undefined;
  }

  if (HTTP_STATUS_MESSAGES[status]) {
    return HTTP_STATUS_MESSAGES[status];
  }

  if (status >= 200 && status < 300) {
    return SUCCESS_MESSAGE_DEFAULT;
  }

  if (status >= 400 && status < 500) {
    return DEFAULT_CLIENT_ERROR_MESSAGE;
  }

  if (status >= 500 && status < 600) {
    return DEFAULT_SERVER_ERROR_MESSAGE;
  }

  return undefined;
};
