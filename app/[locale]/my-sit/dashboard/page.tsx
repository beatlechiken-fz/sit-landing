import DashboardClient from "@/modules/(my-sit)/presentation/components/dashboardClient";

export default function MySitPage() {
  return (
    <main className="bg-[#0B0B0F] text-white min-h-screen overflow-x-hidden">
      <section className="flex justify-center pt-8 lg:pt-18 w-full">
        <DashboardClient />
      </section>
    </main>
  );
}
