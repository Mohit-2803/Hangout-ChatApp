// components/site-navbar.tsx
"use client";
import Link from "next/link";
import Image from "next/image";
import { useAuth, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import { Skeleton } from "@/components/ui/skeleton";
import { ThemeToggle } from "@/components/ui/theme/theme-toggle";

export default function SiteNavbar() {
  const { isLoaded, isSignedIn } = useAuth();
  const { isLoaded: isUserLoaded } = useUser();

  return (
    <header className="sticky top-0 z-40 w-full border-b backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold tracking-tight"
        >
          <Image
            src="/logo.svg"
            alt="Hangout Logo"
            width={24}
            height={24}
            className="h-6 w-6"
          />
          Hangout
        </Link>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          {!isLoaded || !isUserLoaded ? (
            // Skeleton loader while authentication is loading
            <div className="flex items-center gap-2">
              <Skeleton className="h-9 w-16 rounded" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          ) : isSignedIn ? (
            <>
              <UserButton afterSignOutUrl="/" />
            </>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/sign-in">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/sign-up">Sign Up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
