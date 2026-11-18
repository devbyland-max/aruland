import jwt, { type SignOptions } from "jsonwebtoken";
import { Role } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { env, isProd } from "../config/env.js";
import { AppError } from "./error.js";
import { prisma } from "../lib/prisma.js";

export type AuthUser = {
  id: string;
  email: string;
  role: Role;
  name: string;
};

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

type JwtPayload = {
  sub: string;
  email: string;
  role: Role;
};

export function signToken(user: AuthUser) {
  return jwt.sign(
    { sub: user.id, email: user.email, role: user.role },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN } as SignOptions
  );
}

/** Cross-site cookies when frontend (Netlify) and API are on different domains. */
const cookieOpts = {
  httpOnly: true,
  secure: isProd,
  sameSite: (isProd ? "none" : "lax") as "none" | "lax",
  path: "/",
};

export function setAuthCookie(res: Response, token: string) {
  res.cookie("token", token, {
    ...cookieOpts,
    maxAge: 8 * 60 * 60 * 1000,
  });
}

export function clearAuthCookie(res: Response) {
  res.clearCookie("token", cookieOpts);
}

async function attachUser(req: Request) {
  const token = req.cookies?.token as string | undefined;
  if (!token) return null;

  const payload = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
  const user = await prisma.user.findUnique({ where: { id: payload.sub } });
  if (!user) return null;

  return {
    id: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
  } satisfies AuthUser;
}

export async function requireAuth(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  try {
    const user = await attachUser(req);
    if (!user) throw new AppError("Authentication required", 401);
    req.user = user;
    next();
  } catch (err) {
    if (err instanceof AppError) return next(err);
    next(new AppError("Authentication required", 401));
  }
}

export async function optionalAuth(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  try {
    const user = await attachUser(req);
    if (user) req.user = user;
  } catch {
    // ignore invalid token
  }
  next();
}

export function requireAdmin(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  if (!req.user || req.user.role !== "ADMIN") {
    return next(new AppError("Admin access required", 403));
  }
  next();
}
