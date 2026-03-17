import mongoose, { connection } from "mongoose"

mongoose.connect("mongodb://localhost:27017/megapacaDB");

//Comprobar que todo funciona
const connection = mongoose.connection;

connection.once("open", () =>{
    console.log("DB is connected");
});

connection.on("disconnected", () => {
    console.log("DB is disconnected");
});

connection.on("error", (error) => {
    console.log("DB Error: " + error);
});

