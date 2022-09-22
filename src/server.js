import express from "express";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import MongoStore from "connect-mongo";
import { engine } from "express-handlebars";
import { fileURLToPath } from "url";
import path from "path";
import os from "os";
import cluster from "cluster";

import routes from "./routes/api.js";
import register from "./routes/register.js";
import login from "./routes/login.js";
import logout from "./routes/logout.js";
import home from "./routes/home.js";
import logger from "./loggers.js";

const app = express();
const port = process.env.PORT || 8080;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const cpus = os.cpus();

app.engine(
  "hbs",
  engine({
    extname: ".hbs",
    defaultLayout: path.join(__dirname, "../public/views/layouts/main"),
    layoutsDir: path.join(__dirname, "../public/views"),
    partialsDir: path.join(__dirname, "../public/views/partials"),
  })
);

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "../public/views"));

app.use(express.static(path.join(__dirname, "../public")));

if (process.env.MODE == "cluster" && cluster.isPrimary) {
  cpus.map(() => {
    cluster.fork();
  });

  cluster.on("exit", (worker) => {
    logger.info(`Worker ${worker.process.pid} died!`);
    cluster.fork();
  });
} else {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(
    session({
      store: MongoStore.create({
        mongoUrl:
          "mongodb+srv://Seba:Seba123@cluster0.coymqb5.mongodb.net/?retryWrites=true&w=majority",
        mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
      }),
      secret: "coderhouse",
      rolling: true,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: false,
        secure: false,
        maxAge: parseInt(process.env.TIEMPO_EXPIRACION) || 600000,
      },
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());

  app.use("/", home);
  app.use("/api", routes);
  app.use("/register", register);
  app.use("/login", login);
  app.use("/logout", logout);

  app.get("*", (req, res) => {
    const { url, method } = req;
    logger.warn(`Ruta ${method} ${url} no implementada`);
    res.status(404).render("routing-error", {});
  });

  app.listen(port, (err) => {
    err
      ? logger.error(`Se produjo un error al iniciar el servidor ${err}`)
      : logger.info(`El servidor esta escuchando el puerto ${port}`);
  });
}
