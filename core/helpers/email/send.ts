import { resend, FROM } from "./resend.client";

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({
  to,
  subject,
  html,
}: SendEmailParams): Promise<boolean> {
  try {
    const { error } = await resend.emails.send({
      from: `Sit+ <${FROM}>`,
      to,
      subject,
      html,
    });

    if (error) {
      console.error("Resend error:", error);
      return false;
    }

    return true;
  } catch (err) {
    console.error("sendEmail error:", err);
    return false;
  }
}
