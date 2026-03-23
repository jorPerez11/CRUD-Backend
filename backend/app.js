import express from "express"
import productRoutes from "./src/routes/products.js"
import branchesRoutes from "./src/routes/branches.js";
import employeesRoutes from "./src/routes/employees.js";
import reviewsRoutes from "./src/routes/reviews.js";

//Variable almacenante de libreria express
const app = express();

//Que acepte los JSON desde POSTMAN
app.use(express.json());

app.use("/api/products", productRoutes)

app.use("/api/branches", branchesRoutes);

app.use("/api/employees", employeesRoutes);

app.use("/api/reviews", reviewsRoutes);

//Se exporta la constante para su uso en otros archivos
export default app