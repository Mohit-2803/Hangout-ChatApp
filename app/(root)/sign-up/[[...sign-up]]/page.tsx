"use client";

import { SignUp } from "@clerk/nextjs";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect } from "react";

// Skeleton component for Clerk loading
const ClerkSkeleton = () => (
  <div className="space-y-4 w-full max-w-md">
    <div className="space-y-2">
      <Skeleton className="h-4 w-28" />
      <Skeleton className="h-10 w-full" />
    </div>
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
      <SignUp
        appearance={{
          elements: {
            formButtonPrimary: "bg-blue-600 hover:bg-blue-700",
            card: "shadow-none border-0",
            headerTitle: "hidden",
            headerSubtitle: "hidden",
          },
        }}
        redirectUrl="/conversations?signup=success"
        signInUrl="/sign-in"
      />
    </div>
  ) : (
    <ClerkSkeleton />
  );
};

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Sign Up Form */}
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
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Get Started
            </h2>
            <p className="text-gray-600">
              Create your account and start connecting with friends.
            </p>
          </div>

          <ClerkWrapper />
        </div>
      </div>

      {/* Right side - Full Image with Overlay */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        {/* Background Image */}
        <Image
          src="/chat-2.jpg"
          alt="Signup illustration"
          fill
          className="object-cover"
          priority
        />
      </div>
    </div>
  );
}
