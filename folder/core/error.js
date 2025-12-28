import * as logger from "./logger.js";


const errorMiddlewares = [];

export function useError(mw) {
  errorMiddlewares.push(mw);
}

export function runErrorMiddlewares(err, req, res) {
  logger.error(req, err.message);
  let index = 0;

  function run() {
    if (res.writableEnded) return;

    if (index >= errorMiddlewares.length) {
      res.writeHead(500, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: err.message }));
    }

    try {
      errorMiddlewares[index++](err, req, res);
    } catch (e) {
      err = e;
      run();
    }
  }

  run();
}
