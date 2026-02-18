"use client";

import SignUpFormView from "./SignUpFormView";
import { useSignUpForm } from "./useSignUpForm";

export default function SignUpForm() {
  const controller = useSignUpForm();
  return <SignUpFormView {...controller} />;
}
