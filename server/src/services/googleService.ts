import passport from "passport";
import { Response, Request } from "express";
import { IUser } from "../interface/userInterface";

export const authenticateGoogle = passport.authenticate("google", {
  scope: ["profile", "email"],
});

export const googleCallback = passport.authenticate("google", {
  session: false,
  failureRedirect: `${process.env.CLIENT_URL}/login`,
});

export const googleController = (req: Request, res: Response):any => {
    if (!req.user) {
      return res.status(400).json({ error: "Authentication failed" });
    }
  const { user, token } = req.user as { user: IUser; token: string };
  return res.status(200).json({ user, token });
};
