interface BienvenidaProps {
  nombre: string;
  email: string;
  password: string;
  loginUrl: string;
}

export function bienvenidaTemplate({
  nombre,
  email,
  password,
  loginUrl,
}: BienvenidaProps): { subject: string; html: string } {
  return {
    subject: "Bienvenido a Sit+ — Tus credenciales de acceso",
    html: `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Bienvenido a Sit+</title>
</head>
<body style="margin:0;padding:0;background:#f4f7fb;font-family:Arial,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7fb;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0"
          style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#1961B0,#02AFFF);padding:40px 40px 32px;text-align:center;">
              <h1 style="color:#ffffff;margin:0;font-size:28px;font-weight:700;letter-spacing:-0.5px;">
                Sit+
              </h1>
              <p style="color:rgba(255,255,255,0.8);margin:8px 0 0;font-size:14px;">
                Servicios Integrales en Tecnología
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <h2 style="color:#032B90;margin:0 0 16px;font-size:22px;">
                ¡Hola, ${nombre}!
              </h2>
              <p style="color:#475569;margin:0 0 24px;font-size:15px;line-height:1.6;">
                Tu cuenta en el portal de clientes Sit+ ha sido creada.
                Aquí están tus credenciales de acceso:
              </p>

              <!-- Credenciales -->
              <table width="100%" cellpadding="0" cellspacing="0"
                style="background:#f1f8ff;border-radius:12px;border:1px solid #bfdbfe;margin-bottom:24px;">
                <tr>
                  <td style="padding:24px;">
                    <table width="100%">
                      <tr>
                        <td style="padding:8px 0;">
                          <span style="color:#64748b;font-size:12px;text-transform:uppercase;letter-spacing:1px;">
                            Correo electrónico
                          </span><br/>
                          <strong style="color:#0f172a;font-size:16px;">${email}</strong>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:12px 0 8px;border-top:1px solid #bfdbfe;">
                          <span style="color:#64748b;font-size:12px;text-transform:uppercase;letter-spacing:1px;">
                            Contraseña temporal
                          </span><br/>
                          <strong style="color:#0f172a;font-size:20px;letter-spacing:2px;font-family:monospace;">
                            ${password}
                          </strong>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <p style="color:#ef4444;font-size:13px;margin:0 0 24px;padding:12px 16px;
                background:#fef2f2;border-radius:8px;border-left:3px solid #ef4444;">
                ⚠️ Esta es una contraseña temporal — al iniciar sesión te pediremos que la cambies antes de continuar.
              </p>

              <!-- CTA -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="${loginUrl}"
                      style="display:inline-block;background:linear-gradient(135deg,#1961B0,#02AFFF);
                        color:#ffffff;text-decoration:none;padding:14px 40px;
                        border-radius:50px;font-size:15px;font-weight:600;
                        letter-spacing:0.3px;">
                      Iniciar sesión →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f8fafc;padding:24px 40px;border-top:1px solid #e2e8f0;text-align:center;">
              <p style="color:#94a3b8;font-size:12px;margin:0;">
                sitmorelia.com.mx · @sitmorelia · 443 123 6733
              </p>
              <p style="color:#cbd5e1;font-size:11px;margin:8px 0 0;">
                Si no solicitaste esta cuenta, ignora este correo.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>
    `,
  };
}
