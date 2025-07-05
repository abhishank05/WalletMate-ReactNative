import express from "express";
import dotenv from "dotenv";
import {initDB} from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";

import transactionsRoute from "./routes/transactionsRoute.js"
import job from './config/cron';

dotenv.config();

const app=express();

if(process.env.NODE_ENV==="production") job.start();

app.get("/api/health",(req,res)=>{
    res.status.json({status:"ok"});
});

//middleware
app.use(rateLimiter);
app.use(express.json());



const PORT=process.env.PORT||5001;



app.get('/',(req,res)=>{
    res.send("It is working");
});

app.use("/api/transactions",transactionsRoute);


initDB().then(()=>{
    app.listen(PORT,()=>{
        console.log("Server is running in port:5001");
    });
});
