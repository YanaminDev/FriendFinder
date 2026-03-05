import express from 'express';
import cookieParser from "cookie-parser"
import { userRouter } from "./modules/user/userRouter";
import { lookingForRouter } from "./modules/looking_for/looking_forRouter"
import { drinkingRouter } from "./modules/drinking/drinkingRouter"
import { smokeRouter } from "./modules/smoke/smokeRouter"
import { workoutRouter } from "./modules/workout/workoutRouter"
import { petRouter } from "./modules/pet/petRouter"
import { userImageRouter } from "./modules/user_image/userImageRouter"

const app = express()

app.use(express.json())
app.use(cookieParser())


// login , register , logout
app.use("/v1/api/auth", userRouter())
app.use("/v1/user-image" , userImageRouter())
app.use("/v1/life-style/looking-for" , lookingForRouter())
app.use("/v1/life-style/drinking" , drinkingRouter())
app.use("/v1/life-style/smoke" , smokeRouter())
app.use("/v1/life-style/workout" , workoutRouter())
app.use("/v1/life-style/pet" , petRouter())


app.listen(3000, () => {
  console.log('Server is running on port http://localhost:3000');
});