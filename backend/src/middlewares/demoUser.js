function demoUser(req, res, next) {
  // In real SaaSapplication i will change JWT middleware sets req.user
  const userId = req.header("x-user-id") || "demo-user";
  req.user = { userId };
  next();
}

module.exports = { demoUser };
