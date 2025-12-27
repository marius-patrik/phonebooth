import type express from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config.js';

export function authenticateJWT(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  jwt.verify(token, config.jwtSecret, (err: jwt.VerifyErrors | null) => {
    if (err) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  });
}
