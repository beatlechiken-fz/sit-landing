interface NuevoMensajeProps {
  destinatario: "admin" | "cliente";
  nombre: string;
  numeroOrden: string;
  mensaje: string;
  portalUrl: string;
}

export function nuevoMensajeTemplate({
  destinatario,
  nombre,
  numeroOrden,
  mensaje,
  portalUrl,
}: NuevoMensajeProps): { subject: string; html: string } {
  const esAdmin = destinatario === "admin";

  return {
    subject: `Nuevo mensaje en pedido ${numeroOrden}`,
    html: `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/></head>
<body style="margin:0;padding:0;background:#f4f7fb;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7fb;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0"
        style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
        <tr>
          <td style="background:linear-gradient(135deg,#1961B0,#02AFFF);padding:32px 40px;text-align:center;">
            <h1 style="color:#fff;margin:0;font-size:24px;font-weight:700;">Sit+</h1>
          </td>
        </tr>
        <tr>
          <td style="padding:40px;">
            <p style="color:#475569;margin:0 0 16px;font-size:15px;">
              ${
                esAdmin
                  ? `El cliente <strong>${nombre}</strong> envió un mensaje en el pedido <strong>${numeroOrden}</strong>:`
                  : `Tienes un nuevo mensaje de <strong>Sit+</strong> en tu pedido <strong>${numeroOrden}</strong>:`
              }
            </p>

            <div style="background:#f1f8ff;border-radius:12px;border-left:4px solid #02AFFF;
              padding:20px;margin-bottom:24px;">
              <p style="color:#0f172a;font-size:15px;margin:0;line-height:1.6;">${mensaje}</p>
            </div>

            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td align="center">
                  <a href="${portalUrl}"
                    style="display:inline-block;background:linear-gradient(135deg,#1961B0,#02AFFF);
                      color:#fff;text-decoration:none;padding:14px 40px;
                      border-radius:50px;font-size:15px;font-weight:600;">
                    ${esAdmin ? "Ver en el panel →" : "Ver mi pedido →"}
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
