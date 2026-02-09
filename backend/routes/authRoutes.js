import express from "express"
import { signOut, signUp } from "../controllers/authController.js";
import { signIn } from "../controllers/authController.js";

const router = express.Router();


router.post('/signup', signUp)

router.post('/signin',signIn)

router.post('/signout',signOut)

export default router;