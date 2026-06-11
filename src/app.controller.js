import express from "express"
import {env} from "../config/env.service.js"
import { databaseConnection } from "./database/connection.js";
import userRouter from "./module/user/user.controller.js";
import noteRouter from "./module/note/note.controller.js";
import { globalhandlingerror, NotFoundException } from "./common/Response/err.response.js";


export const bootstrap=async()=>{
    console.log("app is bootstrapping...");
    const app=express()
    app.use(express.json())
    await databaseConnection()
    
    app.use("/users",userRouter)
    app.use("/notes",noteRouter)
    app.use((req,res,next)=>{
        return res.status(404).json({
            success:false,
            message:"Route not found"

        })
    })
    app.use(globalhandlingerror)

   
app.get("/check-health",(req,res)=>{
res.json({status:"ok",message:`server is running`})
})





    app.listen(env.port,()=>{
        console.log(`server is running on port ${env.port}`);
        
    })
}
