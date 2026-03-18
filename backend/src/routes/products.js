import express from "express";
import productsController from "../controllers/productsController.js";

//Router() ayuda a colocar los métodos que tendrá el endpoint
const router = express.Router();

router.route("/").get(productsController.getProducts).post(productsController.insertProducts); //Endpoints sin necesidad de especificación (Inserción, Obtención de datos)

router.route("/:id").put(productsController.updateProducts).delete(productsController.deleteProducts); //Endpoints con id especificado (Actualizar, Eliminar)

export default router;
