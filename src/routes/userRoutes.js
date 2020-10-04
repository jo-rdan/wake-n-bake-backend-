import express from "express";
import userController from "../controllers/userController";

const router = express();

router.post("/signup", userController.signupConroller);
router.post("/signin/", userController.signInController);
router.get("/email/verify/:token", userController.verifyUserEmailController);
router.post("/sms/verify", userController.verifyUserPhoneController);

export default router;
