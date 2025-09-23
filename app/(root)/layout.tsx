import SiteNavbar from "@/components/layout/site-navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <SiteNavbar />
      {children}
    </>
  );
}
