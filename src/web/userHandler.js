const jwt = require('jsonwebtoken');
const users = require('../db/user');
const { jwtSecret } = require('../config');

async function register(req, res) {
  const user = await users.register(req.body);
  // HAZI 3: keszitsetek egy jwt tokent es kuldjetek el a user mellet { token, user }
  res.send(user);
}

async function login(req, res) {
  const { email, password } = req.body;
  // HAZI 4: kerjetek le a usert a db-bol es validaljatok az email/jelszo parost
  // ha hibas adatot kaptok valaszoljatok relevans statusz koddal es uzenettel

  const token = jwt.sign({ email }, jwtSecret);

  // HAZI 4: kuldjetek vissza a usert a token mellett { token, user }
  res.send({ token });
}

/* async function loginBasicCookie(req, res) {
  const { email, password } = req.body;
  // validalni kell a usert!!
  const sessionToken = Buffer.from(`${email}:${password}`).toString('base64');
  res.cookie('session', sessionToken, { maxAge: 9000000, httpOnly: true }).end();
  // user elkuldese
} */

/* async function loginJWTCookie(req, res) {
  const { email, password } = req.body;
  // validalni kell a usert!!
  const token = jwt.sign({ email }, jwtSecret, { maxAge: 90000000 });

  // user elkuldese
  res.cookie('token', token, { maxAge: 900000000, httpOnly: true }).end();
} */

module.exports = {
  register,
  login,
};
