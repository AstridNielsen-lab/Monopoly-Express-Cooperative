import crypto from 'crypto';
import jwt from 'jsonwebtoken';

// Base de dados em memória (compartilhada com register)
let users = [];
let motoboys = [];

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export default function handler(req, res) {
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
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Email e senha são obrigatórios' });
      return;
    }

    const hashedPassword = hashPassword(password);

    // Verificar nas duas tabelas
    let user = users.find(u => u.email === email && u.password_hash === hashedPassword);
    let userType = 'user';

    if (!user) {
      user = motoboys.find(m => m.email === email && m.password_hash === hashedPassword);
      userType = 'motoboy';
    }

    if (!user) {
      res.status(401).json({ error: 'Email ou senha inválidos' });
      return;
    }

    // Se for motoboy, verificar se está aprovado
    if (userType === 'motoboy' && user.status !== 'approved') {
      res.status(401).json({ error: 'Conta aguardando aprovação' });
      return;
    }

    // Gerar token JWT (usar uma chave secreta em produção)
    const JWT_SECRET = process.env.JWT_SECRET || 'monopoly-express-secret';
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        userType 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({
      message: 'Login realizado com sucesso!',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        user_type: userType
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      details: error.message
    });
  }
}

