import express from "express"
import productRoutes from "./src/routes/products.js"

//Variable almacenante de libreria express
const app = express();

//Que acepte los JSON desde POSTMAN
app.use(express.json());

app.use("/api/products", productRoutes)

//Se exporta la constante para su uso en otros archivos
export default app