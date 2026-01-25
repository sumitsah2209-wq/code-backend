import 'dotenv/config';
// npm init -y
// npx tsc --init

import express, { Request, Response } from "express";
import { connectDB } from "./config/db.config";
import { ENV_CONFIG } from './config/env.config';



const app = express();
const PORT =ENV_CONFIG.port || 8000;
//! connect to database

connectDB();




//! root route
app.get("/",(req:Request ,res:Response)=>{
    res.status(200).json({
        message: "server is up and running"
    })
})



// listen
app.listen(PORT , ()=>{
    console.log(`server is running at http://localhost:${PORT}`);
})