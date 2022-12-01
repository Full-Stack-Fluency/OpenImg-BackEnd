'use strict';

const jwt = require('jsonwebtoken');

const jwksClient = require('jwks-rsa');

const client = jwksClient({
  jwksUri: process.env.JWKS_URI
});


function getKey(header, callback) {
  client.getSigningKey(header.kid, function(err,key) {
    var signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
}

function verifyUser(request, errorFirstOrUserCallbackFunction) {
  try {
    const token = request.headers.authorization.split(' ')[1];
    console.log(token);
    jwt.verify(token, getKey, {}, errorFirstOrUserCallbackFunction);
  } catch(error) {
    errorFirstOrUserCallbackFunction('not authorized');
  }
}

module.exports = verifyUser;
