import { StatusCodes } from "http-status-codes"
import Notification from "../models/NotificationModel.js"

export const getNotifications=async(req,res)=>{

    const notifications=await Notification.find({to:req.user.userId}).populate({
        path:"from",
        select:"username profileImg"

    })

    await Notification.updateMany({to:req.user.userId},{read:true})
    res.status(StatusCodes.OK).json({notifications})
}

export const deleteNotifications=async(req,res)=>{
    await Notification.deleteMany({to:req.user.userId})
    res.status(StatusCodes.OK).json({msg:'Notifications deleted'})
}