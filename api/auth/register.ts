import { VercelRequest, VercelResponse } from '@vercel/node';
import { getDatabase } from '../database';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';

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
    // Extrair tipo de usuário da URL (user ou motoboy)
    const { q } = req.query;
    const userType = Array.isArray(q) ? q[0] : q || 'user';
    
    const { email, password, name, phone, cpf, cnh, vehicleType, vehiclePlate } = req.body;

    if (!email || !password || !name || !phone) {
      res.status(400).json({ error: 'Email, senha, nome e telefone são obrigatórios' });
      return;
    }

    const db = getDatabase();
    const hashedPassword = hashPassword(password);
    const userId = uuidv4();

    if (userType === 'motoboy') {
      if (!cpf || !cnh || !vehicleType || !vehiclePlate) {
        res.status(400).json({ error: 'CPF, CNH, tipo de veículo e placa são obrigatórios para motoboys' });
        return;
      }

      // Verificar se email já existe
      const existingMotoboy = db.prepare('SELECT id FROM motoboys WHERE email = ?').get(email);
      if (existingMotoboy) {
        res.status(400).json({ error: 'Email já cadastrado' });
        return;
      }

      // Inserir motoboy
      const stmt = db.prepare(`
        INSERT INTO motoboys (id, email, name, phone, cpf, cnh, vehicle_type, vehicle_plate, password_hash)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      
      stmt.run(userId, email, name, phone, cpf, cnh, vehicleType, vehiclePlate, hashedPassword);

      res.status(201).json({
        message: 'Motoboy cadastrado com sucesso! Aguarde aprovação.',
        motoboy: {
          id: userId,
          email,
          name,
          phone,
          user_type: 'motoboy'
        }
      });
    } else {
      // Verificar se email já existe
      const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
      if (existingUser) {
        res.status(400).json({ error: 'Email já cadastrado' });
        return;
      }

      // Inserir usuário
      const stmt = db.prepare(`
        INSERT INTO users (id, email, name, phone, password_hash)
        VALUES (?, ?, ?, ?, ?)
      `);
      
      stmt.run(userId, email, name, phone, hashedPassword);

      res.status(201).json({
        message: 'Usuário cadastrado com sucesso!',
        user: {
          id: userId,
          email,
          name,
          phone,
          user_type: 'user'
        }
      });
    }
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

