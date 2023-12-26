import express from 'express';
import authController from '../controllers/authController';
import verifyToken from '../utils/authMiddleware';
import updateEmail from '../controllers/updateEmail';
import searchController from '../controllers/searchController';
import spamController from '../controllers/spamController';
import userController from '../controllers/userController';

const router=express.Router();

router.post('/register',authController.register);
router.get('/login',authController.login);
router.put('/email',verifyToken,updateEmail);
router.get('/search',verifyToken,searchController);
router.post('/spam',verifyToken,spamController);
router.get('/user',verifyToken,userController);

export default router;