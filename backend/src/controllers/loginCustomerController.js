import clientsModel from "../models/clients.js";

import bcrypt from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import config from "../../config.js";

const loginCustomerController = {};

loginCustomerController.login = async (req, res) => {
    //1. Solicitar datos del usuario
    const {email, password} = req.body


    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
 
    //Validación de correo
    if (!email || !emailRegex.test(email)) {
        return res.status(400).json({ message: "Correo inválido" }); 
    }

    try{
        //Buscar correo electrónico en la base de datos
        const foundClient = await clientsModel.findOne({email});

        //Validar existencia del cliente en la base de datos
        if(!foundClient){
            return res.status(400).json({message: "Customer Not Found"});
        }

        //Verificar si el usuario esta bloqueado
        if(foundClient.timeOut && foundClient.timeOut > Date.now()){
            return res.status(403).json({message: "Exceeded Login Attempts"});
        }

        //Comparar contraseña ingresada con la del usuario
        const isMatch = await bcrypt.compare(password, foundClient.password);

        if(!isMatch){
            //Si no coinciden, incrementar el número de intentos fallidos
            foundClient.loginAttempts = (foundClient.loginAttempts || 0) + 1;

            //Si el número de intentos es mayor o igual a 5, bloquear al usuario por 15 minutos
            if(foundClient.loginAttempts >= 5){
                foundClient.timeOut = Date.now() + 15 * 60 * 1000;
                foundClient.loginAttempts = 0;

                await foundClient.save();
                return res.status(400).json({message: "Error: Exceeded Login Attempts"})
            }
        }

        //Reset de intentos fallidos y bloqueo
        foundClient.loginAttempts = 0;
        foundClient.timeOut = null;
        await foundClient.save();

        //Creación de token JWT
        const token = jsonwebtoken.sign(
            //#1 Almacenar datos de usuario
            {
                id: foundClient._id, 
                userType: "Customer", 
                email: foundClient.email    
            },

            //#2 Secret Key
            config.JWT.secret,

            //#Tiempo de expiración
            {expiresIn: "30d"}
        );

        //Almacenar el token en una cookie
        res.cookie("authCookie", token);

        return res.status(200).json({message: "Login Succesful"});


    } catch(err){
        res.status(500).json({message: "Internal Server Error" + err.message});
    }
}

export default loginCustomerController;

