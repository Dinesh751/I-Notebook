const jwt = require("jsonwebtoken");
const jwt_secret = "kdjifknifhi";

fetchuser = (req, res, next) => {
  const token = req.header("auth-token");

  if (!token) {
    res.status(401).json({ error: "please enter token!" });
  }

  try {
    const data = jwt.verify(token, jwt_secret);
    req.user = data.user;
    next();
  } catch (err) {
    res.status(401).json({ error: "please enter valid token!", err })
  }
};

module.exports = fetchuser;
