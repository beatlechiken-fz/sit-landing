export function validateFeedback(body: any) {
  if (!body || typeof body !== "object") return false;

  const { ratings, comments } = body;

  if (!ratings || typeof ratings !== "object") return false;

  const categories = ["Servicio / Producto", "Tiempo", "Atención"];

  for (const cat of categories) {
    const value = ratings[cat];
    if (typeof value !== "number" || value < 1 || value > 5) {
      return false;
    }
  }

  if (comments && comments.length > 500) return false;

  return true;
}
