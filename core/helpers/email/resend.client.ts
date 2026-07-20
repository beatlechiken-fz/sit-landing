import { Resend } from "resend";

if (!process.env.RESEND_API_KEY) {
  throw new Error("RESEND_API_KEY no está configurada");
}

export const resend = new Resend(process.env.RESEND_API_KEY);
export const FROM = process.env.RESEND_FROM ?? "noreply@sitmorelia.com.mx";
