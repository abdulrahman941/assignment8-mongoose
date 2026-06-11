import dotenv from "dotenv"
dotenv.config({path:"./config/.env"})
const port=process.env.PORT
const databasename=process.env.DATABASENAME
const databasepassword=process.env.DATABASEPASSWORD
const databaseuser=process.env.DATABASEUSER
const databaseurl=process.env.DATABASEURL
const mood=process.env.MOOD



export const env={
port,
databasename,
databasepassword,
databaseuser,
databaseurl,
mood

}