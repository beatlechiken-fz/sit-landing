import { randomBytes } from "crypto";

/**
 * Genera una contraseña segura de 12 caracteres
 * con mayúsculas, minúsculas, números y símbolos
 */
export function generateSecurePassword(): string {
  const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const lower = "abcdefghjkmnpqrstuvwxyz";
  const numbers = "23456789";
  const symbols = "!@#$%&*";
  const all = upper + lower + numbers + symbols;

  // Garantiza al menos uno de cada tipo
  const required = [
    upper[randomBytes(1)[0] % upper.length],
    lower[randomBytes(1)[0] % lower.length],
    numbers[randomBytes(1)[0] % numbers.length],
    symbols[randomBytes(1)[0] % symbols.length],
  ];

  // Rellena los 8 caracteres restantes
  const rest = Array.from(
    { length: 8 },
    () => all[randomBytes(1)[0] % all.length],
  );

  // Mezcla todo
  const password = [...required, ...rest]
    .sort(() => randomBytes(1)[0] / 255 - 0.5)
    .join("");

  return password;
}
