import nodemailer from "nodemailer"; //Envio de correos
import crypto from "crypto"; //Generación de código aleatorio
import jsonwebtoken from "jsonwebtoken"; //Token
import bcryptjs from "bcryptjs"; //Encriptación
import { config } from "../../config.js";

//Array de funciones
const registerEmployeesController = {};

registerEmployeesController.register = async (req, res) => {
    //1. Solicitar datos
    const { name, lastName, salary, DUI, phone, email, password, idBranch, isVerified  } = req.body;

    try {
        //2. Validar que el correo no exista
        const existingEmployee = await employeeModel.findOne({ email });
        if (existingEmployee) {
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
                salary,
                DUI,
                phone,
                email,
                password: passwordHash,
                idBranch,
                isVerified,
            },
            config.JWT_SECRET,
            { expiresIn: "15m" } //El token expira en 15 minutos
        );

        res.cookie("registrationCookie", token, { maxAge: 15 * 60 * 1000 }) //La cookie expira en 15 minutos

        //Envío de código aleatorio por correo
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: config.email.user_email,
                pass: config.email.user_pass
            }
        });

        //#2 Creación de mailOptions (Envio de código)
        await transporter.sendMail({
            from: config.email.user_email,
            to: email,
            subject: "Código de Verificación",
            text: "Para registrarse como empleado, utilice el siguiente código de verificación: " + randomNumber + "\n\nEste código es válido por 15 minutos."
        });

        //#3 Envio del código
         transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log("error" + error)
                return res.status(500).json({ message: "Mail Service Error" })
            }
            return res.status(200).json({ message: "Email Sent Succesfully" })
        });


    } catch (error) {
        console.log("error", error);
        return res.status(500).json({ message: "Internal Server Error" })
    };
}

//Verificación del código ingresado
registerEmployeesController.verifyCode = async (req, res) => {
    try {
        //Solicitud del código enviado en el frontend
        const { verificationCodeRequest } = req.body;

        //Obtención del token de las cookies
        const token = req.cookies.registrationCookie;

        //Extracción de la info del token
        const decoded = jsonwebtoken.verify(token, config.JWT_SECRET);

        const {
            randomNumber: storedCode,
            name,
            lastName,
            salary,
            DUI,
            phone,
            email,
            password: passwordHash,
            idBranch,
            isVerified
        } = decoded;
        
        //Comparación de lo ingresado por el usuario con el código del token
        if (verificationCodeRequest !== storedCode) {
            return res.status(400).json({ message: "Invalid Code" });
        }

        const newEmployee = new employeeModel({
            name,
            lastName,
            salary,
            DUI,
            phone,
            email,
            password: passwordHash,
            idBranch,
            isVerified
        });

        await newEmployee.save();

        return res.status(200).json({ message: "Employee Created Succesfully" });

    } catch (error) {
        console.log("error", error);
        return res.status(500).json({ message: "Internal Server Error" });
    };
}

export default registerEmployeesController;
