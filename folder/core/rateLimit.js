const hits = new Map();

export function rateLimit({ windowMs, max }) {
  return (req, res, next) => {
    const ip = req.socket.remoteAddress;
    const now = Date.now();

    if (!hits.has(ip)) {
      hits.set(ip, []);
    }

    const timestamps = hits.get(ip);

    // Remove expired timestamps
    while (timestamps.length && timestamps[0] <= now - windowMs) {
      timestamps.shift();
    }

    if (timestamps.length >= max) {
      res.writeHead(429, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({
        success: false,
        message: "Too many requests. Slow down."
      }));
    }

    timestamps.push(now);
    next();
  };
}
