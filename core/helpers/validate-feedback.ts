export function validateFeedback(body: any) {
  if (!body || typeof body !== "object") return false;

  const { ratings, comments } = body;

  if (!ratings || typeof ratings !== "object") return false;

  const entries = Object.entries(ratings);
  if (entries.length === 0 || entries.length > 10) return false;

  for (const [, value] of entries) {
    if (typeof value !== "number" || value < 1 || value > 5) return false;
  }

  if (comments !== undefined) {
    if (typeof comments !== "string" || comments.length > 500) return false;
  }

  return true;
}
