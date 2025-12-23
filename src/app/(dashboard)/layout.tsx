import { SessionGuard } from "@/components/auth/SessionGuard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SessionGuard />
      {children}
    </>
  );
}
