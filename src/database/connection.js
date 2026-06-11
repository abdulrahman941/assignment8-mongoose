import mongoose from "mongoose"
import {env} from "../../config/env.service.js"




export const databaseConnection=()=>{
 mongoose.connect(env.databaseurl).then(()=>{
  console.log("database connected");
  
 }).catch((error)=>{
  console.error(error);

 })
}
