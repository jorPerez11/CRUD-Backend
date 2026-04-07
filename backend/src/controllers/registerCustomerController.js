import nodemailer from "nodemailer"; //Envio de correos
import crypto from "crypto"; //Generación de código aleatorio
import jsonwebtoken from "jsonwebtoken"; //Token
import bcryptjs from "bcryptjs"; //Encriptación

import clientModel from "../models/clients.js";

//Array de funciones
const registerClientController ={};

registerCustomerController.register = async (req, res) => {
    //1. Solicitar datos
    const {
        name,
        lastName,
        birthdate,
        email,
        password,
        isVerified
    } = req.body;

    try{



    }catch(err){
        console.log("error", error);
        return res.status(500).json({message: "Internal Server Error"})
    }
}