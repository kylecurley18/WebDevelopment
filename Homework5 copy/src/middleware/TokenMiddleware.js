const crypto = require('crypto');
const { Buffer } = require('buffer');


const TOKEN_COOKIE_NAME = "NCParksToken";

const API_SECRET = process.env.API_SECRET_KEY;

function base64urlEncode(string) {
  return Buffer.from(string, 'utf8').toString('base64url');
}

function base64urlDecode(string) {
  return Buffer.from(string, 'base64url').toString('utf8');
}

function generateToken(payload, secret, expiresIn) {
  const header = {
    alg: 'HS256',
    typ: 'JWT'
  };

  const encodedHeader = base64urlEncode(JSON.stringify(header));
  const encodedPayload = base64urlEncode(JSON.stringify(payload));

  const signature = crypto.createHmac('sha256', secret)
                           .update(encodedHeader + '.' + encodedPayload)
                           .digest('base64url');

  const token = `${encodedHeader}.${encodedPayload}.${signature}`;

  return token;
}

function verifyToken(token, secret) {
  const [encodedHeader, encodedPayload, signature] = token.split('.');

  const expectedSignature = crypto.createHmac('sha256', secret)
                                  .update(encodedHeader + '.' + encodedPayload)
                                  .digest('base64url');

  if (signature !== expectedSignature) {
    throw new Error('Invalid token');
  }

  const payload = JSON.parse(base64urlDecode(encodedPayload));

  if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
    throw new Error('Token expired');
  }

  return payload;
}


exports.TokenMiddleware = (req, res, next) => {
  let token = null;
  if (!req.cookies[TOKEN_COOKIE_NAME]) {
    // No cookie, so let's check Authorization header
    const authHeader = req.get('Authorization');
    if (authHeader && authHeader.startsWith("Bearer ")) {
      // Format should be "Bearer token" but we only need the token
      token = authHeader.split(" ")[1].trim();
    }
  } else { 
    // We do have a cookie with a token
    token = req.cookies[TOKEN_COOKIE_NAME];
  }

  if (!token) { // If we don't have a token
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }

  // If we've made it this far, we have a token. We need to validate it
  try {
    const decoded = verifyToken(token, API_SECRET);
    req.user = decoded.user;
    next(); // Make sure we call the next middleware
  } catch (err) { // Token is invalid
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }
};



exports.generateToken = (req, res, user) => {
  const expiresIn = 60 * 60; // 1 hour expiration
  const token = generateToken({ user, exp: Math.floor(Date.now() / 1000) + expiresIn }, API_SECRET, expiresIn);

  //send token in cookie to client
  res.cookie(TOKEN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: true,
    maxAge: expiresIn * 1000 // Convert seconds to milliseconds
  });
};



exports.removeToken = (req, res) => {
  //send session ID in cookie to client
  res.cookie(TOKEN_COOKIE_NAME, "", {
    httpOnly: true,
    secure: true,
    maxAge: -360000 //A date in the past
  });

}