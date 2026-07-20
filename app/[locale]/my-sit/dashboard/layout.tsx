import { getClientSession } from "@/core/helpers/auth/client-session";
import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";
import { ClientNavbar } from "@/modules/(my-sit)/presentation/components/ClientNavBar";

export default async function MySitLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getClientSession();
  const locale = await getLocale();

  if (!session) redirect(`/${locale}/my-sit`);

  return (
    <div className="min-h-screen bg-[#0B0B0F]">
      <ClientNavbar session={session} />
      <div className="pt-20">{children}</div>
    </div>
  );
}
