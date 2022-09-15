const express = require('express');
const app = express();
const { Server: HttpServer } = require('http');
const { Server: IOServer } = require('socket.io');
const handlebars = require('express-handlebars');
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer)
const apiContenedor = require('./utils/apiContenedor.js')
const cookieParser = require('cookie-parser');
const apiRoutes = require('./routes/apiRoutes')
const session = require('express-session');
const MongoStore = require("connect-mongo");
const { engine } = require('express-handlebars');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require ("./config.js");

const router = require('./routes/router');
const os = require( "os");
const cluster = require ("cluster");
const compression = require ("compression");
const logger = require("./logger.js");


const cpus = os.cpus();

app.engine(
    "hbs",
    handlebars.engine({
        extname: ".hbs",
        defaultLayout: 'main.hbs',
    })
    );
    app.set('views', './views');
    app.set('view engine', 'handlebars');

    if (config.ARG.mode == "cluster" && cluster.isPrimary) {
        cpus.map(() => {
          cluster.fork();
        });
      
        cluster.on("exit", (worker) => {
          logger.info(`Worker ${worker.process.pid} died!`);
          cluster.fork();
        });
      } else {
    
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }))
    app.use(express.static('public'))
    app.use(cookieParser());
    app.use(session({
      secret: config.KEY_SECRET,
      rolling: true,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: false,
        secure: false,
        maxAge: config.TIEMPO_EXPIRACION,
      },
    }));
    
    app.use(passport.initialize());
    app.use(passport.session());
    
    const loggerURL = (req, res, next) => {
      const { url, method } = req;
      logger.info(`Petición  ${method} recibida en ruta: ${url}`);
      next();
    }
    app.use(compression());
    app.use(loggerURL);

    app.use(router);
    app.use(express.static('views'));
    app.engine('handlebars', engine());
    app.use('/api', apiRoutes)

    app.get("*", (req, res) => {
      const { url, method } = req;
      logger.warn(`Ruta ${method} ${url} no implementada`);
      res.status(404).render("routing-error", {});
    });


const productos = apiContenedor.generarProducto()
const mensajes = apiContenedor.generarMensajes()
//Socket
io.on('connection', (socket) => {
    console.log('Un cliente se ha conectado')
    socket.emit('messages', mensajes)
    socket.emit('productos', productos)

    socket.on('new-message', async data => {
        apiContenedor.guardarMensaje(data)
        io.sockets.emit('messages',  await apiContenedor.obtenerMensajes())
    })

    socket.on('new-product', data => {
        io.sockets.emit('productos', apiContenedor.insertarProducto(data))
    })
})
const server = httpServer.listen(config.ARG.port, async () => {
    await mongoose.connect(config.MONGO_URL)
   logger.info(`Server running on port ${config.ARG.port} - pid: ${process.pid}`);
});
server.on('error', err => logger.error(`Error: ${err}`));
}