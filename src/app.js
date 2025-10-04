import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";


const app = express();

app.use(express.json());
app.use(cors({limit: "16kb"}));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

export { app };
