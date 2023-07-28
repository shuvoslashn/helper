import express from 'express';
import {
    loginController,
    registerController,
    testController,
} from '../controllers/authController.js';
import { isAdmin, requireSignIn } from '../middlewares/authMiddleware.js';

// router object
const router = express.Router();

//? Register route || Method: POST
router.post('/register', registerController);

//? Login route || Method: POST
router.post('/login', loginController);

//? test route || Method: GET
router.get('/test', requireSignIn, isAdmin, testController);

export default router;
