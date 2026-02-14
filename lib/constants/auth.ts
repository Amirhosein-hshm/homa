import { v4 as uuidv4 } from 'uuid';
type AuthInfo = {
  id: string,
  label: string;
};


export const LOGIN_INFO: AuthInfo[] = [
  {
    id: uuidv4(),
    label: "ورود امن با رمزگذاری و گزینهٔ ورود اجتماعی",
  },
  {
    id: uuidv4(),
    label: "یادآوری ورود برای راحتی در دفعات بعد",
  },
  {
    id: uuidv4(),
    label: "پشتیبانی از حساب‌های گوگل و گیت‌هاب",
  },

];

export const SIGN_UP_INFO: AuthInfo[] = [
  {
    id: uuidv4(),
    label: "ثبت‌نام سریع در کمتر از ۶۰ ثانیه",
  },
  {
    id: uuidv4(),
    label: "دسترسی فوری به داشبورد تیمی",
  },
  {
    id: uuidv4(),
    label: "ورود با گوگل و گیت‌هاب (به‌زودی)",
  },

];



