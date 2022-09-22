import path from "path";
import { fileURLToPath } from "url";
import twilio from "twilio";
import dotenv from "dotenv";
import { sendEmailToAdmin } from "../controllers/emails.js";
import logger from "../loggers.js";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getHome = (req, res) => {
  res.sendFile(path.join(__dirname, "../../public/views/home.html"));
};

const getProduct = (req, res) => {
  res.sendFile(path.join(__dirname, "../../public/views/itemDetail.html"));
};

const getCart = (req, res) => {
  res.sendFile(path.join(__dirname, "../../public/views/cart.html"));
};

const getProfile = (req, res) => {
  res.render("profile", { user: req.session.passport.user });
};

const postMessage = async (req, res) => {
  const carrito = JSON.parse(req.body.cart);
  const user = req.session.passport.user;
  let message = `Nuevo pedido de ${user.username}\nEmail: ${user.email}\nProductos solicitados:\n`;
  for (let i = 0; i < carrito.length; i++) {
    message += `${carrito[i].title}  $${carrito[i].price}\n`;
  }
  const client = twilio(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);
  const options = {
    body: message,
    from: "whatsapp:+14155238886",
    to: `whatsapp:+${process.env.GEO}9${process.env.NUM}`,
  };
  const optionsClient = {
    body: "Su pedido ha sido registrado con exito.\nFutCor",
    from: "+15392454158",
    to: `+${process.env.GEO}${user.phone}`,
  };
  try {
    // E-mail al admin
    await sendEmailToAdmin(
      message,
      `Nuevo pedido de ${user.username}\nEmail: ${user.email}`
    );
    //WhatsApp al admin
    await client.messages.create(options);

    //Mensaje al cliente
    await client.messages.create(optionsClient);
  } catch (error) {
    logger.error(error);
  }
};

export { getHome, getProduct, getCart, getProfile, postMessage };
