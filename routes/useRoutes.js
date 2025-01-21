import { Router } from "express";
import { followUnfollowUser, getAllUsers, getCurrentUser, getSuggestedUsers, getUserProfile, updateUser, updateUserImages } from "../controllers/userController.js";
import { validatUserNameParams, validateUpdateInput } from "../middleware/validationMiddleware.js";
import upload from "../middleware/multerMiddleware.js";

const router=Router()

router.get('/',getAllUsers)
router.get('/getme',getCurrentUser)
router.get("/suggested", getSuggestedUsers);
router.patch('/update', validateUpdateInput, updateUser)
router.patch('/updateImages', upload.fields([{ name: 'coverImg'}, { name: 'profileImg' }]), updateUserImages)

router.get('/profile/:username',validatUserNameParams, getUserProfile)
router.post('/follow/:id',followUnfollowUser)


export default router