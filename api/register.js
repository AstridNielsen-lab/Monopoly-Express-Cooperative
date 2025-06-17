import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';

// Base de dados em memória
let users = [];
let motoboys = [];

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export default function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { email, password, name, phone, userType = 'user', cpf, cnh, vehicleType, vehiclePlate } = req.body;

    if (!email || !password || !name || !phone) {
      res.status(400).json({ error: 'Email, senha, nome e telefone são obrigatórios' });
      return;
    }

    const hashedPassword = hashPassword(password);
    const userId = uuidv4();

    if (userType === 'motoboy') {
      if (!cpf || !cnh || !vehicleType || !vehiclePlate) {
        res.status(400).json({ error: 'CPF, CNH, tipo de veículo e placa são obrigatórios para motoboys' });
        return;
      }

      // Verificar se email já existe
      const existingMotoboy = motoboys.find(m => m.email === email);
      if (existingMotoboy) {
        res.status(400).json({ error: 'Email já cadastrado' });
        return;
      }

      // Inserir motoboy
      motoboys.push({
        id: userId,
        email,
        name,
        phone,
        cpf,
        cnh,
        vehicle_type: vehicleType,
        vehicle_plate: vehiclePlate,
        password_hash: hashedPassword,
        status: 'pending',
        created_at: new Date().toISOString()
      });

      res.status(201).json({
        message: 'Motoboy cadastrado com sucesso! Aguarde aprovação.',
        user: {
          id: userId,
          email,
          name,
          phone,
          user_type: 'motoboy'
        }
      });
    } else {
      // Verificar se email já existe
      const existingUser = users.find(u => u.email === email);
      if (existingUser) {
        res.status(400).json({ error: 'Email já cadastrado' });
        return;
      }

      // Inserir usuário
      users.push({
        id: userId,
        email,
        name,
        phone,
        password_hash: hashedPassword,
        user_type: 'user',
        created_at: new Date().toISOString()
      });

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
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      details: error.message
    });
  }
}

