// API simples de login de motoboy para Vercel
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

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error: 'Email e senha são obrigatórios'
    });
  }

  // Simulação de login (sem banco real)
  // Para demonstração, aceitar qualquer email/senha válidos
  if (password.length < 6) {
    return res.status(401).json({
      error: 'Senha deve ter pelo menos 6 caracteres'
    });
  }

  // Gerar dados de usuário simulado baseado no email
  const motoboyId = `motoboy_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const name = email.split('@')[0].replace(/[^a-zA-Z]/g, '') || 'Motoboy';
  
  // Determinar tipo de veículo baseado no email (para demonstração)
  let vehicleType = 'moto';
  let cnh = '12345678901';
  let vehiclePlate = 'ABC-1234';
  
  if (email.includes('bicicleta') || email.includes('bike')) {
    vehicleType = 'bicicleta';
    cnh = null;
    vehiclePlate = null;
  } else if (email.includes('carro')) {
    vehicleType = 'carro';
    vehiclePlate = 'XYZ-5678';
  }

  res.status(200).json({
    message: 'Login realizado com sucesso',
    user: {
      id: motoboyId,
      email,
      name: name.charAt(0).toUpperCase() + name.slice(1),
      phone: '(11) 99999-9999',
      cpf: '123.456.789-00',
      cnh,
      vehicle_type: vehicleType,
      vehicle_plate: vehiclePlate,
      user_type: 'motoboy',
      email_verified: true,
      is_approved: true,
      is_active: true,
      rating: 4.8,
      total_deliveries: 0,
      created_at: new Date().toISOString()
    }
  });
}

