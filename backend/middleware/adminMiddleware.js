const isAdmin = (req, res, next) => {
  if (!req.user || !req.user.role === "admin") {
    return res.status(403).json({ message: "Unauthorized" });
  }
  next();
};

module.exports = isAdmin;
