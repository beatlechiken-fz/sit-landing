import AppBarAdmin from "@/core/components/app-bar-admin/AppBarAdmin";
import DealsView from "@/modules/admin/store/presentation/components/DealsView";

export default function DealsPage() {
  return (
    <main className="bg-[#0B0B0F] text-white min-h-screen overflow-x-hidden">
      <AppBarAdmin />
      <section className="flex justify-center pt-8 lg:pt-18 w-full">
        <DealsView />
      </section>
    </main>
  );
}
