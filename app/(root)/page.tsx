// app/page.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { auth } from "@clerk/nextjs/server";

export default async function HomePage() {
  const { userId } = await auth();
  const isSignedIn = !!userId;

  return (
    <div className="min-h-screen">
      <main>
        {/* Hero */}
        <section className="container mx-auto px-4 py-20">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center rounded-full border px-3 py-1 text-xs text-primary">
              Live, modern, secure
            </div>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl">
              Real-time chat that feels effortless
            </h1>
            <p className="mt-4 text-muted-foreground">
              Built on Convex for realtime, Clerk for auth, and shadcn/ui for a
              clean blue aesthetic.
            </p>
            <div className="mt-8 flex items-center justify-center gap-3">
              <Button asChild>
                <Link href={isSignedIn ? "/conversations" : "/sign-in"}>
                  {isSignedIn ? "Open app" : "Get started"}
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="#features">See features</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Highlights */}
        <section id="features" className="container mx-auto px-4 py-14">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Realtime by default</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Convex subscriptions keep conversations in sync without manual
                socket plumbing.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Secure auth</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Clerk handles sessions, OAuth, and user management with a
                server-first API.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Modern UI</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                shadcn/ui components themed in blue for a crisp, accessible
                interface.
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
}
