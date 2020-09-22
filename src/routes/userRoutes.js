import express from 'express';
import userController from '../controllers/userController';

const router = express();

router.post('/signup', userController.signupConroller);

export default router;
