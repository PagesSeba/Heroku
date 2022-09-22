import { Router } from "express";
import CartDaoMongo from "../daos/cartDaoMongo.js";
import ProductDaoMongo from "../daos/productDaoMongo.js";
import { checkIfAdmin } from "../auth/auth.js";
import dotenv from "dotenv";
dotenv.config();

const router = Router();

const cart = new CartDaoMongo();
const product = new ProductDaoMongo();

router.get("/productos", product.getAll);
router.get("/productos/:id", product.getById);
router.post("/productos", checkIfAdmin, product.create);
router.put("/productos/:id", checkIfAdmin, product.update);
router.delete("/productos/:id", checkIfAdmin, product.delete);

router.post("/carrito", cart.create);
router.delete("/carrito/:id", cart.delete);
router.get("/carrito/:id/productos", cart.getProductsInCart);
router.post("/carrito/:id/productos", cart.addProductToCart);
router.delete("/carrito/:id/productos/:id_prod", cart.deleteProductInCart);

router.get("/user", (req, res) => {
  res.send({ ...req.session.passport, admin: process.env.ADMIN });
});

export default router;
