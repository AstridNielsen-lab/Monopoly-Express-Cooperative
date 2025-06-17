// API de status simples para Vercel
module.exports = function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    res.status(200).json({
      status: 'online',
      timestamp: new Date().toISOString(),
      version: '2.1.0',
      environment: process.env.NODE_ENV || 'production',
      runtime: process.version,
      platform: process.platform,
      features: {
        motoboyRegistration: true,
        bicycleOptionalCNH: true,
        cpfValidation: true,
        smartFieldValidation: true,
        modernUI: true
      },
      endpoints: {
        health: '/api/health',
        status: '/api/status',
        motoboyRegister: '/api/auth/register/motoboy',
        motoboyLogin: '/api/auth/login/motoboy'
      },
      updates: [
        'Cadastro de motoboy com validação inteligente',
        'Campos opcionais para bicicletas (CNH/placa)',
        'Validação real de CPF brasileiro',
        'Interface moderna com Material Design',
        'Prevenção de duplicatas'
      ]
    });
    
  } catch (error) {
    console.error('Status error:', error);
    
    res.status(500).json({
      status: 'error',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}

