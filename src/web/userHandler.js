const users = require('../db/user');

async function register(req, res) {
  const user = await users.register(req.body);
  res.send(user);
}

async function login(req, res) {
  const { email, password } = req.body;
  const sessionToken = Buffer.from(`${email}:${password}`).toString('base64');
  res.cookie('session', sessionToken, { maxAge: 90000, httpOnly: true, secure: true }).end();
}

module.exports = {
  register,
  login,
};
