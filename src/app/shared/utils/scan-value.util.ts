/**
 * Extrae el valor útil de lo que devuelve un escaneo (QR / lector de barras).
 *  - Ticket de inventario: "S:SKU,BT: 2, F: ..."  -> "SKU"
 *  - URL: ".../device-query/XXXX"                  -> "XXXX"
 *  - Texto normal                                 -> se conserva tal cual
 */
export function extractScanValue(value: string): string {
  if (!value) return value;

  // Caso 1: ticket de inventario -> "S:SKU,BT: 2, F: ..."
  const skuMatch = value.match(/S:\s*([^,]+)/i);
  if (skuMatch) {
    return skuMatch[1].trim();
  }

  // Caso 2: URL tipo .../device-query/XXXX
  const urlMatch = value.match(/device-query\/([^\/\?#\s]+)/i);
  if (urlMatch) {
    return urlMatch[1].trim();
  }

  // Caso 3: texto manual
  return value;
}