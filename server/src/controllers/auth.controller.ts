// src/controllers/auth.controller.ts
import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { HttpError } from "../middleware/error.middleware";
import { prisma } from "../lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET!;

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new HttpError(401, ["Invalid credentials"]);
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      throw new HttpError(401, ["Invalid credentials"]);
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ token, email });
  } catch (err) {
    next(err);
  }
};
