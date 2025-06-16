import { VercelRequest, VercelResponse } from '@vercel/node';
import { getDatabase } from '../database';
import crypto from 'crypto';

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { email, password, userType } = req.body;

    if (!email || !password || !userType) {
      res.status(400).json({ error: 'Email, password e userType são obrigatórios' });
      return;
    }

    const db = getDatabase();
    const hashedPassword = hashPassword(password);

    let user;
    if (userType === 'motoboy') {
      const stmt = db.prepare('SELECT * FROM motoboys WHERE email = ? AND password_hash = ?');
      user = stmt.get(email, hashedPassword);
    } else {
      const stmt = db.prepare('SELECT * FROM users WHERE email = ? AND password_hash = ?');
      user = stmt.get(email, hashedPassword);
    }

    if (!user) {
      res.status(401).json({ error: 'Email ou senha inválidos' });
      return;
    }

    // Remover senha do retorno
    const { password_hash, ...userWithoutPassword } = user as any;

    res.status(200).json({
      message: 'Login realizado com sucesso',
      user: {
        ...userWithoutPassword,
        user_type: userType
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

