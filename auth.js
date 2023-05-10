'use strict';

const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');
const client = jwksClient({
  jwksUri: process.env.JWKS_URI,
});

const getKey = (header) => {
  return new Promise((resolve, reject) => {
    client.getSigningKey(header.kid, (err, key) => {
      if (err) {
        reject(err);
      } else {
        const signingKey = key.publicKey || key.rsaPublicKey;
        resolve(signingKey);
      }
    });
  });
};

const verifyUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = await jwt.decode(token, { complete: true });
    const header = decoded.header;
    const key = await getKey(header);
    const options = { algorithms: ['RS256'] };
    await jwt.verify(token, key, options);
    next();
  } catch (error) {
    console.error(error);
    res.status(401).send('Unauthorized');
  }
};

module.exports = verifyUser;
