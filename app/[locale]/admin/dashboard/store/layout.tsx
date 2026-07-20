import { StoreSubNav } from "@/core/components/app-bar-admin/StoreSubNav";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="pt-14">{children}</div>
    </div>
  );
}
