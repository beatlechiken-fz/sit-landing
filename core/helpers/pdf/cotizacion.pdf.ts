import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { LineaCarrito } from "@/modules/admin/store/presentation/store/carrito.store";
import { CuponValido } from "@/app/api/cupones/validar/route";
import { LOGO_BASE64, LOGO_FORMAT } from "@/core/assets/logoBase64";
import { formatMXN } from "@/core/helpers/precio.utils";

// ─────────────────────────────────────────────
// Constantes de diseño — paleta Sit+
// ─────────────────────────────────────────────
const BLUE = [25, 97, 176] as [number, number, number]; // #1961B0
const CYAN = [2, 175, 255] as [number, number, number]; // #02AFFF
const DARK = [15, 23, 42] as [number, number, number]; // zinc-900
const GRAY = [100, 116, 139] as [number, number, number]; // zinc-500
const LIGHT = [241, 245, 249] as [number, number, number]; // zinc-100
const WHITE = [255, 255, 255] as [number, number, number];
const CYAN_LIGHT = [235, 248, 255] as [number, number, number];

interface PDFData {
  tipo: "cotizacion" | "orden";
  cliente: string;
  lineas: LineaCarrito[];
  cuponGlobal: CuponValido | null;
  subtotal: number;
  descuentoLineas: number;
  descuentoGlobal: number;
  totalFinal: number;
  numeroOrden?: string;
  fechaValidez: string;
}

function generarNumeroOrden(): string {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const mins = String(now.getMinutes()).padStart(2, "0");
  return `ORD-${year}${month}${day}-${hours}${mins}`;
}

function fechaValidez(): string {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  return d.toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function fechaHoy(): string {
  return new Date().toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function generarPDF(data: PDFData) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  const margin = 14;

  // ── Header ────────────────────────────────
  // Limpia el prefijo data URI si existe
  const logoData = LOGO_BASE64.startsWith("data:")
    ? LOGO_BASE64.split(",")[1]
    : LOGO_BASE64;

  // Logo
  doc.addImage(logoData, LOGO_FORMAT, margin, 7, 36, 18);

  // Datos del documento — derecha
  doc.setFontSize(8);
  doc.setTextColor(...GRAY);
  const asunto = data.tipo === "cotizacion" ? "Cotización" : "Orden de compra";
  doc.text(`Asunto: ${asunto}`, W - margin, 12, { align: "right" });
  doc.text(`Fecha: ${fechaHoy()}`, W - margin, 16, { align: "right" });
  doc.text(`Válida hasta: ${data.fechaValidez}`, W - margin, 20, {
    align: "right",
  });
  if (data.numeroOrden) {
    doc.text(`No. Orden: ${data.numeroOrden}`, W - margin, 24, {
      align: "right",
    });
  }

  // Línea separadora bajo el header
  doc.setDrawColor(...CYAN);
  doc.setLineWidth(0.5);
  doc.line(margin, 30, W - margin, 30);

  // ── Info cliente ──────────────────────────
  let y = 38;

  doc.setFontSize(10);
  doc.setTextColor(...DARK);
  doc.text("Cliente:", margin, y);
  doc.setFont("helvetica", "bold");
  doc.text(data.cliente, margin + 16, y);
  doc.setFont("helvetica", "normal");

  y += 6;
  doc.setFontSize(8);
  doc.setTextColor(...GRAY);

  y += 8;

  // ── Título sección ────────────────────────
  // Caja azul redondeada para el título
  doc.setFillColor(...CYAN_LIGHT);
  doc.roundedRect(margin, y, W - margin * 2, 8, 2, 2, "F");
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...BLUE);
  doc.text("Detalle de productos", margin + 3, y + 5.5);
  doc.setFont("helvetica", "normal");

  y += 12;

  const esOrden = data.tipo === "orden";

  // ── Tabla de productos ────────────────────
  const tableBody = data.lineas.map((linea, i) => {
    // El detalle de un servicio (ej. "Cambio de bomba de succión") va
    // debajo del nombre, en la misma celda.
    const descripcionCelda = linea.detalleServicio
      ? `${linea.product.descripcion}\n${linea.detalleServicio}`
      : linea.product.descripcion;

    const fila = [
      String(i + 1),
      linea.product.clave,
      descripcionCelda,
      linea.product.marca,
      String(linea.cantidad),
      formatMXN(linea.precioFinal),
      linea.cupon
        ? linea.cupon.tipo === "porcentaje"
          ? `${linea.cupon.descuento}%`
          : formatMXN(linea.cupon.descuento)
        : "—",
      formatMXN(linea.total),
    ];

    if (esOrden) fila.splice(4, 0, linea.product.garantia ?? "—");

    return fila;
  });

  const headers = [
    "#",
    "Clave",
    "Descripción",
    "Marca",
    "Cant.",
    "P. Unit.",
    "Desc.",
    "Total",
  ];
  if (esOrden) headers.splice(4, 0, "Garantía");

  const columnStylesBase: Record<number, object> = {
    0: { halign: "center", cellWidth: 6 },
    1: { cellWidth: 16 },
    2: { cellWidth: esOrden ? 50 : 66 }, // descripción más angosta si hay garantía
    3: { cellWidth: 20 },
    4: { halign: "center", cellWidth: 12 },
    5: { halign: "right", cellWidth: 22 },
    6: { halign: "center", cellWidth: 16 },
    7: { halign: "right", cellWidth: 24 },
  };

  if (esOrden) {
    // Inserta columna garantía en posición 4, recorre las demás
    columnStylesBase[4] = { cellWidth: 16, halign: "center" }; // Garantía
    columnStylesBase[5] = { halign: "center", cellWidth: 12 }; // Cant.
    columnStylesBase[6] = { halign: "right", cellWidth: 22 }; // P. Unit.
    columnStylesBase[7] = { halign: "center", cellWidth: 16 }; // Desc.
    columnStylesBase[8] = { halign: "right", cellWidth: 24 }; // Total
  }

  autoTable(doc, {
    startY: y,
    tableWidth: W - margin * 2,
    head: [headers],
    body: tableBody,
    margin: { left: margin, right: margin },
    styles: {
      fontSize: 7,
      cellPadding: 2.5,
      textColor: DARK,
      lineColor: [226, 232, 240],
      lineWidth: 0.1,
    },
    headStyles: {
      fillColor: BLUE,
      textColor: WHITE,
      fontStyle: "bold",
      halign: "center",
      fontSize: 7.5,
    },
    columnStyles: columnStylesBase,
    alternateRowStyles: {
      fillColor: LIGHT,
    },
    didDrawPage: (hookData) => {
      // Footer en cada página
      drawFooter(doc, W, H, margin);
    },
  });

  y = (doc as any).lastAutoTable.finalY + 8;

  // ── Cupón global ──────────────────────────
  if (data.cuponGlobal) {
    doc.setFillColor(...CYAN_LIGHT);
    doc.roundedRect(margin, y, W - margin * 2, 8, 2, 2, "F");
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...BLUE);
    doc.text("Cupón global aplicado:", margin + 3, y + 5.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...DARK);
    const descGlobal =
      data.cuponGlobal.tipo === "porcentaje"
        ? `${data.cuponGlobal.descuento}% — ${data.cuponGlobal.codigo}`
        : `${formatMXN(data.cuponGlobal.descuento)} — ${data.cuponGlobal.codigo}`;
    doc.text(descGlobal, margin + 52, y + 5.5);
    y += 12;
  }

  // ── Resumen financiero ────────────────────
  const resumenX = W - margin - 65;
  const resumenW = 65;

  const drawResumenRow = (
    label: string,
    value: string,
    yPos: number,
    bold = false,
    color: [number, number, number] = DARK,
  ) => {
    doc.setFontSize(bold ? 9 : 8);
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setCharSpace(0);
    doc.setTextColor(...GRAY);
    doc.text(label, resumenX, yPos);
    doc.setTextColor(...color);
    doc.text(value, resumenX + resumenW, yPos, {
      align: "right",
      charSpace: 0,
    });
  };

  drawResumenRow("Subtotal:", formatMXN(data.subtotal), y);
  y += 5.5;

  if (data.descuentoLineas > 0) {
    drawResumenRow(
      "Desc. por producto:",
      `${formatMXN(data.descuentoLineas)}`,
      y,
      false,
      [16, 185, 129],
    );
    y += 5.5;
  }

  if (data.descuentoGlobal > 0) {
    drawResumenRow(
      "Desc. global:",
      `${formatMXN(data.descuentoGlobal)}`,
      y,
      false,
      [16, 185, 129],
    );
    y += 5.5;
  }

  // Separador
  doc.setDrawColor(...CYAN);
  doc.setLineWidth(0.3);
  doc.line(resumenX, y, resumenX + resumenW, y);
  y += 4;

  // Total — caja destacada
  doc.setFillColor(...BLUE);
  doc.roundedRect(resumenX - 2, y - 1, resumenW + 4, 10, 2, 2, "F");
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...WHITE);
  doc.text("Total:", resumenX + 2, y + 6);
  doc.text(formatMXN(data.totalFinal), resumenX + resumenW - 2, y + 6, {
    align: "right",
  });

  y += 16;

  // Ahorro total
  const ahorro = data.descuentoLineas + data.descuentoGlobal;
  if (ahorro > 0) {
    doc.setFillColor(240, 253, 244); // green-50
    doc.roundedRect(resumenX - 2, y - 1, resumenW + 4, 8, 2, 2, "F");
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(22, 163, 74); // green-600
    doc.text(
      `¡Ahorraste ${formatMXN(ahorro)}!`,
      resumenX + resumenW / 2 + 2,
      y + 4.5,
      { align: "center" },
    );
  }

  y += 14;

  // ── Condiciones ───────────────────────────
  if (data.tipo === "cotizacion") {
    doc.setFontSize(7.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...BLUE);
    doc.text("Condiciones de pago:", margin, y);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...GRAY);
    y += 4.5;
    doc.text("• 50% de anticipo al confirmar el pedido.", margin + 2, y);
    y += 4;
    doc.text("• 50% contraentrega del producto.", margin + 2, y);
    y += 4;
    doc.text(
      "Métodos de pago: Efectivo · Transferencia electrónica",
      margin + 2,
      y,
    );
  }

  if (data.tipo === "orden") {
    // Caja de número de orden destacada
    doc.setFillColor(...CYAN_LIGHT);
    doc.roundedRect(margin, y - 2, 90, 14, 3, 3, "F");
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...BLUE);
    doc.text("Número de orden:", margin + 3, y + 4);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(data.numeroOrden ?? "", margin + 3, y + 10);
    y += 18;

    doc.setFontSize(7.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...GRAY);
    doc.text(
      "Esta orden ha sido generada y confirmada. Presente este documento para su seguimiento.",
      margin,
      y,
    );
  }

  // ── Firma ─────────────────────────────────
  y = H - 40;
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...GRAY);
  doc.text("Atentamente,", margin, y);
  y += 4.5;
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...DARK);
  doc.text("Mario Alberto Ferreyra", margin, y);
  y += 4;
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...GRAY);
  doc.text("Director General", margin, y);
  y += 4;
  doc.text("Sit+ Servicios Integrales en Tecnología", margin, y);

  // Footer final
  drawFooter(doc, W, H, margin);

  // ── Descarga ──────────────────────────────
  const fileName =
    data.tipo === "cotizacion"
      ? `Cotizacion_${data.cliente.replace(/\s+/g, "_")}_${new Date().toISOString().slice(0, 10)}.pdf`
      : `Orden_${data.numeroOrden}.pdf`;

  doc.save(fileName);
}

function drawFooter(doc: jsPDF, W: number, H: number, margin: number) {
  // Barra azul inferior
  doc.setFillColor(25, 97, 176);
  doc.rect(0, H - 8, W, 8, "F");

  // Texto en el footer
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(255, 255, 255);
  doc.text("sitmorelia.com.mx  ·  @sitmorelia  ·  443 123 6733", W / 2, H - 3, {
    align: "center",
  });
}

// ─────────────────────────────────────────────
// Exports convenientes
// ─────────────────────────────────────────────
export function descargarCotizacion(
  cliente: string,
  lineas: LineaCarrito[],
  cuponGlobal: CuponValido | null,
  subtotal: number,
  descuentoLineas: number,
  descuentoGlobal: number,
  totalFinal: number,
) {
  generarPDF({
    tipo: "cotizacion",
    cliente,
    lineas,
    cuponGlobal,
    subtotal,
    descuentoLineas,
    descuentoGlobal,
    totalFinal,
    fechaValidez: fechaValidez(),
  });
}

export function descargarOrden(
  cliente: string,
  lineas: LineaCarrito[],
  cuponGlobal: CuponValido | null,
  subtotal: number,
  descuentoLineas: number,
  descuentoGlobal: number,
  totalFinal: number,
  numeroOrden?: string,
) {
  generarPDF({
    tipo: "orden",
    cliente,
    lineas,
    cuponGlobal,
    subtotal,
    descuentoLineas,
    descuentoGlobal,
    totalFinal,
    numeroOrden: numeroOrden ?? generarNumeroOrden(),
    fechaValidez: fechaValidez(),
  });
}
