import './loadEnv';
import express from 'express';
import cookieParser from "cookie-parser"
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
import { matchRouter } from "./modules/match/matchRouter";
import {findMatchRouter} from "./modules/find_match/findMatchRouter";
import {chatRouter} from "./modules/chat/chatRouter";
import { chatMessageRouter } from './modules/chat_message/chatMessageRouter'

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
app.use("/v1/location" , locationRouter())
app.use("/v1/location-image" , locationImageRouter())
app.use("/v1/location-review" , locationReviewRouter())
app.use("/v1/select-cancel" , selectCancelRouter())
app.use("/v1/user-information" , userInformationRouter())
app.use("/v1/user-life-style" , userLifeStyleRouter())
app.use("/v1/match" , matchRouter())
app.use("/v1/find-match" , findMatchRouter())
app.use("/v1/chat" , chatRouter())
app.use("/v1/chat-message" , chatMessageRouter())

// Mapbox token endpoint
app.use("/v1/map", mapRouter());



app.listen(3000, () => {
  console.log('Server is running on port http://localhost:3000');
});