import express from 'express';
import { db } from '../database/setup.js';

const router = express.Router();

/**
 * Atualizar localização do motoboy
 */
router.patch('/:motoboyId/location', async (req, res) => {
  try {
    const { motoboyId } = req.params;
    const { latitude, longitude } = req.body;
    
    if (!latitude || !longitude) {
      return res.status(400).json({ error: 'Latitude e longitude são obrigatórios' });
    }
    
    // Verificar se motoboy existe
    const motoboy = db.prepare('SELECT id FROM motoboys WHERE id = ?').get(motoboyId);
    if (!motoboy) {
      return res.status(404).json({ error: 'Motoboy não encontrado' });
    }
    
    // Atualizar localização atual
    const updateLocation = db.prepare(`
      UPDATE motoboys 
      SET latitude = ?, longitude = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    
    updateLocation.run(latitude, longitude, motoboyId);
    
    // Adicionar ao histórico de localizações
    const insertHistory = db.prepare(`
      INSERT INTO motoboy_locations (motoboy_id, latitude, longitude)
      VALUES (?, ?, ?)
    `);
    
    insertHistory.run(motoboyId, latitude, longitude);
    
    res.json({ message: 'Localização atualizada com sucesso' });
    
  } catch (error) {
    console.error('Erro ao atualizar localização:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

/**
 * Atualizar status ativo/inativo do motoboy
 */
router.patch('/:motoboyId/status', async (req, res) => {
  try {
    const { motoboyId } = req.params;
    const { isActive } = req.body;
    
    if (typeof isActive !== 'boolean') {
      return res.status(400).json({ error: 'Status deve ser true ou false' });
    }
    
    // Verificar se motoboy existe
    const motoboy = db.prepare('SELECT id FROM motoboys WHERE id = ?').get(motoboyId);
    if (!motoboy) {
      return res.status(404).json({ error: 'Motoboy não encontrado' });
    }
    
    // Atualizar status
    const stmt = db.prepare(`
      UPDATE motoboys 
      SET is_active = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    
    stmt.run(isActive, motoboyId);
    
    res.json({ 
      message: `Motoboy ${isActive ? 'ativado' : 'desativado'} com sucesso`,
      isActive 
    });
    
  } catch (error) {
    console.error('Erro ao atualizar status:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

/**
 * Buscar dados do motoboy
 */
router.get('/:motoboyId', async (req, res) => {
  try {
    const { motoboyId } = req.params;
    
    const motoboy = db.prepare(`
      SELECT id, email, name, phone, cpf, cnh, vehicle_type, vehicle_plate,
             is_active, is_approved, rating, total_deliveries, latitude, longitude,
             created_at, updated_at
      FROM motoboys 
      WHERE id = ?
    `).get(motoboyId);
    
    if (!motoboy) {
      return res.status(404).json({ error: 'Motoboy não encontrado' });
    }
    
    res.json({ motoboy });
    
  } catch (error) {
    console.error('Erro ao buscar motoboy:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

/**
 * Listar estatísticas do motoboy
 */
router.get('/:motoboyId/stats', async (req, res) => {
  try {
    const { motoboyId } = req.params;
    
    // Buscar motoboy
    const motoboy = db.prepare('SELECT * FROM motoboys WHERE id = ?').get(motoboyId);
    if (!motoboy) {
      return res.status(404).json({ error: 'Motoboy não encontrado' });
    }
    
    // Estatísticas de entregas
    const deliveryStats = db.prepare(`
      SELECT 
        COUNT(*) as total_deliveries,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_deliveries,
        COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_deliveries,
        SUM(CASE WHEN status = 'completed' THEN price ELSE 0 END) as total_earnings,
        AVG(CASE WHEN status = 'completed' THEN price ELSE NULL END) as avg_delivery_value
      FROM deliveries 
      WHERE motoboy_id = ?
    `).get(motoboyId);
    
    // Estatísticas do dia
    const todayStats = db.prepare(`
      SELECT 
        COUNT(*) as today_deliveries,
        SUM(CASE WHEN status = 'completed' THEN price ELSE 0 END) as today_earnings
      FROM deliveries 
      WHERE motoboy_id = ? AND DATE(created_at) = DATE('now')
    `).get(motoboyId);
    
    // Estatísticas da semana
    const weekStats = db.prepare(`
      SELECT 
        COUNT(*) as week_deliveries,
        SUM(CASE WHEN status = 'completed' THEN price ELSE 0 END) as week_earnings
      FROM deliveries 
      WHERE motoboy_id = ? AND DATE(created_at) >= DATE('now', '-7 days')
    `).get(motoboyId);
    
    res.json({
      stats: {
        rating: motoboy.rating,
        total_deliveries: deliveryStats.total_deliveries || 0,
        completed_deliveries: deliveryStats.completed_deliveries || 0,
        cancelled_deliveries: deliveryStats.cancelled_deliveries || 0,
        total_earnings: deliveryStats.total_earnings || 0,
        avg_delivery_value: deliveryStats.avg_delivery_value || 0,
        today_deliveries: todayStats.today_deliveries || 0,
        today_earnings: todayStats.today_earnings || 0,
        week_deliveries: weekStats.week_deliveries || 0,
        week_earnings: weekStats.week_earnings || 0
      }
    });
    
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

/**
 * Listar motoboys ativos próximos a uma localização
 */
router.get('/nearby/:latitude/:longitude', async (req, res) => {
  try {
    const { latitude, longitude } = req.params;
    const { maxDistance = 10 } = req.query;
    
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    
    if (isNaN(lat) || isNaN(lng)) {
      return res.status(400).json({ error: 'Coordenadas inválidas' });
    }
    
    // Buscar motoboys ativos com localização
    const motoboys = db.prepare(`
      SELECT id, name, vehicle_type, rating, latitude, longitude,
             ROUND(
               6371 * acos(
                 cos(radians(?)) * cos(radians(latitude)) *
                 cos(radians(longitude) - radians(?)) +
                 sin(radians(?)) * sin(radians(latitude))
               ), 2
             ) AS distance
      FROM motoboys 
      WHERE is_active = TRUE AND is_approved = TRUE 
        AND latitude IS NOT NULL AND longitude IS NOT NULL
      HAVING distance <= ?
      ORDER BY distance
    `).all(lat, lng, lat, parseFloat(maxDistance as string));
    
    res.json({ motoboys });
    
  } catch (error) {
    console.error('Erro ao buscar motoboys próximos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

export { router as motoboyRoutes };

