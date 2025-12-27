import http from "http";

const routes = {};
const middlewares = [];
const errorMiddlewares = [];

/* ---------------- ROUTES ---------------- */

function addRoute(method, path, handler) {
  routes[`${method}:${path}`] = handler;
}

/* ---------------- MIDDLEWARE ---------------- */

function use(mw) {
  middlewares.push(mw);
}

function useError(mw) {
  errorMiddlewares.push(mw);
}

/* Example middleware */
use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

/* Example route */
addRoute("GET", "/", (req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("OK");
});

/* ---------------- SERVER ---------------- */

const server = http.createServer((req, res) => {
  let i = 0;
  let errorIndex = 0;

  function runErrorMiddleware(err) {
    if (errorIndex >= errorMiddlewares.length) {
      res.writeHead(500, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: err.message }));
    }

    const mw = errorMiddlewares[errorIndex++];
    mw(err, req, res);
  }

  function runRoute() {
    const handler = routes[`${req.method}:${req.url}`];
    if (!handler) {
      res.writeHead(404);
      return res.end("Not Found");
    }

    try {
      const result = handler(req, res);
      if (result instanceof Promise) {
        result.catch(next);
      }
    } catch (err) {
      next(err);
    }
  }

  function next(err) {
    if (res.writableEnded) return;

    if (err) return runErrorMiddleware(err);

    if (i < middlewares.length) {
      try {
        middlewares[i++](req, res, next);
      } catch (err) {
        next(err);
      }
    } else {
      runRoute();
    }
  }

  next();
});

/* ---------------- ERROR HANDLER ---------------- */

useError((err, req, res) => {
  console.error("ERROR:", err.message);
  res.writeHead(500, { "Content-Type": "application/json" });
  res.end(JSON.stringify({
    success: false,
    message: err.message
  }));
});

/* ---------------- START SERVER ---------------- */

server.listen(8000, () => {
  console.log("Server running on port 8000");
});
