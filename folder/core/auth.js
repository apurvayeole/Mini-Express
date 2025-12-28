import {getSession} from './session.js';

export function authRequired(){
    return(req,res,next) => {
        logger.log(req, "Auth check started");

        const sessionId = req.cookies?.sessionId;

        if (!sessionId) {
             logger.log(req, "No session cookie");
            res.writeHead(401);
            return res.end("Not Authenticated");
        }

        const session = getSession(sessionId);
        if (!session) {
              logger.log(req, "Invalid session");
            res.writeHead(401);
            return res.end("Invalid Session");
        }
        req.user = { id: session.userId };
          logger.log(req, `Authenticated as ${req.user.id}`);
        next();
    };
}