import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getLogin = (req, res) => {
  req.isAuthenticated()
    ? res.redirect("/")
    : res.sendFile(path.join(__dirname, "../../public/views/login.html"));
};

const postLogin = (req, res) => {
  res.sendFile(path.join(__dirname, "../../public/views/index.html"));
};

const getFailLogin = (req, res) => {
  res.render("login-error", {});
};

export { getLogin, postLogin, getFailLogin };
