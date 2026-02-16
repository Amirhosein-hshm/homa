"use client";

import LoginFormView from "./LoginFormView";
import { useLoginForm } from "./useLoginForm";

export default function LoginForm() {
  const controller = useLoginForm();
  return <LoginFormView {...controller} />;
}
