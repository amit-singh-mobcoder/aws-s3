import express, { RequestHandler } from "express";
import { UserController } from "@src/controllers/UserController";
import { UserService } from "@src/services/UserService";
import { upload } from "@src/middlewares/Multer";
import { UserRepository } from "@src/repositories/UserRepository";

const router = express.Router();
const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

router.route("/").post(upload.single("avatar"), userController.createUser as RequestHandler);

export default router;
