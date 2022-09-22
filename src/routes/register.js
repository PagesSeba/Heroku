import { Router } from "express";
import bcrypt from "bcrypt";
import userDaoMongo from "../daos/userDaoMongo.js";
import {
  getSignUp,
  postSignUp,
  getFailsignup,
} from "../controllers/registerController.js";
import multer from "multer";
import { Strategy } from "passport-local";
import passport from "passport";
import { sendEmailToAdmin } from "../controllers/emails.js";

const users = new userDaoMongo();
const register = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, `${file.originalname}`);
  },
});
const upload = multer({ storage: storage });

function hashPassword(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
}

const signUpStrategy = new Strategy(
  { passReqToCallback: true },
  async (req, username, password, done) => {
    try {
      if (await users.ifExist(username)) {
        return done("User already exists");
      }
      req.body.password = hashPassword(password);
      const newUser = await users.create(req);
      const message = `
      Nombre: ${newUser.firstName}
      Apellido: ${newUser.lastName}
      E-mail: ${newUser.email}
      Usuario: ${newUser.username}
      Direccion: ${newUser.address}
      Telefono: ${newUser.phone}
      Edad: ${newUser.age}`;
      await sendEmailToAdmin(message, "Nuevo registro");
      done(null, newUser);
    } catch (err) {
      done(err);
    }
  }
);

passport.use("register", signUpStrategy);

passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.serializeUser((user, done) => {
  done(null, user);
});

register.get("", getSignUp);
register.post(
  "",
  passport.authenticate("register", { failureRedirect: "/register/fail" }),
  postSignUp
);
register.get("/fail", getFailsignup);

register.post("/upload", upload.single("avatar"), (req, res) => {
  res.send(req.file.originalname);
});

export default register;
