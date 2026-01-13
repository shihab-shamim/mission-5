
import express, { Application, Request, Response } from "express";

import { toNodeHandler } from "better-auth/node";
import cors from 'cors';
import { postRouter } from "./moules/post.router";
import { auth } from "./lib/auth";
import { commentRouter } from "./moules/comment/comment.router";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import { notFound } from "./middlewares/notFound";

const app: Application = express();

// export const logout = async (req: Request, res: Response) => {
//   await auth.api.signOut({
//     headers: req.headers as any, // 👈 cookie pass
//   });

//   return res.status(200).json({
//     success: true,
//     message: "Logged out successfully",
//   });
// };

app.use(cors({
    origin: process.env.APP_URL || "http://localhost:5000", // client side url 
    credentials: true
}))

app.use(express.json());


app.all("/api/auth/*splat", toNodeHandler(auth));

app.use("/posts", postRouter);
// app.post("/logout", logout);
app.use("/comments",commentRouter)

app.get("/", (req, res) => {
    res.send("Hello from blog server !");
});
app.use(globalErrorHandler)
app.use(notFound)




export default app;