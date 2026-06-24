import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import type { IStore } from "./store.interface.js";

const fallbackSecret = "development-only-finsphere-secret";

export function signToken(userId: string) {
  return jwt.sign({ sub: userId }, process.env.JWT_SECRET ?? fallbackSecret, { expiresIn: "7d" });
}

export function authMiddleware(store: IStore) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers.authorization;
    const token = header?.startsWith("Bearer ") ? header.slice(7) : undefined;
    if (!token) {
      res.status(401).json({ message: "Missing bearer token" });
      return;
    }
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET ?? fallbackSecret);
      const userId = typeof payload === "object" && "sub" in payload ? String(payload.sub) : "";
      const user = await store.getUserById(userId);
      if (!user) {
        res.status(401).json({ message: "Invalid token" });
        return;
      }
      res.locals.user = user;
      next();
    } catch {
      res.status(401).json({ message: "Invalid token" });
    }
  };
}

