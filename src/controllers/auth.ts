import { Request, Response } from 'express';
import AuthService from '../services/auth';

const register = async (req: Request, res: Response) => {
  try {
    const { email, name, password } = req.body;
    const token = await AuthService.register(email, name, password);
    res.status(201).json({ token });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Error registering user' });
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const token = await AuthService.login(email, password);
    if (token) {
      res.json({ token });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Error logging in' });
  }
};

const AuthController = {
  register,
  login,
};

export default AuthController;