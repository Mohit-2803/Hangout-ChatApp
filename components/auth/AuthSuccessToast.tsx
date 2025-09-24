"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

const AuthSuccessToast = () => {
  const searchParams = useSearchParams();

  useEffect(() => {
    const isSignUp = searchParams.get("signup") === "success";
    const isSignIn = searchParams.get("signin") === "success";

    if (isSignUp) {
      toast.success("Account created successfully! Welcome to Hangout!");
    } else if (isSignIn) {
      toast.success("Signed in successfully! Welcome back!");
    }
  }, [searchParams]);

  return null;
};

export default AuthSuccessToast;
