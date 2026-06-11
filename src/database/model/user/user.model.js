import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    phone: { type: String, required: true }, // سيتم تشفيره لاحقاً
    age: { 
        type: Number, 
        min: 18, 
        max: 60 
    }
}, { timestamps: true });


const usermodel=mongoose.model("usermodel",userSchema)

export default usermodel