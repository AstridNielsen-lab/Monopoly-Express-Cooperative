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
    phone,
    cpf,
    cnh,
    vehicleType,
    vehiclePlate
  } = req.body;

  // Validações básicas
  if (!email || !password || !name || !phone || !cpf || !vehicleType) {
    return res.status(400).json({
      error: 'Email, senha, nome, telefone, CPF e tipo de veículo são obrigatórios'
    });
  }

  // Validação específica por tipo de veículo
  if (vehicleType !== 'bicicleta') {
    if (!cnh) {
      return res.status(400).json({
        error: 'CNH é obrigatória para motocicletas e carros'
      });
    }
    if (!vehiclePlate) {
      return res.status(400).json({
        error: 'Placa do veículo é obrigatória para motocicletas e carros'
      });
    }
  }

  if (password.length < 6) {
    return res.status(400).json({
      error: 'Senha deve ter pelo menos 6 caracteres'
    });
  }

  if (!['moto', 'carro', 'bicicleta'].includes(vehicleType)) {
    return res.status(400).json({
      error: 'Tipo de veículo inválido'
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
      cpf,
      cnh: vehicleType === 'bicicleta' ? (cnh || null) : cnh,
      vehicle_type: vehicleType,
      vehicle_plate: vehicleType === 'bicicleta' ? (vehiclePlate || null) : vehiclePlate,
      user_type: 'motoboy',
      email_verified: true, // Simplificado - já aprovado
      is_approved: true,    // Simplificado - já aprovado
      created_at: new Date().toISOString()
    }
  });
}

