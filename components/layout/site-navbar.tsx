// components/site-navbar.tsx
import Link from "next/link";
import Image from "next/image";
import { auth, currentUser } from "@clerk/nextjs/server";
import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";

export default async function SiteNavbar() {
  const { userId } = await auth();
  const isSignedIn = !!userId;
  const user = isSignedIn ? await currentUser() : null;

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
        <div className="flex items-center gap-2">
          {isSignedIn ? (
            <>
              <span className="hidden sm:inline text-sm text-muted-foreground">
                {user?.firstName ?? "Guest"}
              </span>
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
