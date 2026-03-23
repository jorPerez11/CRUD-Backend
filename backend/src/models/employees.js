import mongoose, {Schema, model} from "mongoose";

/*
    Campos 
    nombre
    apellido
    salario
    DUI
    telefono
    correo
    contraseña
    idBranch
*/ 

const employeeSchema = new Schema ({
    name:{
        type: String
    },
    lastName:{
        type: String
    },
    salary:{
        type: Number
    },
    DUI:{
        type: String   
    },
    phone:{
        type: String
    },
    email:{
        type: String
    },
    password:{
        type: String    
    },
    idBranch:{//Referencia al ID de la sucursal a la que pertenece el empleado
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Branches"
    }
    }, {
        timestamps: true,
        strict: false
    });

    export default model ("Employees", employeeSchema);

