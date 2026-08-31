import AppBarAdmin from "@/core/components/app-bar-admin/AppBarAdmin";
import ServicesView from "@/modules/admin/store/presentation/components/ServicesView";

export default function ServicesPage() {
  return (
    <main className="bg-[#0B0B0F] text-white min-h-screen overflow-x-hidden">
      <AppBarAdmin />
      <section className="flex justify-center pt-8 lg:pt-18 w-full">
        <ServicesView />
      </section>
    </main>
  );
}
