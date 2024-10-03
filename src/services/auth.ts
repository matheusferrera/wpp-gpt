import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const TOKEN_EXPIRATION = process.env.TOKEN_EXPIRATION || '1h'; // Default to 1 hour if not specified

interface JwtPayload {
    sub: string;
    createTime: number;
    exp: number;
    clientIds: string[];
  }
  
  const generateToken = (userId: number, clientIds: string[]): string => {
    const payload: JwtPayload = {
      sub: userId.toString(),
      createTime: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24), // 24 hours
      clientIds
    };
  
    return jwt.sign(payload, JWT_SECRET, { algorithm: 'HS256' });
  };

const register = async (email: string, name: string, password: string): Promise<string> => {
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
    },
  });

  return generateToken(user.id, []);
};

const login = async (email: string, password: string): Promise<string | null> => {
    console.log("EMAIL -> ", email)
  const user = await prisma.user.findUnique({
    where: { email: email }
  });

  console.log("user -> ", user)

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return null;
  }

  return generateToken(user.id, user.clientsIds);
};

const AuthService = {
  register,
  login,
};

export default AuthService;