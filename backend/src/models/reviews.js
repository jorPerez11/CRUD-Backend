import mongoose, {Schema, model} from "mongoose"

/*
    Campos
    idEmployee,
    idProduct,
    rating
    comment
*/

const reviewSchema = new Schema ({
    idEmployee:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employees"
    },
    idProduct:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Products"
    },
    rating:{
        type: Number
    },
    comment:{
        type: String
    }
}, {
    timestamps: true, //Añade campos createdAt, updatedAt y la versión del documento (__v)
    strict: false //False por si se desea agregar más campos en la colección 
});

export default model ("Reviews", reviewSchema);

