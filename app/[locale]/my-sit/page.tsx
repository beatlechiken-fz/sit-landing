import { AuthTabs } from "@/modules/(my-sit)/presentation/components/AuthTabs";

interface LoginClientePageProps {
  searchParams: Promise<{ next?: string }>;
}

export default async function LoginClientePage({
  searchParams,
}: LoginClientePageProps) {
  const { next } = await searchParams;

  return (
    <main className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white">
            Sit<span className="text-[#02AFFF]">+</span>
          </h1>
          <p className="mt-2 text-sm text-zinc-500">Portal de clientes</p>
        </div>

        <AuthTabs next={next} />
      </div>
    </main>
  );
}
