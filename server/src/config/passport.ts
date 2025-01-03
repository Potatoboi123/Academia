import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import jwt from "jsonwebtoken";
import { UserRepository } from "../repositories/userRepository";
import passport from "passport";

const userRepository = new UserRepository();
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: `/api/users/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log(profile);

        const { id, displayName, emails } = profile;
        const email = emails![0].value;

        let user = await userRepository.findByEmail(email);

        if (!user) {
          user = await userRepository.createUser({
            googleId: id,
            name: displayName,
            email,
          });
        }

        const token = jwt.sign(
          { userId: user.id, email: user.email },
          process.env.JWT_SECRET!,
          { expiresIn: "1h" }
        );

        // Send the user data and JWT token
        done(null, { user, token });
      } catch (error) {
        done(error, false);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user: { user: object; token: string }, done) =>
  done(null, user)
);