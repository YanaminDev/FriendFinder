import express from 'express';
import cookieParser from "cookie-parser"
import { userRouter } from "./modules/user/userRouter";


const app = express()

app.use(express.json())
app.use(cookieParser())


// login , register , logout
app.use("/v1/api/auth", userRouter())




app.listen(3000, () => {
  console.log('Server is running on port http://localhost:3000');
});