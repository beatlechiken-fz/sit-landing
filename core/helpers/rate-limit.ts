const rateMap = new Map<string, { count: number; time: number }>();

export function rateLimit(ip: string, limit = 10, windowMs = 60_000) {
  const now = Date.now();
  const record = rateMap.get(ip);

  if (!record) {
    rateMap.set(ip, { count: 1, time: now });
    return true;
  }

  if (now - record.time > windowMs) {
    rateMap.set(ip, { count: 1, time: now });
    return true;
  }

  if (record.count >= limit) return false;

  record.count++;
  return true;
}
