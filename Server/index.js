import express from "express";
import dotenv from "dotenv";
dotenv.config();

import connectDB from "./Configs/connectDB.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRouter from "./Routes/auth.route.js";
import userRouter from "./Routes/user.route.js";
import assistantRouter from "./Routes/assistant.route.js";
import billingRouter from "./Routes/billing.route.js";

const app = express();

// Private cors
const privateCors = 
    cors({ 
        origin: [
            process.env.CLIENT_URL,
        ],
        credentials: true
    });

    // Public cors
const publicCors = 
    cors({
        origin: "*",
    });

app.use(express.json());
app.use(cookieParser());

// API Path's
app.use("/api/auth",privateCors, authRouter);
app.use("/api/user",privateCors, userRouter);
app.use("/api/billing",privateCors, billingRouter);

app.use("/api/assistant",publicCors, assistantRouter);


app.get("/", (req, res)=>{
    res.json("Welcome");
})


const PORT = process.env.PORT;

app.listen(PORT, ()=>{
    console.log(`Server started on port ${PORT}`);
    connectDB();
})