import { VercelRequest, VercelResponse } from '@vercel/node';
import { getDatabase } from './database';

export default function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Testar conexão com o banco
    const db = getDatabase();
    const result = db.prepare('SELECT 1 as test').get();
    
    res.status(200).json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      database: result ? 'Connected' : 'Error',
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

