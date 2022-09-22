let admin = true;

const checkIfAdmin = (req, res, next) => {
  admin
    ? next()
    : res.status(401).json({ error: -1, descripcion: "Ruta no autorizada" });
};

function checkAuth(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/login");
  }
}

export { checkAuth, checkIfAdmin };
