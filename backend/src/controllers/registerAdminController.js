import nodemailer from "nodemailer"; //Envio de correos
import crypto from "crypto"; //Generación de código aleatorio
import jsonwebtoken from "jsonwebtoken"; //Token
import bcryptjs from "bcryptjs"; //Encriptación
import { config } from "../../config.js";

import adminModel from "../models/admin.js";

//Array de funciones
const registerAdminsController = {};

registerAdminsController.register = async (req, res) => {
    //1. Solicitar datos
    const { name, email, password, isVerified } = req.body;

    try {
        //2. Validar que el correo no exista
        const existingAdmin = await adminModel.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ message: "Email already exists" });
        }

        //3. Encriptación de contraseña
        const passwordHash = await bcryptjs.hash(password, 10); //10 Es el número de veces que se encripta. Se le conoce como "salt rounds" 

        //4. Generación de código de verificación (Número aleatorio) y envío por correo
        const randomNumber = crypto.randomBytes(3).toString("hex"); //Genera un número aleatorio de 6 dígitos (3 bytes en hexadecimal)

        //5. Se guarda la información en un token
        const token = jsonwebtoken.sign(
            //#1 Payload del token
            {
                randomNumber,
                name,
                email,
                password: passwordHash,
                isVerified,
            },
            config.JWT_SECRET,
            { expiresIn: "15m" }
        );
        res.cookie("registrationCookie", token, { maxAge: 15 * 60 * 1000 })

        //Envío de código aleatorio por correo
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: config.email.user_email,
                pass: config.email.user_pass
            }
        });

        await transporter.sendMail({
            from: config.email.user_email,
            to: email,
            subject: "Código de Verificación",
            text: "Para registrarse como administrador, utilice el siguiente código de verificación: " + randomNumber + "\n\nEste código es válido por 15 minutos."
        });

        res.status(201).json({ message: "Admin registered successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};


//Verificación del código ingresado
registerAdminsController.verifyCode = async (req, res) => {
    try {
        //Solicitar el código enviado en el frontend
        const { verificationCodeRequest } = req.body;

        //Obtener el token de las cookies
        const token = req.cookies.registrationCookie

        //Extracción de la info de la token
        const decoded = jsonwebtoken.verify(token, config.JWT.secret);

        const {
            randomNumber: storedCode,
            name,
            email,
            password,
            isVerified,
        } = decoded

        //Comparar lo ingresado por el usuario con el código del token
        if (verificationCodeRequest !== storedCode) {
            return res.status(400).json({ message: "Invalid Code" })
        }

        new adminModel({
            name,
            email,
            password,
            isVerified
        });

        await newAdmin.save();

        // Eliminar la cookie de registro
        res.clearCookie("registrationCookie");

        return res.status(200).json({ message: "Admin Created Succesfully" })

    } catch (error) {
        console.log("error", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export default registerAdminsController;

