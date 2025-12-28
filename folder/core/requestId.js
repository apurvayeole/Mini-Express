import crypto from "crypto";

export function requestId() {
  return (req, res, next) => {
    req.id = crypto.randomUUID();

    // Optional: send it back to client
    res.setHeader("X-Request-Id", req.id);

    next();
  };
}

