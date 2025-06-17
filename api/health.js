// API Health Check para Vercel
module.exports = function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '2.0',
      environment: process.env.NODE_ENV || 'production',
      database: {
        type: 'SQLite',
        path: process.env.DB_PATH || '/tmp/monopoly_express.db',
        status: 'ready'
      },
      features: {
        motoboyRegistration: true,
        bicycleOptionalCNH: true,
        centralDeliveryQueue: true,
        smartValidation: true,
        concurrencyHandling: true,
        cpfValidation: true
      }
    });
    
  } catch (error) {
    console.error('Health check error:', error);
    
    res.status(500).json({
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}

