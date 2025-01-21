import { StatusCodes } from "http-status-codes";
import User from "../models/UserModel.js";
import { BadRequestError, NotFoundError, UnauthenticatedError } from "../errors/customErrors.js";
import Notification from "../models/NotificationModel.js";
import { comparePassword, hashPassword } from "../utils/passwordUtils.js";
import { formatImage } from "../middleware/multerMiddleware.js";
import cloudinary from 'cloudinary';


export const getAllUsers=async(req,res)=>{
  const{userId}=req.user
  const users=await User.find({_id:{$ne:userId}})
  res.status(StatusCodes.OK).json({users})

}



export const getCurrentUser = async (req, res) => {

  const currentUser=await User.findById(req.user.userId).select("-password")
  if(!currentUser){
    throw new UnauthenticatedError('User not found!')
   }
 res.status(StatusCodes.OK).json({currentUser})

 
  };

  export const getUserProfile=async(req,res)=>{
   

    const{username}=req.params
    const user=await User.findOne({username}).select("-password")
 
    res.status(StatusCodes.OK).json({user})
  }

  
  export const followUnfollowUser=async(req,res)=>{

    const{id}=req.params
    const{userId}=req.user
    const userToModify=await User.findById(id)
    const currentUser=await User.findById(req.user.userId)
    if(id===req.user.userId){
      throw new BadRequestError('You can not follow your self!!!')
    }
    if(!userToModify || !currentUser){
      throw new BadRequestError('user not found!!!!')
    }

    const isFollowing=currentUser.following.includes(id)
if(isFollowing){
  await User.findByIdAndUpdate(id,{$pull:{followers:req.user.userId}})
await User.findByIdAndUpdate(req.user.userId,{$pull:{following:id}})
const users=await User.find({_id:{$ne:userId}})
const user=await User.findById(req.user.userId)
const modifiedUser=await User.findById(req.user.userId)
res.status(StatusCodes.OK).json({msg:'User followed!',users,user,modifiedUser})
}else{
await User.findByIdAndUpdate(id,{$push:{followers:req.user.userId}})
await User.findByIdAndUpdate(req.user.userId,{$push:{following:id}})
const newNotification = new Notification({
  type: "follow",
  from: req.user.userId,
  to: userToModify._id,
});

await newNotification.save();
const users=await User.find({_id:{$ne:userId}})
const user=await User.findById(req.user.userId)
const modifiedUser=await User.findById(req.user.userId)

res.status(StatusCodes.OK).json({msg:'User followed!',users,user,modifiedUser})
}




    }
  
  export const getSuggestedUsers=async(req,res)=>{
    const{userId}=req.user
    const usersFollowedByMe=await User.findById(userId).select("following")
    const users=await User.find({_id:{$ne:userId}}).limit(10).select("-password")
    const filterdUsers=users.filter((user)=>!usersFollowedByMe.following.includes(user._id))
    const suggestedUsers=filterdUsers.slice(0,4)
    res.status(StatusCodes.OK).json({suggestedUsers})
   
  }


  export const updateUser=async(req,res)=>{

    
  const { fullName, email, username, newPassword,oldPassword, bio, link } = req.body;

    const{userId}=req.user

    let user=await User.findById(userId)
    if(!user){
      throw new NotFoundError(`There is no user with ${userId}`)
    }

    if(newPassword && !oldPassword){

     throw new BadRequestError('please provide the old password')
    }

    if(!newPassword && oldPassword){

      throw new BadRequestError('please provide the new password')
     }

     if(newPassword){
     const validPasswordChange= newPassword && (await comparePassword(req.body.oldPassword, user.password))
     if(!validPasswordChange){
      throw new BadRequestError('passwords do not match')
     }
     const hashedPassword=await hashPassword(newPassword)

     req.body.password=hashedPassword
       
     }
   

    const updatedUser=await User.findByIdAndUpdate(req.user.userId,req.body,{
      new:true
    }).select('-password')
   // user.password = null;
    res.status(StatusCodes.OK).json({updatedUser})


  }

  export const updateUserImages=async(req,res)=>{
    
  
 
    if (req.files?.profileImg?.[0]) {
      const file = formatImage(req.files.profileImg[0]);
      const response = await cloudinary.v2.uploader.upload(file);
      req.body.profileImg = response.secure_url;
      req.body.profileImgPublicId = response.public_id;
    }

    if (req.files?.coverImg?.[0]) {
      const file = formatImage(req.files.coverImg[0]);
      const response = await cloudinary.v2.uploader.upload(file);
      req.body.coverImg = response.secure_url;
      req.body.coverImgPublicId = response.public_id;
    }

    const updatedUser = await User.findOneAndUpdate({ _id: req.user.userId }, req.body, {
      new: true,
    }).select('-password');

    if (req.files?.profileImg?.[0] && user.profileImgPublicId) {
      await cloudinary.v2.uploader.destroy(user.profileImgPublicId);
    }
    if (req.files?.coverImg?.[0] && user.coverImgPublicId) {
      await cloudinary.v2.uploader.destroy(user.coverImgPublicId);
    }

    res.status(StatusCodes.OK).json({ msg: 'User image updated!',updatedUser });
  
  }
  
  