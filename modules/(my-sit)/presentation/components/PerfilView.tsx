import { getClientSession } from "@/core/helpers/auth/client-session";
import { CambiarPasswordForm } from "./CambiarPasswordForm";

export default async function PerfilView() {
  const session = await getClientSession();

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-100">
          Mi perfil
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Administra tu información y seguridad
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Info del cliente */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-zinc-500">
            Información
          </p>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#02AFFF]/20 text-xl font-bold text-[#02AFFF]">
              {session?.nombre[0]}
              {session?.apellido[0]}
            </div>
            <div>
              <p className="font-semibold text-zinc-100">
                {session?.nombre} {session?.apellido}
              </p>
              <p className="text-sm text-zinc-500">{session?.email}</p>
            </div>
          </div>

          <div className="space-y-3 text-sm">
            {[
              { label: "Nombre", value: session?.nombre },
              { label: "Apellido", value: session?.apellido },
              { label: "Email", value: session?.email },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="flex justify-between border-b border-zinc-800 pb-3"
              >
                <span className="text-zinc-500">{label}</span>
                <span className="text-zinc-200 font-medium">{value}</span>
              </div>
            ))}
          </div>

          <p className="mt-4 text-xs text-zinc-600">
            Para actualizar tu información contacta a{" "}
            <a
              href="mailto:hola@sitmorelia.com.mx"
              className="text-[#02AFFF] hover:underline"
            >
              Sit+
            </a>
          </p>
        </div>

        {/* Cambiar contraseña */}
        <CambiarPasswordForm />
      </div>
    </main>
  );
}
