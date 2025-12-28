const middlewares = [];

export function use(mw){
    middlewares.push(mw);
}

export function runMiddlewares(req,res,next){
    let index = 0;

    function run(err) {
        if(err) return next(err);
        if(res.writableEnded) return;

        if(index >= middlewares.length) {
            return next();
        }

        try {
            middlewares[index++](req, res,run);
        }catch(err){
            run(err);
        }
    }
    run();
}

// If logic protects the server, it belongs in middleware.
// If logic serves the user, it belongs in a route.