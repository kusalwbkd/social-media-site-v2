import { Router } from "express";
import { login, logout, signup } from "../controllers/authController.js";
import { validateLoginInput, validateRegisterInput } from "../middleware/validationMiddleware.js";

const router=Router()

router.post("/signup",validateRegisterInput, signup)
router.post("/login",validateLoginInput, login)
router.get("/logout",logout)
export default router