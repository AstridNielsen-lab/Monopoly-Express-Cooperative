// API simples de registro de motoboy para Vercel
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
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const {
    email,
    password,
    name,
    phone
  } = req.body;

  // Validações básicas - apenas o essencial
  if (!email || !password || !name || !phone) {
    return res.status(400).json({
      error: 'Email, senha, nome e telefone são obrigatórios'
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      error: 'Senha deve ter pelo menos 6 caracteres'
    });
  }

  // Simulação de criação de usuário (sem banco real)
  const motoboyId = `motoboy_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  // Simular sucesso do registro
  res.status(201).json({
    message: 'Motoboy cadastrado com sucesso! Você já pode fazer login.',
    motoboyId,
    user: {
      id: motoboyId,
      email,
      name,
      phone,
      cpf: '000.000.000-00', // Valor padrão
      cnh: '12345678901', // Valor padrão
      vehicle_type: 'moto', // Valor padrão
      vehicle_plate: 'ABC-1234', // Valor padrão
      user_type: 'motoboy',
      email_verified: true, // Simplificado - já aprovado
      is_approved: true,    // Simplificado - já aprovado
      created_at: new Date().toISOString()
    }
  });
}

