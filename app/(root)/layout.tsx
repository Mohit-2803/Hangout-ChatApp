"use client";
import { usePathname } from "next/navigation";
import SiteNavbar from "@/components/layout/site-navbar";
import SidebarWrapper from "@/components/shared/sidebar/SidebarWrapper";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const isAuthPage =
    pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");
  const shouldHideSidebar = isHomePage || isAuthPage;

  return (
    <>
      {isHomePage && <SiteNavbar />}
      {shouldHideSidebar ? (
        <main className="w-full h-full">{children}</main>
      ) : (
        <SidebarWrapper>{children}</SidebarWrapper>
      )}
    </>
  );
}
