import express from "express"
import { protectRoute } from "../middlewares/protectRoute.middleware.js"
import { getUserForSideBar,getMessages ,sendMessage,reactToMessage} from "../controllers/message.controller.js"

const router=express.Router()

router.get('/user',protectRoute,getUserForSideBar)
router.get('/:id',protectRoute,getMessages)
router.post("/send/:id", protectRoute, sendMessage);
router.put("/react/:messageId", protectRoute, reactToMessage);
export default router
