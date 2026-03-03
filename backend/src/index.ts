import express from 'express';
import cookieParser from "cookie-parser"
import { userRouter } from "./modules/user/userRouter";

const app = express()

app.use(express.json())
app.use(cookieParser())

app.use("/api/user", userRouter())

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});