import { randomUUID } from "crypto";
import { NextFunction, Request, Response } from "express";
import { isProd } from "../config/env.js";

const COOKIE = "sb_session";

declare global {
  namespace Express {
    interface Request {
      sessionId?: string;
    }
  }
}

export function ensureSession(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let sessionId = req.cookies?.[COOKIE] as string | undefined;
  if (!sessionId) {
    sessionId = randomUUID();
    res.cookie(COOKIE, sessionId, {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000,
      path: "/",
    });
  }
  req.sessionId = sessionId;
  next();
}

export function cartOwnerWhere(req: Request) {
  if (req.user?.id) return { userId: req.user.id };
  return { sessionId: req.sessionId! };
}
