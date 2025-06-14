import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../database/setup.js';
import { FreightService } from '../services/freightService.js';

const router = express.Router();
const freightService = FreightService.getInstance();

/**
 * Calcular frete entre dois endereços
 */
router.post('/calculate-freight', async (req, res) => {
  try {
    const { pickupAddress, deliveryAddress, vehicleType = 'moto' } = req.body;
    
    if (!pickupAddress || !deliveryAddress) {
      return res.status(400).json({ error: 'Endereços de coleta e entrega são obrigatórios' });
    }
    
    // Calcular frete
    const calculation = await freightService.calculateFreightFromAddresses(
      pickupAddress,
      deliveryAddress,
      vehicleType
    );
    
    // Validar distância
    if (!freightService.isValidDistance(calculation.distance)) {
      return res.status(400).json({ 
        error: 'Distância inválida. Deve estar entre 500m e 100km.' 
      });
    }
    
    res.json({
      success: true,
      calculation: {
        distance: Math.round(calculation.distance * 100) / 100, // 2 casas decimais
        price: calculation.totalPrice,
        basePrice: calculation.basePrice,
        distancePrice: calculation.distancePrice,
        estimatedDuration: Math.round(calculation.estimatedDuration),
        formattedPrice: freightService.formatPrice(calculation.totalPrice)
      },
      coordinates: calculation.coordinates
    });
    
  } catch (error) {
    console.error('Erro ao calcular frete:', error);
    res.status(500).json({ 
      error: 'Erro ao calcular frete. Verifique os endereços informados.' 
    });
  }
});

/**
 * Criar nova solicitação de entrega
 */
router.post('/create', async (req, res) => {
  try {
    const {
      userId,
      pickupAddress,
      deliveryAddress,
      description,
      vehicleType = 'moto'
    } = req.body;
    
    if (!userId || !pickupAddress || !deliveryAddress) {
      return res.status(400).json({ error: 'Dados obrigatórios não informados' });
    }
    
    // Verificar se usuário existe
    const user = db.prepare('SELECT id FROM users WHERE id = ? AND email_verified = TRUE').get(userId);
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado ou não verificado' });
    }
    
    // Calcular frete e coordenadas
    const calculation = await freightService.calculateFreightFromAddresses(
      pickupAddress,
      deliveryAddress,
      vehicleType
    );
    
    if (!freightService.isValidDistance(calculation.distance)) {
      return res.status(400).json({ 
        error: 'Distância inválida. Deve estar entre 500m e 100km.' 
      });
    }
    
    if (!calculation.coordinates) {
      return res.status(400).json({ error: 'Não foi possível encontrar as coordenadas dos endereços' });
    }
    
    // Criar entrega no banco
    const deliveryId = uuidv4();
    const stmt = db.prepare(`
      INSERT INTO deliveries (
        id, user_id, pickup_address, pickup_latitude, pickup_longitude,
        delivery_address, delivery_latitude, delivery_longitude,
        description, price, distance, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
    `);
    
    stmt.run(
      deliveryId,
      userId,
      pickupAddress,
      calculation.coordinates.pickup.lat,
      calculation.coordinates.pickup.lng,
      deliveryAddress,
      calculation.coordinates.delivery.lat,
      calculation.coordinates.delivery.lng,
      description || '',
      calculation.totalPrice,
      calculation.distance
    );
    
    // Buscar a entrega criada
    const delivery = db.prepare('SELECT * FROM deliveries WHERE id = ?').get(deliveryId);
    
    res.status(201).json({
      message: 'Entrega criada com sucesso!',
      delivery: {
        ...delivery,
        formattedPrice: freightService.formatPrice(delivery.price)
      }
    });
    
  } catch (error) {
    console.error('Erro ao criar entrega:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

/**
 * Listar entregas disponíveis para motoboys
 */
router.get('/available', async (req, res) => {
  try {
    const { motoboyLat, motoboyLng, maxDistance = 20 } = req.query;
    
    let query = `
      SELECT d.*, u.name as user_name, u.phone as user_phone
      FROM deliveries d
      JOIN users u ON d.user_id = u.id
      WHERE d.status = 'pending'
      ORDER BY d.created_at DESC
    `;
    
    const deliveries = db.prepare(query).all();
    
    // Se as coordenadas do motoboy foram fornecidas, calcular distância e filtrar
    let filteredDeliveries = deliveries;
    if (motoboyLat && motoboyLng) {
      const motoboyCoords = {
        lat: parseFloat(motoboyLat as string),
        lng: parseFloat(motoboyLng as string)
      };
      
      filteredDeliveries = deliveries
        .map(delivery => {
          const pickupCoords = {
            lat: delivery.pickup_latitude,
            lng: delivery.pickup_longitude
          };
          
          // Calcular distância do motoboy até o local de coleta
          const distanceToPickup = freightService['calculateEuclideanDistance'](motoboyCoords, pickupCoords).distance;
          
          return {
            ...delivery,
            distanceFromMotoboy: Math.round(distanceToPickup * 100) / 100,
            formattedPrice: freightService.formatPrice(delivery.price)
          };
        })
        .filter(delivery => delivery.distanceFromMotoboy <= parseFloat(maxDistance as string))
        .sort((a, b) => a.distanceFromMotoboy - b.distanceFromMotoboy);
    } else {
      filteredDeliveries = deliveries.map(delivery => ({
        ...delivery,
        formattedPrice: freightService.formatPrice(delivery.price)
      }));
    }
    
    res.json({ deliveries: filteredDeliveries });
    
  } catch (error) {
    console.error('Erro ao listar entregas disponíveis:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

/**
 * Motoboy aceitar entrega
 */
router.post('/:deliveryId/accept', async (req, res) => {
  try {
    const { deliveryId } = req.params;
    const { motoboyId } = req.body;
    
    if (!motoboyId) {
      return res.status(400).json({ error: 'ID do motoboy é obrigatório' });
    }
    
    // Verificar se motoboy existe e está aprovado
    const motoboy = db.prepare(`
      SELECT id FROM motoboys 
      WHERE id = ? AND email_verified = TRUE AND is_approved = TRUE
    `).get(motoboyId);
    
    if (!motoboy) {
      return res.status(404).json({ error: 'Motoboy não encontrado ou não aprovado' });
    }
    
    // Verificar se entrega existe e está pendente
    const delivery = db.prepare('SELECT * FROM deliveries WHERE id = ? AND status = "pending"').get(deliveryId);
    
    if (!delivery) {
      return res.status(404).json({ error: 'Entrega não encontrada ou já foi aceita' });
    }
    
    // Aceitar entrega
    const stmt = db.prepare(`
      UPDATE deliveries 
      SET motoboy_id = ?, status = 'accepted', updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    
    stmt.run(motoboyId, deliveryId);
    
    // Buscar entrega atualizada
    const updatedDelivery = db.prepare(`
      SELECT d.*, u.name as user_name, u.phone as user_phone,
             m.name as motoboy_name, m.phone as motoboy_phone
      FROM deliveries d
      JOIN users u ON d.user_id = u.id
      JOIN motoboys m ON d.motoboy_id = m.id
      WHERE d.id = ?
    `).get(deliveryId);
    
    res.json({
      message: 'Entrega aceita com sucesso!',
      delivery: {
        ...updatedDelivery,
        formattedPrice: freightService.formatPrice(updatedDelivery.price)
      }
    });
    
  } catch (error) {
    console.error('Erro ao aceitar entrega:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

/**
 * Atualizar status da entrega
 */
router.patch('/:deliveryId/status', async (req, res) => {
  try {
    const { deliveryId } = req.params;
    const { status, motoboyId } = req.body;
    
    const validStatuses = ['accepted', 'in_progress', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Status inválido' });
    }
    
    // Verificar se entrega existe
    const delivery = db.prepare('SELECT * FROM deliveries WHERE id = ?').get(deliveryId);
    if (!delivery) {
      return res.status(404).json({ error: 'Entrega não encontrada' });
    }
    
    // Verificar se motoboy tem permissão para atualizar
    if (delivery.motoboy_id !== motoboyId) {
      return res.status(403).json({ error: 'Sem permissão para atualizar esta entrega' });
    }
    
    // Atualizar status
    let updateQuery = `
      UPDATE deliveries 
      SET status = ?, updated_at = CURRENT_TIMESTAMP
    `;
    
    const params = [status];
    
    // Se estiver completando, adicionar timestamp
    if (status === 'completed') {
      updateQuery += ', completed_at = CURRENT_TIMESTAMP';
    }
    
    updateQuery += ' WHERE id = ?';
    params.push(deliveryId);
    
    const stmt = db.prepare(updateQuery);
    stmt.run(...params);
    
    // Se completou, atualizar estatísticas do motoboy
    if (status === 'completed') {
      const updateMotoboy = db.prepare(`
        UPDATE motoboys 
        SET total_deliveries = total_deliveries + 1
        WHERE id = ?
      `);
      updateMotoboy.run(motoboyId);
    }
    
    // Buscar entrega atualizada
    const updatedDelivery = db.prepare(`
      SELECT d.*, u.name as user_name, u.phone as user_phone,
             m.name as motoboy_name, m.phone as motoboy_phone
      FROM deliveries d
      JOIN users u ON d.user_id = u.id
      LEFT JOIN motoboys m ON d.motoboy_id = m.id
      WHERE d.id = ?
    `).get(deliveryId);
    
    res.json({
      message: `Entrega ${status === 'completed' ? 'concluída' : 'atualizada'} com sucesso!`,
      delivery: {
        ...updatedDelivery,
        formattedPrice: freightService.formatPrice(updatedDelivery.price)
      }
    });
    
  } catch (error) {
    console.error('Erro ao atualizar status da entrega:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

/**
 * Buscar entregas de um usuário
 */
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = req.query;
    
    let query = `
      SELECT d.*, m.name as motoboy_name, m.phone as motoboy_phone
      FROM deliveries d
      LEFT JOIN motoboys m ON d.motoboy_id = m.id
      WHERE d.user_id = ?
    `;
    
    const params = [userId];
    
    if (status) {
      query += ' AND d.status = ?';
      params.push(status as string);
    }
    
    query += ' ORDER BY d.created_at DESC';
    
    const deliveries = db.prepare(query).all(...params);
    
    const formattedDeliveries = deliveries.map(delivery => ({
      ...delivery,
      formattedPrice: freightService.formatPrice(delivery.price)
    }));
    
    res.json({ deliveries: formattedDeliveries });
    
  } catch (error) {
    console.error('Erro ao buscar entregas do usuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

/**
 * Buscar entregas de um motoboy
 */
router.get('/motoboy/:motoboyId', async (req, res) => {
  try {
    const { motoboyId } = req.params;
    const { status } = req.query;
    
    let query = `
      SELECT d.*, u.name as user_name, u.phone as user_phone
      FROM deliveries d
      JOIN users u ON d.user_id = u.id
      WHERE d.motoboy_id = ?
    `;
    
    const params = [motoboyId];
    
    if (status) {
      query += ' AND d.status = ?';
      params.push(status as string);
    }
    
    query += ' ORDER BY d.created_at DESC';
    
    const deliveries = db.prepare(query).all(...params);
    
    const formattedDeliveries = deliveries.map(delivery => ({
      ...delivery,
      formattedPrice: freightService.formatPrice(delivery.price)
    }));
    
    res.json({ deliveries: formattedDeliveries });
    
  } catch (error) {
    console.error('Erro ao buscar entregas do motoboy:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

export { router as deliveryRoutes };

