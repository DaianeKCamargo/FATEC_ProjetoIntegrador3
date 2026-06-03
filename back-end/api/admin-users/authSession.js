const crypto = require("crypto");

const COOKIE_NAME = "tampets_admin_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 12;

function getSessionSecret() {
    const isProduction = process.env.NODE_ENV === "production";
    const secret = process.env.SESSION_SECRET || (isProduction ? "" : "tampets-dev-session-secret");

    if (!secret) {
        throw new Error("SESSION_SECRET deve ser configurado em producao.");
    }

    return secret;
}

function sign(payload) {
    return crypto
        .createHmac("sha256", getSessionSecret())
        .update(payload)
        .digest("base64url");
}

function parseCookies(cookieHeader = "") {
    return cookieHeader
        .split(";")
        .map((item) => item.trim())
        .filter(Boolean)
        .reduce((cookies, item) => {
            const separatorIndex = item.indexOf("=");

            if (separatorIndex === -1) {
                return cookies;
            }

            const key = item.slice(0, separatorIndex);
            const value = item.slice(separatorIndex + 1);
            cookies[key] = decodeURIComponent(value);
            return cookies;
        }, {});
}

function createSessionToken(admin) {
    const payload = Buffer.from(JSON.stringify({
        idAdmin: admin.idAdmin,
        username: admin.username,
        emailUser: admin.emailUser,
        exp: Date.now() + SESSION_MAX_AGE_SECONDS * 1000,
    })).toString("base64url");
    const signature = sign(payload);

    return `${payload}.${signature}`;
}

function readSessionToken(token) {
    if (!token || !token.includes(".")) {
        return null;
    }

    const [payload, signature] = token.split(".");
    const expectedSignature = sign(payload);
    const signatureBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expectedSignature);

    if (signatureBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(signatureBuffer, expectedBuffer)) {
        return null;
    }

    const session = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));

    if (!session.exp || session.exp < Date.now()) {
        return null;
    }

    return session;
}

function setAdminSessionCookie(res, admin) {
    const isProduction = process.env.NODE_ENV === "production";
    const token = createSessionToken(admin);

    res.cookie(COOKIE_NAME, token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        maxAge: SESSION_MAX_AGE_SECONDS * 1000,
        path: "/",
    });

    return token;
}

function clearAdminSessionCookie(res) {
    const isProduction = process.env.NODE_ENV === "production";

    res.clearCookie(COOKIE_NAME, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        path: "/",
    });
}

function getAdminSession(req) {
    if (req.session?.logado && req.session?.admin) {
        return req.session.admin;
    }

    const authorization = req.headers.authorization || "";
    const bearerToken = authorization.startsWith("Bearer ")
        ? authorization.slice("Bearer ".length).trim()
        : null;

    if (bearerToken) {
        return readSessionToken(bearerToken);
    }

    const cookies = parseCookies(req.headers.cookie);
    return readSessionToken(cookies[COOKIE_NAME]);
}

function requireAdminSession(req, res, next) {
    const admin = getAdminSession(req);

    if (admin) {
        req.admin = admin;
        return next();
    }

    return res.status(401).json({ message: "Autenticacao obrigatoria" });
}

module.exports = {
    clearAdminSessionCookie,
    requireAdminSession,
    setAdminSessionCookie,
};
