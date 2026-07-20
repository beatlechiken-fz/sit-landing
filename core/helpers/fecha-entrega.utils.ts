function formatValue(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// Hoy + 3 días, sin contar domingos como parte del conteo.
export function calcularFechaEntregaCliente(desde: Date = new Date()): string {
  const fecha = new Date(desde);
  let diasAgregados = 0;

  while (diasAgregados < 3) {
    fecha.setDate(fecha.getDate() + 1);
    if (fecha.getDay() !== 0) diasAgregados++; // 0 = domingo
  }

  return formatValue(fecha);
}
