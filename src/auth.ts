import { Request, Response, NextFunction } from "express";
import config from "./config";
import jwt from "jsonwebtoken";
import { User } from "./Types";
export let refreshTokens = new Map();

/**
 * 
 * generates temp access tokens
 * 
 * @param user :  {
    name: string;
    email: string;
    userID: string;
}
 * @returns jwt access token
 */

export const generateAuthToken = async (user: User): Promise<string> => {
  return jwt.sign(user, config.ACCESS_TOKEN_SECRET, { expiresIn: "1m" });
};

/**
 *
 * @param req : Express.Request
 * @param res : Express.Response
 * @param next : Express.NextFunction
 * @returns : HTTP Status Code : 401 : Unauthorized if not logged in, else moves on next()
 */

export const isLoggedIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, config.ACCESS_TOKEN_SECRET, (err, user: User) => {
    if (err) {
      return res
        .status(403)
        .json({ message: "token has expired, generate a new token" });
    }
    req.user = user;
    next();
  });
};

/**
 * 
 * @param user :  {
    name: string;
    email ?: string;
    userID: string;
}
 * @returns : {accessToken : string, refreshToken : string}
 */

export const generateTokens = async (
  user: User
): Promise<{ accessToken: string; refreshToken: string }> => {
  const accessToken = await generateAuthToken(user);
  const refreshToken = await jwt.sign(user, config.REFRESH_TOKEN_SECRET);
  refreshTokens.set(refreshToken, refreshToken);
  return { accessToken: accessToken, refreshToken: refreshToken };
};
