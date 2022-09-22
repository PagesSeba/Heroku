import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getSignUp = (req, res) => {
  res.sendFile(path.join(__dirname, "../../public/views/signup.html"));
};

const postSignUp = (req, res) => {
  res.sendFile(path.join(__dirname, "../../public/views/home.html"));
};

const getFailsignup = (req, res) => {
  console.log("Error");
  res.render("signup-error", {});
};

export { getSignUp, postSignUp, getFailsignup };
