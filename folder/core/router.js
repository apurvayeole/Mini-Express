const routes = {};

export function addRoute(method, path, ...handlers) {
  routes[`${method}:${path}`] = handlers;
}

export function runRoute(req, res, done) {
  const handlers = routes[`${req.method}:${req.url}`];

  if (!handlers) {
    res.writeHead(404);
    return res.end("Not Found");
  }

  let index = 0;

  function next(err) {
    if (res.writableEnded) return;
    if (err) return done(err);

    const handler = handlers[index++];
    if (!handler) return;

    try {
      const result = handler(req, res, next);
      if (result instanceof Promise) {
        result.catch(next);
      }
    } catch (e) {
      next(e);
    }
  }

  next();
}
