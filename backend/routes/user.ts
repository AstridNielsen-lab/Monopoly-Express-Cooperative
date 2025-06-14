import express from 'express';
import { db } from '../database/setup.js';

const router = express.Router();

/**
 * Buscar dados do usuário
 */
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = db.prepare(`
      SELECT id, email, name, phone, email_verified, created_at, updated_at
      FROM users 
      WHERE id = ?
    `).get(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    
    res.json({ user });
    
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

/**
 * Listar estatísticas do usuário
 */
router.get('/:userId/stats', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Verificar se usuário existe
    const user = db.prepare('SELECT id FROM users WHERE id = ?').get(userId);
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    
    // Estatísticas de entregas
    const deliveryStats = db.prepare(`
      SELECT 
        COUNT(*) as total_deliveries,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_deliveries,
        COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_deliveries,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_deliveries,
        SUM(CASE WHEN status = 'completed' THEN price ELSE 0 END) as total_spent,
        AVG(CASE WHEN status = 'completed' THEN price ELSE NULL END) as avg_delivery_value
      FROM deliveries 
      WHERE user_id = ?
    `).get(userId);
    
    // Estatísticas do mês
    const monthStats = db.prepare(`
      SELECT 
        COUNT(*) as month_deliveries,
        SUM(CASE WHEN status = 'completed' THEN price ELSE 0 END) as month_spent
      FROM deliveries 
      WHERE user_id = ? AND DATE(created_at) >= DATE('now', 'start of month')
    `).get(userId);
    
    res.json({
      stats: {
        total_deliveries: deliveryStats.total_deliveries || 0,
        completed_deliveries: deliveryStats.completed_deliveries || 0,
        cancelled_deliveries: deliveryStats.cancelled_deliveries || 0,
        pending_deliveries: deliveryStats.pending_deliveries || 0,
        total_spent: deliveryStats.total_spent || 0,
        avg_delivery_value: deliveryStats.avg_delivery_value || 0,
        month_deliveries: monthStats.month_deliveries || 0,
        month_spent: monthStats.month_spent || 0
      }
    });
    
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

/**
 * Atualizar dados do usuário
 */
router.patch('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, phone } = req.body;
    
    // Verificar se usuário existe
    const user = db.prepare('SELECT id FROM users WHERE id = ?').get(userId);
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    
    // Preparar campos para atualização
    const updates = [];
    const values = [];
    
    if (name) {
      updates.push('name = ?');
      values.push(name);
    }
    
    if (phone) {
      updates.push('phone = ?');
      values.push(phone);
    }
    
    if (updates.length === 0) {
      return res.status(400).json({ error: 'Nenhum campo para atualizar' });
    }
    
    updates.push('updated_at = CURRENT_TIMESTAMP');
    values.push(userId);
    
    const query = `UPDATE users SET ${updates.join(', ')} WHERE id = ?`;
    const stmt = db.prepare(query);
    stmt.run(...values);
    
    // Buscar usuário atualizado
    const updatedUser = db.prepare(`
      SELECT id, email, name, phone, email_verified, created_at, updated_at
      FROM users 
      WHERE id = ?
    `).get(userId);
    
    res.json({
      message: 'Usuário atualizado com sucesso',
      user: updatedUser
    });
    
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

export { router as userRoutes };

