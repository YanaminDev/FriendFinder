import './loadEnv';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cookieParser from "cookie-parser"
import { corsMiddleware } from "./common/middleware/cors";
import { setupSocket } from './socket/socketHandler';
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
import { activityRouter } from "./modules/activity/activityRouter"
import { experienceRouter } from "./modules/experience/experienceRouter"
import { cancellationRouter } from "./modules/cancellation/cancellationRouter"
import { positionRouter } from "./modules/position/positionRouter"
import { educationRouter } from "./modules/education/educationRouter"
import { languageRouter } from "./modules/language/languageRouter"
import { adminRouter } from "./modules/admin/adminRouter"
import { notificationRouter } from "./modules/notification/notificationRouter"
import { locationProposalRouter } from "./modules/location_proposal/locationProposalRouter"

// import { aiRouter } from "./modules/ai/aiRouter"


const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
  pingInterval: 10000,
  pingTimeout: 20000,
})

setupSocket(io)

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
app.use("/v1/match" , matchRouter())
app.use("/v1/find-match" , findMatchRouter())
app.use("/v1/chat" , chatRouter())
app.use("/v1/chat-message" , chatMessageRouter())
app.use("/v1/activity", activityRouter())
app.use("/v1/experience", experienceRouter())
app.use("/v1/cancellation", cancellationRouter())
app.use("/v1/position", positionRouter())
app.use("/v1/education", educationRouter())
app.use("/v1/language", languageRouter())
app.use("/v1/notification", notificationRouter())
app.use("/v1/location-proposal", locationProposalRouter())
app.use("/v1/api/admin", adminRouter())
// app.use("/v1/ai", aiRouter())

// Mapbox token endpoint
app.use("/v1/map", mapRouter());



server.listen(3000, '0.0.0.0', () => {
  console.log('Server is running on port http://localhost:3000');
});