import {Schema, model} from "mongoose";

/*
    Campos:
    name
    email
    password
    isVerified

*/

const adminSchema = new Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    },
    isVerified: {
        type: Boolean,
    }

}, {
    timestamps: true,
    strict: false
});

export default model("Admin", adminSchema);