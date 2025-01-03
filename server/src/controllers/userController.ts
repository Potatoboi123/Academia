// src/interfaces/controllers/UserController.ts
import { NextFunction, Request, Response } from "express";
import { UserService } from "../services/userService";
import { AppError } from "../errors/app-error";

export class UserController {
  constructor(private userService: UserService) {}
  //Otp Verifcation
  async sendOtp(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { name, email, password } = req.body;

    try {
      const user = await this.userService.sendOtp({ name, email, password });
      res.status(201).json({ message: "OTP send successfully" });
    } catch (error) {
      next(error);
    }
  }
  async verifyOtp(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { otp, email } = req.body;

    try {
      const user = await this.userService.verifyOtp(otp, email);
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  }
  //refreshToken
  async refreshToken(req: Request, res: Response, next: NextFunction): Promise<any>{
    try {
      const refreshToken = req.cookies.refreshToken;
      if(!refreshToken)
        throw new AppError('No Token',401)

      const token = await this.userService.refreshToken(refreshToken);
      if(!token){
        return res.status(406).json({ message: 'Unauthorized' })
      }
      
      res.status(201).json({accessToken:token});
    } catch (error) {
      next(error);
    }
  }
  //Login
  async signIn(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { email, password } = req.body;

    try {
      const { accessToken, refreshToken,name,role,id } = await this.userService.signIn(
        email,
        password
      );
      
      res.cookie("refreshToken", refreshToken, {
        httpOnly:  true,
        sameSite: 'strict',
        secure: true,
        maxAge: 24 * 60 * 60 * 1000,
      });
      res.status(201).json({ accessToken,name,role,id });
      
    } catch (error) {
      next(error);
    }
  }
  async signOut(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const refreshToken=req.cookies.refreshToken

    try {
      const user = await this.userService.signOut(refreshToken);
      res.status(201).json({message:'Success'});
    } catch (error) {
      next(error);
    }
  }
}
