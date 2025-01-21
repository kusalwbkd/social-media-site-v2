import { Router } from "express";
import { commentOnPost, createPost, deleteComment, deletePost, getAllPosts, getFollowingPosts, getLikedPosts, getSinglePost, getUserPosts, likeUnlikePost,updateComment,updatePost } from "../controllers/postController.js";
import { validateCommentInput, validatePostParams, validatePostInput, validatUserParams, validatUserNameParams } from "../middleware/validationMiddleware.js";
import { authorizePermissions } from "../middleware/authMiddleware.js";
import upload from "../middleware/multerMiddleware.js";

const router=Router()





//post
router.get("/all", getAllPosts);
router.get("/following", getFollowingPosts);

router.post("/create",upload.single('img'), createPost);
router.get("/user/:username",validatUserNameParams,getUserPosts)
router.get("/:id", getSinglePost);
router.patch("/:id", validatePostParams,authorizePermissions, upload.single('img'),  updatePost);
router.delete("/:id",validatePostParams,authorizePermissions , deletePost);

//comments
router.post("/comment/:id",validatePostParams, commentOnPost);
router.patch("/:id/comments/:commentId", updateComment);
router.delete("/:id/comments/:commentId", deleteComment);

//likes and folllowing

router.get("/likes/:username",  getLikedPosts);


router.post("/like/:id",validatePostParams, likeUnlikePost);
export default router

///comment/:id