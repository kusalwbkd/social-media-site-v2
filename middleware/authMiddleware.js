import { UnauthenticatedError } from "../errors/customErrors.js";
import Post from "../models/PostModel.js";
import { verifyJWT } from "../utils/tokenUtils.js";

export const authenticateUser = (req, res, next) => {
  
   const { token } = req.cookies;
   if (!token) throw new UnauthenticatedError('authentication invalid');
 
   try {
     const { userId} = verifyJWT(token);
     req.user = { userId};
     next();
   } catch (error) {
     throw new UnauthenticatedError('authentication invalid');
   }
  
  };

export const authorizePermissions=async(req,res,next)=>{
  const post=await Post.findById(req.params.id)
   const isPostOwner=post.user.toString()===req.user.userId
      if(!isPostOwner){
       throw new UnauthenticatedError('you are not allowed to do this action')
      } 
      next()
  
}