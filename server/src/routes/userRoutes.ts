// src/interfaces/routes/userRoutes.ts
import { Router } from "express";
import { UserController } from "../controllers/userController";
import { UserRepository } from "../repositories/userRepository";
import {UserService} from "../services/userService"

import {authenticateGoogle,googleController,googleCallback} from "../services/googleService"


const router = Router();

// Dependency injection
const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

//Refresh Token-Route to get new access token
router.post("/refresh", userController.refreshToken.bind(userController));

// Otp Routes For SignIn
router.post("/send-otp", userController.sendOtp.bind(userController));
router.post("/verify-otp", userController.verifyOtp.bind(userController));

//Login
router.post("/signin", userController.signIn.bind(userController));

//Logout
router.post("/signout", userController.signOut.bind(userController));

//Google SignIn Route
router.get("/google",authenticateGoogle);
router.get("/google/callback",googleCallback,googleController);

export default router;
