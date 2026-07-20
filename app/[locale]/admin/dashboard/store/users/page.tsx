import AppBarAdmin from "@/core/components/app-bar-admin/AppBarAdmin";
import UsersView from "@/modules/admin/store/presentation/components/UsersView";

export default function UsersPage() {
  return (
    <main className="bg-[#0B0B0F] text-white min-h-screen overflow-x-hidden">
      <AppBarAdmin />
      <section className="flex justify-center pt-8 lg:pt-18 w-full">
        <UsersView />
      </section>
    </main>
  );
}
