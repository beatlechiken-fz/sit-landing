"use client";

import { Link, useRouter } from "@/i18n/navigation";

// Flecha delgada tipo chevron (triángulo incompleto)
const ArrowIcon = ({ open = false }: { open?: boolean }) => (
  <svg
    viewBox="0 0 24 24"
    className={`
      w-4 h-4
      transition-transform duration-200
      ${open ? "rotate-180" : ""}
    `}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6 9l6 6 6-6" />
  </svg>
);

export default function MainNavItem({
  label,
  url,
  submenu = [],
  active,
  onSelect,
  isMobile = false,
  isOpen = false,
  onToggle,
}: any) {
  const router = useRouter();
  // =========================
  // MOBILE VERSION
  // =========================
  if (isMobile) {
    return (
      <div className="flex flex-col">
        <button
          onClick={() => {
            if (submenu.length > 0) {
              onToggle();
            } else {
              onSelect?.();
              router.push(url);
            }
          }}
          className={`
            px-4 py-2 rounded-xl transition font-medium text-left
            flex justify-between items-center
            ${
              active
                ? "bg-white/20 text-white"
                : "text-gray-300 hover:bg-white/5 hover:text-white"
            }
          `}
        >
          <span>{label}</span>

          {submenu.length > 0 && <ArrowIcon open={isOpen} />}
        </button>

        {submenu.length > 0 && isOpen && (
          <div className="mt-2 ml-4 flex flex-col gap-1">
            {submenu.map((s: any) => (
              <Link
                key={s.id}
                href={s.url}
                onClick={onSelect}
                className="px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg"
              >
                {s.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  // =========================
  // DESKTOP VERSION
  // =========================
  return (
    <div className="relative group">
      <Link
        href={url}
        onClick={onSelect}
        className={`
          px-4 py-2 rounded-xl transition font-medium
          flex items-center gap-1
          ${
            active
              ? "bg-white/20 text-white"
              : "text-gray-300 hover:bg-white/5 hover:text-white"
          }
        `}
      >
        <span>{label}</span>

        {submenu.length > 0 && (
          <svg
            viewBox="0 0 24 24"
            className="
              w-4 h-4
              transition-transform duration-200
              group-hover:rotate-180
            "
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        )}
      </Link>

      {submenu.length > 0 && (
        <div
          className="
            absolute top-full left-0 mt-2 w-48
            bg-black/70 backdrop-blur-xl
            border border-white/10
            rounded-xl p-3 shadow-xl
            opacity-0 invisible
            group-hover:opacity-100 group-hover:visible
            transition-all
            z-50
          "
        >
          {submenu.map((s: any) => (
            <Link
              key={s.id}
              href={s.url}
              onClick={onSelect}
              className="block px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg"
            >
              {s.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
