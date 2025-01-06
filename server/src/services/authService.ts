// src/services/AuthService.ts
import { UserRepository } from "../repositories/userRepository";
//services

import { transporter } from "../util/emailClient";
import { redis } from "../config/redisClient";

//errors
import { RequestValidationError } from "../errors/request-validaion-error";
import { ExistingUserError } from "../errors/existing-user-error";
import { AppError } from "../errors/app-error";

//externl dependencies
import bcrypt from "bcryptjs";
import { authenticator } from "otplib";
import validator from "validator";
import jwt from "jsonwebtoken";

export class AuthService {
  constructor(private userRepository: UserRepository) {}

  async refreshToken(
    token: string
  ): Promise<{
    accessToken: string;
    id: string;
    role: string;
    name: string;
    refreshToken: string;
  } | null> {
    try {
      const payload = jwt.verify(
        token,
        process.env.JWT_REFRESH_TOKEN_SECRET!
      ) as any;

      if (!payload) {
        return null;
      }
      const user = await this.userRepository.findById(payload.id);
      if (!user) {
        return null;
      }

      const accessToken = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_ACCESS_TOKEN_SECRET!,
        { expiresIn: "15m" }
      );
      // Creating refresh token everytime /refresh endpoint hits (Refresh token rotation)
      const refreshToken = jwt.sign(
        { id: user.id },
        process.env.JWT_REFRESH_TOKEN_SECRET!,
        { expiresIn: "1d" }
      );

      //storing the refresh token in redis
      await redis.set(
        `refreshToken:${user.id}`,
        refreshToken,
        "EX",
        60 * 60 * 24
      );

      return {
        accessToken,
        id: user.id,
        role: user.role,
        name: user.name,
        refreshToken,
      };
    } catch (error) {
      return null;
    }
  }
  async sendOtp(input: { name: string; email: string; password: string }) {
    const { name, email, password } = input;

    if (!name || !email || !password) {
      throw new RequestValidationError([
        { message: "All fields are required." },
      ]);
    }

    if (!validator.isEmail(email)) {
      throw new RequestValidationError([
        { message: "Invalid email format.", field: "email" },
      ]);
    }

    if (!validator.isLength(password, { min: 6 })) {
      throw new RequestValidationError([
        {
          message: "Password must be at least 6 characters long.",
          field: "password",
        },
      ]);
    }

    const existingUser = await this.userRepository.findByEmail(email);

    if (existingUser) {
      throw new ExistingUserError();
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let secret = authenticator.generateSecret();
    let token = authenticator.generate(secret);

    const tempUser = { name, email, password: hashedPassword, otp: token };
    console.log("The otp is ", token);
    // sending email

    /* let mailOptions = {
        from: `${process.env.DOMAIN_NAME}`,
        to: email,
        subject: "Verification Code",
        text: `Your Verification Code is ${token}`,
        html: `<b>Your Verification Code is ${token}</b>`,
      };
  
      try {
        // Send email using transporter
        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully.");
      } catch (error) {
        throw new AppError("Failed to send email.", 500, [
          { message: "Unable to send verification email. Please try again later." },
        ]);
      } */
    await redis.setex(`tempUser:${email}`, 300, JSON.stringify(tempUser));
  }

  async verifyOtp(otp: string, email: string) {
    const data = await redis.get(`tempUser:${email}`);
    if (!data) {
      throw new Error();
    }
    const tempUser = await JSON.parse(data);
    if (tempUser.otp !== otp) {
      throw new AppError("Incorrect OTP", 401);
    }
    const { otp: _, ...userData } = tempUser;

    const user = await this.userRepository.createUser(userData);
    await redis.del(`tempUser:${email}`);

    return { message: "User Created Successfully" };
  }

  async signIn(email: string, password: string) {
    const user = await this.userRepository.findByEmail(email);

    if (!user) throw new AppError("Invalid Email or password", 401);

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) throw new AppError("Invalid Email or password", 401);

    const accessToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_ACCESS_TOKEN_SECRET!,
      { expiresIn: "15m" }
    );
    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_REFRESH_TOKEN_SECRET!,
      { expiresIn: "1d" }
    );

    //storing the refresh token in redis
    await redis.set(
      `refreshToken:${user.id}`,
      refreshToken,
      "EX",
      60 * 60 * 24
    );

    const { name, role, id } = user;
    return { accessToken, refreshToken, name, role, id };
  }

  async signOut(refreshToken: string) {
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_TOKEN_SECRET!
    ) as { id: string };
    if (!decoded || !decoded.id) {
      throw new Error("Invalid token: user ID not found");
    }
    await redis.del(`refreshToken:${decoded.id}`);
    return true;
  }
}
