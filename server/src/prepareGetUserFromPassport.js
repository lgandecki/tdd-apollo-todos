/* eslint-disable no-param-reassign,no-underscore-dangle */
const prepareCookieParser = require("cookie-parser");

function parseCookie(auth, cookieHeader) {
  const cookieParser = prepareCookieParser(auth.secret);
  const req = {
    headers: {
      cookie: cookieHeader
    }
  };
  let result;
  cookieParser(req, {}, err => {
    if (err) throw err;
    result = req.signedCookies || req.cookies;
  });
  return result;
}

function prepareGetUserFromPassport(options) {
  const defaults = {
    key: "connect.sid",
    secret: null,
    store: null,
    userProperty: "user"
  };
  const auth = { ...defaults, ...options };
  return function(data) {
    // socket.io v1.0 now provides socket handshake data via `socket.request`
    if (data.request) {
      data = data.request;
      data.socketio_version_1 = true;
    }
    data.cookie = parseCookie(auth, data.headers.cookie || "");
    data.sessionID =
      (data.query && data.query.session_id) ||
      (data._query && data._query.session_id) ||
      data.cookie[auth.key] ||
      "";
    data[auth.userProperty] = {
      logged_in: false
    };

    return new Promise((resolve, reject) => {
      if (data.xdomain && !data.sessionID)
        return reject(
          new Error(
            "Can not read cookies from CORS-Requests. See CORS-Workaround in the readme."
          )
        );
      return auth.store.get(data.sessionID, (err, session) => {
        if (!session) return reject(new Error("No session found"));
        if (!session[auth.passport._key])
          return reject(new Error("Passport was not initialized"));
        const userKey = session[auth.passport._key].user;
        if (typeof userKey === "undefined")
          return reject(
            new Error(
              "User not authorized through passport. (User Property not found)"
            )
          );
        return auth.passport.deserializeUser(userKey, data, (desErr, user) => {
          if (desErr) return reject(desErr);
          if (!user) return reject(new Error("User not found"));
          return resolve(user);
        });
      });
    });
  };
}

export default prepareGetUserFromPassport;
