import AppBarAdmin from "@/core/components/app-bar-admin/AppBarAdmin";
import StoreView from "@/modules/admin/store/presentation/components/StoreView";

interface PageProps {
  searchParams: Promise<{
    q?: string;
    marca?: string;
    grupo?: string;
    moneda?: string;
    soloDisponibles?: string;
    page?: string;
  }>;
}

export default function StorePage({ searchParams }: PageProps) {
  return (
    <main className="bg-[#0B0B0F] text-white min-h-screen overflow-x-hidden">
      <AppBarAdmin />
      <section className="flex justify-center pt-8 lg:pt-18 w-full">
        <StoreView searchParams={searchParams} />
      </section>
    </main>
  );
}
