import './loadEnv';
import express from 'express';
import cookieParser from "cookie-parser"
import { corsMiddleware } from "./common/middleware/cors";
import { userRouter } from "./modules/user/userRouter";
import { lookingForRouter } from "./modules/looking_for/looking_forRouter"
import { drinkingRouter } from "./modules/drinking/drinkingRouter"
import { smokeRouter } from "./modules/smoke/smokeRouter"
import { workoutRouter } from "./modules/workout/workoutRouter"
import { petRouter } from "./modules/pet/petRouter"
import { userImageRouter } from "./modules/user_image/userImageRouter"
import {locationRouter } from "./modules/location/locationRouter"
import { locationImageRouter } from "./modules/location_image/locationImageRouter"
import { locationReviewRouter } from "./modules/location_review/locationReviewRouter"
import {selectCancelRouter} from "./modules/select_cancel/selectCancelRouter"
import {userInformationRouter} from "./modules/user_information/userInformationRouter"

import { mapRouter } from "./modules/map/mapRouter";
import {userLifeStyleRouter} from "./modules/user_life_style/userLifeStyleRouter"
import { activityRouter } from "./modules/activity/activityRouter"


const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(corsMiddleware)


// login , register , logout
app.use("/v1/api/auth", userRouter())
app.use("/v1/user-image" , userImageRouter())
app.use("/v1/life-style/looking-for" , lookingForRouter())
app.use("/v1/life-style/drinking" , drinkingRouter())
app.use("/v1/life-style/smoke" , smokeRouter())
app.use("/v1/life-style/workout" , workoutRouter())
app.use("/v1/life-style/pet" , petRouter())
app.use("/v1/location" , locationRouter())
app.use("/v1/location-image" , locationImageRouter())
app.use("/v1/location-review" , locationReviewRouter())
app.use("/v1/select-cancel" , selectCancelRouter())
app.use("/v1/user-information" , userInformationRouter())
app.use("/v1/user-life-style" , userLifeStyleRouter())
app.use("/v1/activity", activityRouter())

// Mapbox token endpoint
app.use("/v1/map", mapRouter());



app.listen(3000, () => {
  console.log('Server is running on port http://localhost:3000');
});