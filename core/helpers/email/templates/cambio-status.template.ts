interface CambioStatusProps {
  nombre: string;
  numeroOrden: string;
  status: string;
  mensaje?: string;
  portalUrl: string;
}

const STATUS_LABELS: Record<string, string> = {
  cotizacion: "Cotización generada",
  en_proceso: "En proceso",
  listo_para_entregar: "Listo para entregar",
  pendiente_de_pago: "Pendiente de pago",
  pagado: "Pagado",
  finalizado: "Finalizado",
  cancelado: "Cancelado",
};

const STATUS_COLORS: Record<string, string> = {
  cotizacion: "#64748b",
  en_proceso: "#1961B0",
  listo_para_entregar: "#059669",
  pendiente_de_pago: "#d97706",
  pagado: "#16a34a",
  finalizado: "#032B90",
  cancelado: "#dc2626",
};

export function cambioStatusTemplate({
  nombre,
  numeroOrden,
  status,
  mensaje,
  portalUrl,
}: CambioStatusProps): { subject: string; html: string } {
  const label = STATUS_LABELS[status] ?? status;
  const color = STATUS_COLORS[status] ?? "#1961B0";

  return {
    subject: `Tu pedido ${numeroOrden} — ${label}`,
    html: `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width,initial-scale=1.0"/></head>
<body style="margin:0;padding:0;background:#f4f7fb;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7fb;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0"
        style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
        <tr>
          <td style="background:linear-gradient(135deg,#1961B0,#02AFFF);padding:32px 40px;text-align:center;">
            <h1 style="color:#fff;margin:0;font-size:24px;font-weight:700;">Sit+</h1>
            <p style="color:rgba(255,255,255,0.8);margin:6px 0 0;font-size:13px;">
              Actualización de pedido
            </p>
          </td>
        </tr>
        <tr>
          <td style="padding:40px;">
            <p style="color:#475569;margin:0 0 20px;font-size:15px;">Hola <strong>${nombre}</strong>,</p>
            <p style="color:#475569;margin:0 0 24px;font-size:15px;line-height:1.6;">
              Tu pedido <strong>${numeroOrden}</strong> ha sido actualizado:
            </p>

            <!-- Badge status -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
              <tr>
                <td align="center">
                  <span style="display:inline-block;background:${color};color:#fff;
                    padding:10px 28px;border-radius:50px;font-size:14px;font-weight:600;">
                    ${label}
                  </span>
                </td>
              </tr>
            </table>

            ${
              mensaje
                ? `
            <div style="background:#f1f8ff;border-radius:12px;border:1px solid #bfdbfe;
              padding:20px;margin-bottom:24px;">
              <p style="color:#64748b;font-size:12px;text-transform:uppercase;
                letter-spacing:1px;margin:0 0 8px;">Mensaje del equipo</p>
              <p style="color:#0f172a;font-size:15px;margin:0;line-height:1.6;">${mensaje}</p>
            </div>
            `
                : ""
            }

            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td align="center">
                  <a href="${portalUrl}"
                    style="display:inline-block;background:linear-gradient(135deg,#1961B0,#02AFFF);
                      color:#fff;text-decoration:none;padding:14px 40px;
                      border-radius:50px;font-size:15px;font-weight:600;">
                    Ver mi pedido →
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="background:#f8fafc;padding:20px 40px;border-top:1px solid #e2e8f0;text-align:center;">
            <p style="color:#94a3b8;font-size:12px;margin:0;">
              sitmorelia.com.mx · @sitmorelia · 443 123 6733
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>
    `,
  };
}
