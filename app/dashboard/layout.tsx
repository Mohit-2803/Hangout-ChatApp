import SiteNavbar from "@/components/layout/site-navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SiteNavbar />
      {children}
    </>
  );
}
