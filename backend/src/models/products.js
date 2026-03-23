import {Schema, model} from "mongoose"
/*
    Campos
        nombre
        description
        price
        stock
*/

const productSchema = new Schema ({
    name:{
        type: String
    },
    description:{
        type: String
    },
    price:{
        type: Number
    },
    stock:{
        type: Number
    }
}, {
    timestamps: true, //Añade campos createdAt, updatedAt y la versión del documento (__v)
    strict: false //False por si se desea agregar más campos en la colección 
});

export default model ("Products", productSchema);