export function cookies(){
    return function (req, res, next) {
        const header = req.headers.cookie;
        req.cookies = {};
        if (!header) return next();
        header.split(";").forEach(pair => {
      const [key, value] = pair.trim().split("=");
      req.cookies[key] = decodeURIComponent(value);
    });
        next();
    }
}
//Every HTTP request gets its own req object.
//Data is not carried forward.
//Identity is reconstructed on every request.
//Each request starts empty; middleware rebuilds context using cookies or headers.