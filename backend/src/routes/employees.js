import express from "express";
import employeesController from "../controllers/employeesController.js";

//Router() ayuda a colocar los métodos que tendrá el endpoint
const router = express.Router();

router.route("/").get(employeesController.getEmployees).post(employeesController.insertEmployees); //Endpoints sin necesidad de especificación (Inserción, Obtención de datos)

router.route("/:id").put(employeesController.updateEmployees).delete(employeesController.deleteEmployees); //Endpoints con id especificado (Actualizar, Eliminar)   

export default router;