import { Router } from "express";
import { deleteNotifications, getNotifications } from "../controllers/notificationController.js";

const router=Router()


router.route('/').get(getNotifications).delete(deleteNotifications)

export default router