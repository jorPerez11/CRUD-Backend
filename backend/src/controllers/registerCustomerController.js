import nodemailer from "nodemailer"; //Envio de correos
import crypto from "crypto"; //Generación de código aleatorio
import jsonwebtoken from "jsonwebtoken"; //Token
import bcryptjs from "bcryptjs"; //Encriptación
import { config } from "../../config.js";

import clientModel from "../models/clients.js";

//Array de funciones
const registerClientController = {};

registerClientController.register = async (req, res) => {
    //1. Solicitar datos
    const {
        name,
        lastName,
        birthdate,
        email,
        password,
        isVerified
    } = req.body;

    try {
        //2. Validar que el correo no exista
        const existingClient = await clientModel.findOne({ email });
        if (existingClient) {
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
                lastName,
                birthdate,
                email,
                password: passwordHash,
                isVerified,
            },
            //#2 Clave secreta para firmar el token (Debe ser una cadena larga y segura)
            config.JWT.secret,
            //#3 Opciones de Token (Tiempo de expiración)
            { expiresIn: "15m" },
        );

        res.cookie("registrationCookie", token, { maxAge: 15 * 60 * 1000 })

        //Envío de código aleatorio por correo
        //#1 Creación de transporter (Email Sender)
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: config.email.user_email,
                pass: config.email.user_pass,
            },

        })

        //#2 Creación de mailOptions (Envio de código)
        const mailOptions = {
            from: config.email.user_email,
            to: email,
            subject: "Verificación de Usuario",
            text: "Para verificar su cuenta, utilice el siguiente código: "
                + randomNumber + " Este código expira en 15 minutos."
        }

        //#3 Envio del código
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log("error" + error)
                return res.status(500).json({ message: "Mail Service Error" })
            }
            return res.status(200).json({ message: "Email Sent Succesfully" })
        });


    } catch (err) {
        console.log("error", err);
        return res.status(500).json({ message: "Internal Server Error" })
    };
};

//Verificación del código ingresado 
registerClientController.verifyCode = async (req, res) => {
    try {
        //Solicitar el coódigo enviado en el frontend
        const { verificationCodeRequest } = req.body;

        //Obtener el token de las cookies
        const token = req.cookies.registrationCookie

        //Extracción de la info de la token
        const decoded = jsonwebtoken.verify(token, config.JWT.secret);

        const {
            randomNumber: storedCode,
            name,
            lastName,
            birthdate,
            email,
            password,
            isVerified,
        } = decoded

        //Comparar lo ingresado por el usuario con el código del token
        if (verificationCodeRequest !== storedCode) {
            return res.status(400).json({ message: "Invalid Code" })
        }

        const newCustomer = new clientModel({
            name,
            lastName,
            birthdate,
            email,
            password,
            isVerified
        });

        await newCustomer.save();

        // Eliminar la cookie de registro
        res.clearCookie("registrationCookie");

        return res.status(200).json({message: "Customer Created Succesfully"})

    } catch (error) {
        console.log("error", error);
        return res.status(500).json({ message: "Internal Server Error" })
    };
};

export default registerClientController;