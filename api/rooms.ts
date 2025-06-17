import { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    // Simular dados de salas/quartos para teste
    const rooms = [
      {
        id: '1',
        name: 'Sala Premium',
        type: 'premium',
        capacity: 10,
        available: true,
        price: 29.90,
        features: ['Wi-Fi', 'AC', 'Coffee']
      },
      {
        id: '2', 
        name: 'Sala Standard',
        type: 'standard',
        capacity: 5,
        available: true,
        price: 19.90,
        features: ['Wi-Fi', 'AC']
      },
      {
        id: '3',
        name: 'Sala Básica',
        type: 'basic',
        capacity: 3,
        available: false,
        price: 9.90,
        features: ['Wi-Fi']
      }
    ];

    res.status(200).json({
      success: true,
      message: 'Salas carregadas com sucesso',
      timestamp: new Date().toISOString(),
      total: rooms.length,
      rooms: rooms
    });
  } catch (error) {
    console.error('Rooms API error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Erro interno do servidor',
      timestamp: new Date().toISOString()
    });
  }
}

