"use client";

import { SignIn } from "@clerk/nextjs";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect } from "react";

// Skeleton component for Clerk loading
const ClerkSkeleton = () => (
  <div className="space-y-4 w-full max-w-md">
    <div className="space-y-2">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-10 w-full" />
    </div>
    <div className="space-y-2">
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-10 w-full" />
    </div>
    <Skeleton className="h-10 w-full" />
    <div className="flex space-x-2">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
    </div>
    <Skeleton className="h-4 w-48 mx-auto" />
  </div>
);

const ClerkWrapper = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  return isLoaded ? (
    <div className="w-full flex justify-center">
      <SignIn
        appearance={{
          elements: {
            formButtonPrimary: "bg-blue-600 hover:bg-blue-700",
            card: "shadow-none border-0",
            headerTitle: "hidden",
            headerSubtitle: "hidden",
          },
        }}
        redirectUrl="/dashboard"
        signUpUrl="/sign-up"
      />
    </div>
  ) : (
    <ClerkSkeleton />
  );
};

export default function SignInPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Full Image with Overlay */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        {/* Background Image */}
        <Image
          src="/login.jpg"
          alt="Login illustration"
          fill
          className="object-cover"
          priority
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Text Content Overlay */}
        <div className="relative z-10 flex flex-col justify-center items-center text-white p-12 w-full">
          <div className="text-center space-y-6">
            <h1 className="text-5xl font-bold mb-4">Welcome Back!</h1>
            <p className="text-xl max-w-md leading-relaxed">
              Sign in to continue your conversations and stay connected with
              your friends.
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Sign In Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            {/* Logo for mobile and desktop */}
            <div className="mb-6">
              <Image
                src="/logo.svg"
                alt="Hangout Logo"
                width={60}
                height={60}
                className="mx-auto"
              />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Sign In</h2>
            <p className="text-gray-600">
              Welcome back! Please sign in to your account.
            </p>
          </div>

          <ClerkWrapper />
        </div>
      </div>
    </div>
  );
}
