import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';


export interface AuthRequest extends Request {
  userId?: string;
  clientsIds?: string[]
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string, clientIds: string[] };
    req.userId = decoded.userId;
    req.clientsIds = decoded.clientIds
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};