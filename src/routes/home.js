import { Router } from "express";
import {
  getHome,
  getProduct,
  getCart,
  getProfile,
  postMessage,
} from "../controllers/homeController.js";
import { checkAuth } from "../auth/auth.js";

const home = Router();

home.get("/", checkAuth, getHome);
home.get("/item", checkAuth, getProduct);
home.get("/cart", checkAuth, getCart);
home.get("/profile", checkAuth, getProfile);
home.post("/checkout", checkAuth, postMessage);

export default home;
