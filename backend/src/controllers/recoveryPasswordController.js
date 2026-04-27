import jsonwebtoken from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import config from '../../config.js';
import customerModel from '../models/clients.js';
import crypto from 'crypto';
import mailRecoveryHTML from '../Utils/sendMailRecovery.js';

//Array de funciones
const recoveryPasswordController = {};

recoveryPasswordController.requestCode = async (req, res) => {
    try {
        //1. Solicitar datos
        const { email } = req.body;

        //2. Verificar existencia del correo en DB
        const userFound = await customerModel.findOne({ email });

        if (!userFound) {
            return res.status(400).json({ message: "User Not Found" });
        }

        //3. Generación de código aleatorio
        const randomCode = crypto.randomBytes(3).toString("hex");

        //4. Almacenamiento de datos en token
        const token = jsonwebtoken.sign({
            email,
            randomCode,
            userType: "Customer",
            verified: false
        },
            config.JWT.secret,

            { expiresIn: "15m" }
        );

        //Creación de cookie
        res.cookie("recoveryCookie", token, { maxAge: 15 * 60 * 100 });

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: config.email.user_email,
                pass: config.email.user_pass,
            }
        });

        const mailOptions = ({
            from: config.email.user_email,
            to: email,
            subject: "Código de recuperación",
            body: "Él código expira en 15 minutos",
            html: mailRecoveryHTML(randomCode)
        });

        transporter.sendMail(mailOptions, (error, options) => {
            if (error) {
                return res.status(500).json({ message: "Internal Server Error" })
            }
        });

        return res.status(200).json({message: "Code Sent Succesfully"})


    } catch (err) {
        console.log("error:" + err)
        return res.status(500).json({ message: "Internal Server Error" });
    }

};

recoveryPasswordController.verifyCode = async (req, res) => {
    try {
        //1. Solicitar datos
        const { code } = req.body;

        //2. Verificar existencia de cookie
        const token = req.cookies.recoveryCookie;

        //Variable para decodificar codigo ingresado
        const decoded = jsonwebtoken.verify(token, config.JWT.secret);

        //3. Verificar código
        if (code !== decoded.randomCode) {
            return res.status(400).json({ message: "Invalid Code" });
        }

        //4. Generar nuevo token con datos del usuario
        const newToken = jsonwebtoken.sign({
            email: decoded.email,
            userType: decoded.userType,
            verified: true
        },
            config.JWT.secret,
            { expiresIn: "15m" }
        );

        res.cookie("newRecoveryCookie", newToken, { maxAge: 15 * 60 * 100 });

        return res.status(200).json({ message: "Código verificado correctamente" });


    } catch (err) {
        console.log("error:" + err)
        return res.status(500).json({ message: "Internal Server Error" });
    }
};


recoveryPasswordController.newPassword = async (req, res) => {
    
    try{
        //1. Solicitar datos
    const {newPassword, confirmPassword} = req.body;

    //2. Comparar ambas contraseñas
    if (newPassword != confirmPassword){
        return res.status(400).json({message: "Password Doesn’t match"});
    }

    //Comparar que la constante verified que esta en el token este en true
    const token = req.cookies.newRecoveryCookie;
    const decoded = jsonwebtoken.verify(token, config.JWT.secret);

    if(!decoded.verified){
        return res.status(400).json({message: "Code Not Found"})
    }

    //Encriptar
    const passwordHash = await bcrypt.hash(newPassword, 10);

    //Actualizar contraseña
    await customerModel.findOneAndUpdate(
        {email: decoded.email},
        {password: passwordHash},
        {new: true}
    );

    res.clearCookie("newRecoveryCookie");

    return res.status(200).json({message: "Password Updated Succesfully"})
    }catch(err){
        console.log("error:" + err)
        return res.status(500).json({message: "Internal Server Error"})
    }
};

export default recoveryPasswordController;