import { CambiarPasswordForm } from "@/modules/(my-sit)/presentation/components/CambiarPasswordForm";

export default function CambiarPasswordPage() {
  return (
    <main className="mx-auto max-w-md px-4 py-12">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-100">
          Actualiza tu contraseña
        </h1>
        <p className="mt-2 text-sm text-zinc-500">
          Tu contraseña actual es temporal. Crea una nueva para continuar al
          portal.
        </p>
      </div>

      <CambiarPasswordForm forced />
    </main>
  );
}
