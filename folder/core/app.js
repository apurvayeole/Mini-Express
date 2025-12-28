import http from "http";
import { use, runMiddlewares } from "./middleware.js";
import { addRoute, runRoute } from "./router.js";
import { runErrorMiddlewares } from "./error.js";

export function createApp() {
  return {
    use(fn) {
      use(fn);
    },

    get(path, ...handlers) {
      addRoute("GET", path, ...handlers);
    },

    post(path, ...handlers) {
      addRoute("POST", path, ...handlers);
    },

    listen(port, cb) {
      const server = http.createServer((req, res) => {
        runMiddlewares(req, res, (err) => {
          if (err) return runErrorMiddlewares(err, req, res);

          runRoute(req, res, (routeErr) => {
            if (routeErr) runErrorMiddlewares(routeErr, req, res);
          });
        });
      });

      server.listen(port, cb);
    }
  };
}
