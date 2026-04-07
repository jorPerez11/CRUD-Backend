import express from "express";
import clientController from "../controllers/clientsController.js"
import branchesController from "../controllers/branchesController";

//Router() ayuda a colocar los métodos que tendrá el endpoint
const router = express.Router();

router.route("/").get(clientController.getClients);

router.route("/:id").put(clientController.updateClient).delete(branchesController.deleteBranches);

export default router;