// Working code proves correctness.
// Structured code proves understanding.

import { createApp } from "./core/app.js";
import { requestId } from "./core/requestId.js";
import * as logger from "./core/logger.js";

import { rateLimit } from "./core/rateLimit.js";

use((req, res, next) => {
  logger.log("RAW COOKIE HEADER:", req.headers.cookie);
  next();
});


import http from "http";
import { use, runMiddlewares } from "./core/middleware.js";
import { addRoute, runRoute } from "./core/router.js";
import { useError, runErrorMiddlewares } from "./core/error.js";

import { json } from "./core/json.js";
import { cookies } from "./core/cookies.js";
import { createSession, deleteSession } from "./core/session.js";
import { authRequired } from "./core/auth.js";
const app = createApp();

/* --------- Global middlewares --------- */


app.use(requestId());
app.use(json());
app.use(cookies());

app.use(rateLimit({
  windowMs: 60_000, // 1 minute
  max: 5            // 5 requests per minute
}));


app.use((req, res, next) => {
  logger.log("PARSED COOKIES:", req.cookies);
  next();
});


app.use((req, res, next) => {
  logger.log(req.method, req.url);
  next();
});

/* --------- Routes --------- */

// addRoute("GET", "/", (req, res) => {
//   res.writeHead(200, { "Content-Type": "text/plain" });
//   res.end("OK");
// });

// addRoute("POST", "/data", (req, res) => {
//   res.writeHead(200, { "Content-Type": "application/json" });
//   res.end(JSON.stringify({ received: req.body }));
// });

// addRoute("POST", "/login", (req, res) => {
//   const { username, password } = req.body || {};

//   if (username !== "admin" || password !== "password") {
//     res.writeHead(401);
//     return res.end("Invalid credentials");
//   }

//   const sessionId = createSession("admin");

//   res.writeHead(200, {
//     "Set-Cookie": `sessionId=${sessionId}; HttpOnly`
//   });

//   res.end("Logged in");
// });

// addRoute(
//   "GET",
//   "/dashboard",
//   authRequired(),
//   (req, res) => {
//     res.end(`Welcome user ${req.user.id}`);
//   }
// );

// addRoute("POST", "/logout", (req, res) => {
//   const sessionId = req.cookies?.sessionId;
//   if (sessionId) deleteSession(sessionId);

//   res.writeHead(200, {
//     "Set-Cookie": "sessionId=; Max-Age=0"
//   });

//   res.end("Logged out");
// });

// addRoute("GET", "/debug", (req, res) => {
//   res.end(JSON.stringify({
//     body: req.body,
//     cookies: req.cookies,
//     user: req.user
//   }));
// });


app.get("/", (req, res) => {
  res.end("OK");
});

app.post("/login", (req, res) => {
  const { username, password } = req.body || {};

  if (username !== "admin" || password !== "password") {
    res.writeHead(401);
    return res.end("Invalid credentials");
  }

  const sessionId = createSession("admin");

  res.writeHead(200, {
    "Set-Cookie": `sessionId=${sessionId}; HttpOnly`
  });

  res.end("Logged in");
});

app.get("/dashboard",
  authRequired(),
  (req, res) => {
    res.end(`Welcome user ${req.user.id}`);
  }
);

app.post("/logout", (req, res) => {
  const sessionId = req.cookies?.sessionId;
  if (sessionId) deleteSession(sessionId);

  res.writeHead(200, {
    "Set-Cookie": "sessionId=; Max-Age=0"
  });

  res.end("Logged out");
});



/* --------- Error handler --------- */

useError((err, req, res) => {
  logger.error("ERROR:", err.message);
  res.writeHead(500, { "Content-Type": "application/json" });
  res.end(JSON.stringify({
    success: false,
    message: err.message
  }));
});

/* --------- Server --------- */

const server = http.createServer((req, res) => {
  runMiddlewares(req, res, (err) => {
    if (err) return runErrorMiddlewares(err, req, res);

    runRoute(req, res, (routeErr) => {
      if (routeErr) runErrorMiddlewares(routeErr, req, res);
    });
  });
});

app.listen(8000, () => {
  console.log("Mini-Express running on port 8000");
});