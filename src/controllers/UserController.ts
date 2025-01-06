import { IUserService } from "@src/services/UserService";
import { Request, Response } from "express";

export interface IUserController {
  createUser(req: Request, res: Response): any;
}

export class UserController implements IUserController {
  private userService: IUserService;

  constructor(userService: IUserService) {
    this.userService = userService;
  }

  createUser = async (req: Request, res: Response) => {
    try {
      const { name, email } = req.body;
      const file = req.file;
      if (typeof file === "undefined") throw new Error("Avatar is missing.");

      const user = await this.userService.createUser({ name, email, avatar: file.filename, file });
      res.status(201).json({
        success: true,
        message: "User created successfully.",
        user,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).json({
          success: false,
          message: error.message || "Internal server error",
          error,
        });
      }
    }
  };
}
