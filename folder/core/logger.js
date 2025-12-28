export function log(req, message) {
  const time = new Date().toISOString();
  console.log(`[${time}] [${req.id}] ${message}`);
}

export function error(req, message) {
  const time = new Date().toISOString();
  console.error(`[${time}] [${req.id}] ERROR: ${message}`);
}
