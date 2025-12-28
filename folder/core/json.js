export function json() {
  return function (req, res, next) {
    if (req.method === "GET" || req.method === "HEAD") {
      return next();
    }

    const contentType = req.headers["content-type"];
    if (!contentType || !contentType.includes("application/json")) {
      return next();
    }

    let body = "";

    req.on("data", chunk => {
      body += chunk;
    });

    req.on("end", () => {
      if (!body) {
        req.body = {};
        return next();
      }

      try {
        req.body = JSON.parse(body);
        next();
      } catch (err) {
        next(new Error("Invalid JSON"));
      }
    });
  };
}
