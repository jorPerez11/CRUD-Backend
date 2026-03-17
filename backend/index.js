import app from "./app.js";
import "./database.js";

//Función para ejecutar el servidor
async function main() {
    app.listen(4000); //Puerto de encendido. Por default, puerto 4000
    console.log("Server on port 4000");
} ;

main();

