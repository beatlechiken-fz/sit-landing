"use client";

import { useState } from "react";
import { LoginClienteForm } from "./LoginClienteForm";
import { RegistroClienteForm } from "./RegistroClienteForm";

export function AuthTabs({ next }: { next?: string }) {
  const [tab, setTab] = useState<"login" | "registro">("login");

  return (
    <div>
      <div className="mb-5 grid grid-cols-2 gap-1 rounded-xl border border-zinc-800 bg-zinc-900 p-1">
        {(
          [
            { key: "login", label: "Iniciar sesión" },
            { key: "registro", label: "Crear cuenta" },
          ] as const
        ).map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`
              rounded-lg py-2 text-sm font-medium transition-colors
              ${
                tab === key
                  ? "bg-[#02AFFF] text-white"
                  : "text-zinc-500 hover:text-zinc-300"
              }
            `}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "login" ? (
        <LoginClienteForm next={next} />
      ) : (
        <RegistroClienteForm next={next} />
      )}
    </div>
  );
}
