import express from "express";
import dotenv from "dotenv";
dotenv.config();

import connectDB from "./Configs/connectDB.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRouter from "./Routes/auth.route.js";
import userRouter from "./Routes/user.route.js";

const app = express();

app.use(cors({ 
    origin: process.env.CLIENT_URL,
    credentials: true
}))

app.use(express.json());
app.use(cookieParser());

// API Path's
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

app.get("/", (req, res)=>{
    res.json("Welcome");
})


const PORT = process.env.PORT;

app.listen(PORT, ()=>{
    console.log(`Server started on port ${PORT}`);
    connectDB();
})