import { Router } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma.js";
import { env } from "../config/env.js";
import { AppError } from "../middleware/error.js";
import {
  clearAuthCookie,
  optionalAuth,
  setAuthCookie,
  signToken,
} from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { loginSchema, registerSchema } from "../validators/auth.js";

const router = Router();

function publicUser(user: {
  id: string;
  name: string;
  email: string;
  role: "CUSTOMER" | "ADMIN";
  createdAt: Date;
}) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  };
}

router.post("/register", validate(registerSchema), async (req, res, next) => {
  try {
    const { name, email, password } = req.body as {
      name: string;
      email: string;
      password: string;
    };

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) throw new AppError("Email already registered", 409);

    const passwordHash = await bcrypt.hash(password, env.BCRYPT_ROUNDS);
    const user = await prisma.user.create({
      data: { name, email, passwordHash, role: "CUSTOMER" },
    });

    const token = signToken({
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });
    setAuthCookie(res, token);
    res.status(201).json({ user: publicUser(user) });
  } catch (err) {
    next(err);
  }
});

router.post("/login", validate(loginSchema), async (req, res, next) => {
  try {
    const { email, password } = req.body as {
      email: string;
      password: string;
    };

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new AppError("Invalid email or password", 401);

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new AppError("Invalid email or password", 401);

    const token = signToken({
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });
    setAuthCookie(res, token);
    res.json({ user: publicUser(user) });
  } catch (err) {
    next(err);
  }
});

router.post("/logout", (_req, res) => {
  clearAuthCookie(res);
  res.json({ message: "Logged out" });
});

router.get("/me", optionalAuth, async (req, res, next) => {
  try {
    if (!req.user) {
      res.json({ user: null });
      return;
    }
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    res.json({ user: user ? publicUser(user) : null });
  } catch (err) {
    next(err);
  }
});

export default router;
