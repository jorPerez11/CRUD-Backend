import express from "express"
import productRoutes from "./src/routes/products.js"
import branchesRoutes from "./src/routes/branches.js";
import employeesRoutes from "./src/routes/employees.js";
import reviewsRoutes from "./src/routes/reviews.js";
import clientRoutes from "./src/routes/clients.js";
import registerCustomerRoutes from "./src/routes/registerCustomer.js";
import registerAdminRoutes from "./src/routes/registerAdmin.js";
import registerEmployeesRoutes from "./src/routes/registerEmployee.js";
import loginCustomer from "./src/routes/loginCustomer.js"
import cookieParser from "cookie-parser";

//Variable almacenante de libreria express
const app = express();


app.use(cookieParser());

//Que acepte los JSON desde POSTMAN
app.use(express.json());

app.use("/api/products", productRoutes)

app.use("/api/branches", branchesRoutes);

app.use("/api/employees", employeesRoutes);

app.use("/api/reviews", reviewsRoutes);

app.use("/api/clients", clientRoutes);

app.use("/api/registerClients", registerCustomerRoutes);

app.use("/api/registerAdmins", registerAdminRoutes);

app.use("/api/registerEmployees", registerEmployeesRoutes);

app.use("/api/loginCostumer", loginCustomer);

//Se exporta la constante para su uso en otros archivos
export default app