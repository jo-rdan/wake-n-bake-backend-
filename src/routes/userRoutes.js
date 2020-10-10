import express from "express";
import userController from "../controllers/userController";
import userMiddleware from "../middleware/validateToken";

const router = express();

router.post("/signup", userController.signupConroller);
router.post("/signin/", userController.signInController);
router.get("/email/verify/:token", userController.verifyUserEmailController);
router.post("/sms/verify", userController.verifyUserPhoneController);
router.patch(
  "/:userId/profile/edit",
  userMiddleware.validateUserTokenMiddleware,
  userController.editUserProfileController
);
router.get(
  "/:userId",
  userMiddleware.validateUserTokenMiddleware,
  userController.getSingleUserController
);
router.get(
  "/",
  userMiddleware.validateUserTokenMiddleware,
  userController.getAllUsers
);

export default router;
