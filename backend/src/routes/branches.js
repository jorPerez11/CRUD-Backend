import express from "express";
import branchesController from "../controllers/branchesController.js";

//Router() ayuda a colocar los métodos que tendrá el endpoint
const router = express.Router();

router.route("/").get(branchesController.getBranches).post(branchesController.insertBranches); //Endpoints sin necesidad de especificación (Inserción, Obtención de datos)

router.route("/:id").put(branchesController.updateBranches).delete(branchesController.deleteBranches); //Endpoints con id especificado (Actualizar, Eliminar)

export default router;