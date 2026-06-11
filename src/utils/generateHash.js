import bcrypt from "bcrypt"
import CryptoJS from "crypto-js"

export const generateHash=async(password)=>{
let encryptedData=await bcrypt.hash(password,8) 
return encryptedData
}

export const generateEncrypted=async(phone)=>{
    let encryptedPhone=await CryptoJS.AES.encrypt(phone,"Route").toString()
    return encryptedPhone
}