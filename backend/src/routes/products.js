import express from "express";
import productsController from "../controllers/productsController";

//Router() ayuda a colocar los métodos que tendrá el endpoint
const router = express.Router();

router.route("/").get(productsController.getProducts).post(productsController.insertProducts);

router.route("/:id").put(productsController.updateProducts).delete(productsController.deleteProducts);

export default router;
