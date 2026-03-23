import {Schema, model} from "mongoose"

/* 
    Campos:
    nombre,
    direccion,
    horario,
    isActive

*/

const productSchema = new Schema ({
    name:{
        type: String,
    },
    address:{
        type: String,
    },
    schedule:{
        type: String,
    },
    isActive:{
        type: Boolean,
    }
}, {
    timestamps: true, //Añade campos createdAt, updatedAt y la versión del documento (__v)
    strict: false //False por si se desea agregar más campos en la colección
});

export default model ("Branches", productSchema);