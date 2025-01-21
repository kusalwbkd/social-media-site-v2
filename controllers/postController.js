import { StatusCodes } from "http-status-codes"
import { NotFoundError, UnauthorizedError } from "../errors/customErrors.js"
import Post from "../models/PostModel.js"
import User from "../models/UserModel.js"
import Notification from "../models/NotificationModel.js"
import { formatImage } from "../middleware/multerMiddleware.js"
import cloudinary from 'cloudinary';


//post controllers
export const getAllPosts=async(req,res)=>{
   const posts=await Post.find({}).sort({createdAt:-1}).populate({
    path:"user",
    select:"-password"
   }).populate({
    path:"comments.user",
    select:"-password"
   })
   res.status(StatusCodes.OK).json({posts})
}


export const getSinglePost=async(req,res)=>{
    const post=await Post.findById(req.params.id).populate({
        path:"user",
        select:"-password"
       }).populate({
        path:"comments.user",
        select:"-password"
       }) 
    res.status(StatusCodes.OK).json({post})
}

export const getUserPosts=async(req,res)=>{
  const user=await User.findOne({username:req.params.username})
  
  const posts=await Post.find({user:user._id}).sort({createdAt:-1}).populate({
    path:"user",
    select:"-password"
}).populate({
    path:"comments.user",
    select:"-password"
})
  res.status(StatusCodes.OK).json({posts})
}

export const createPost=async(req,res)=>{
    

    const {userId}=req.user 

   const user=await User.findById(userId)
   if(!user){
    throw new NotFoundError(`There is no user with ${userId}`)
    }
  
   if(req.file){
    const file = formatImage(req.file);
    const response = await cloudinary.v2.uploader.upload(file);
    req.body.img = response.secure_url;
    req.body.imgPublicId = response.public_id;
   }
 
  
  
   req.body.user=userId;
   let post=await Post.create(req.body)
   post = await post.populate('user', 'username fullName email profileImg');
   res.status(StatusCodes.CREATED).json({post})

  
}

export const deletePost=async(req,res)=>{
    await Post.findByIdAndDelete(req.params.id);
    const remaningPosts=await Post.find({}).sort({updatedAt:-1}).populate({
        path:"user",
        select:"-password"
       }).populate({
        path:"comments.user",
        select:"-password"
       })
    res.status(StatusCodes.OK).json({msg:'Post deleted!',remaningPosts})
 }
 
 export const updatePost=async(req,res)=>{
    if(req.file){
        const file = formatImage(req.file);
        const response = await cloudinary.v2.uploader.upload(file);
        req.body.img = response.secure_url;
        req.body.imgPublicId = response.public_id;
       }
   const updatedPost=await Post.findByIdAndUpdate(req.params.id,req.body,{
    new:true
   }).populate({
    path:"user",
    select:"-password"
   }).populate({
    path:"comments.user",
    select:"-password"
   })
   const remaningPosts=await Post.find({}).sort({updatedAt:-1}).populate({
    path:"user",
    select:"-password"
   }).populate({
    path:"comments.user",
    select:"-password"
   })

   if (req.file && updatedPost.imagePublicId) {
    await cloudinary.v2.uploader.destroy(product.imagePublicId);
  }

   res.status(StatusCodes.OK).json({msg:'Post has been updated!',remaningPosts,updatedPost})
 }

//end of post controllers



//comment controllers
export const commentOnPost=async(req,res)=>{

const comment={user:req.user.userId,text:req.body.text}

let post=await Post.findByIdAndUpdate(req.params.id,{$push:{comments:comment}})
const notification=await Notification.create({
    type: "comment",
    from: req.user.userId,
    to: post.user,
   })
   const remaningPosts=await Post.find({}).sort({updatedAt:-1}).populate({
    path:"user",
    select:"-password"
   }).populate({
    path:"comments.user",
    select:"-password"
   })
res.status(StatusCodes.OK).json({msg:'you commented!',remaningPosts})

   
}

export const deleteComment=async(req,res)=>{
/* const{id,commentId}=req.params
const post=await Post.findById(id)

const postOwner=req.user.userId === post.user.toString()

const comment=post.comments.find((cmnt)=>{
return cmnt._id.toString()===commentId
})

 if(!comment){
throw new NotFoundError(`There is no comment with ${commentId}`)
} 
const CommentOwner=comment?.user?.toString() === req.user.userId

if(!postOwner && !CommentOwner){
    throw new UnauthorizedError('you can not delete this comment')
}

post.comments.pop(comment)
post.save()
    res.status(StatusCodes.OK).json({msg:'comment deleted!',post}) */
    const{id,commentId}=req.params  
    
    const result = await Post.updateOne(
        { _id: id },
        { $pull: { comments: { _id: commentId } } }
    );
    res.status(StatusCodes.OK).json({msg:'comment deleted!'})
}

export const updateComment=async(req,res)=>{
    const{id,commentId}=req.params
const post=await Post.findById(id)



const comment=post.comments.find((cmnt)=>{
return cmnt._id.toString()===commentId
})

 if(!comment){
throw new NotFoundError(`There is no comment with ${commentId}`)
} 
const CommentOwner=comment?.user?.toString() === req.user.userId

if(!CommentOwner){
    throw new UnauthorizedError('you can not update this comment')
}

comment.text=req.body.text

post.save()
    res.status(StatusCodes.OK).json({msg:'comment updated!',post})
}

//end of comment controllers




//like-follow controllers
export const getFollowingPosts=async(req,res)=>{
    const user=await User.findById(req.user.userId)

    const following=user.following;

    const feedPosts=await Post.find({user:{$in:following}}).sort({createdAt:-1}).populate({
        path:"user",
        select:"-password"
    }).populate({
        path:"comments.user",
        select:"-password"
    })

    res.status(StatusCodes.OK).json({feedPosts})
    
}

export const getLikedPosts=async(req,res)=>{
  
const user=await User.findOne({username:req.params.username})
   const likedPosts=await Post.find({_id:{$in:user.likedPosts}}).populate({
    path:"user",
    select:"-password"
   }).populate({
    path:"comments.user",
    select:"-password"
   })
   res.status(StatusCodes.OK).json({likedPosts})
}

export const likeUnlikePost=async(req,res)=>{
    const{id:postId}=req.params

    let post=await Post.findById(postId)
    let user=await User.findById(req.user.userId)
    const userLikedPost=post.likes.includes(req.user.userId)
    if(userLikedPost){
        await Post.updateOne({_id:postId},{$pull:{likes:req.user.userId}})
        await User.updateOne({_id:req.user.userId},{$pull:{likedPosts:postId}})
       
        user=await User.findById(req.user.userId)
        const remaningPosts=await Post.find({}).sort({updatedAt:-1}).populate({
            path:"user",
            select:"-password"
           }).populate({
            path:"comments.user",
            select:"-password"
           })
        res.status(StatusCodes.OK).json({msg:'unliked post',remaningPosts,user})
    }
    else{
       await Post.updateOne({_id:postId},{$push:{likes:req.user.userId}})
       await User.updateOne({_id:req.user.userId},{$push:{likedPosts:postId}})
       user=await User.findById(req.user.userId)
       await post.save()
       const remaningPosts=await Post.find({}).sort({updatedAt:-1}).populate({
        path:"user",
        select:"-password"
       }).populate({
        path:"comments.user",
        select:"-password"
       })
   

       const notification=await Notification.create({
        type: "like",
        from: req.user.userId,
        to: post.user,
       })

       res.status(StatusCodes.OK).json({msg:'unliked post',remaningPosts,user})
    }
  


}


