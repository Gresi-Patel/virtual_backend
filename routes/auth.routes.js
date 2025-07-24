import express from 'express';
import { login, logOut, signUp } from '../controllers/auth.controllers.js';

const authRouter = express.Router();

authRouter.post("/signin", login);
authRouter.post("/logout", logOut);
authRouter.post("/signup", signUp);

export default authRouter;