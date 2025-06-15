import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import { db } from '../database/setup.js';
import { EmailService } from '../services/emailService.js';
import MercadoPagoService from '../services/mercadoPagoService.js';

const router = express.Router();
const emailService = EmailService.getInstance();

// Função para hash de senha simples (em produção, use bcrypt)
function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

/**
 * Registro de usuário
 */
router.post('/register/user', async (req, res) => {
  try {
    const { email, password, name, phone } = req.body;
    
    // Validações
    if (!email || !password || !name || !phone) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }
    
    if (password.length < 6) {
      return res.status(400).json({ error: 'Senha deve ter pelo menos 6 caracteres' });
    }
    
    // Verificar se email já existe
    const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existingUser) {
      return res.status(400).json({ error: 'Este email já está cadastrado' });
    }
    
    // Criar usuário
    const userId = uuidv4();
    const passwordHash = hashPassword(password);
    const verificationToken = emailService.generateVerificationToken();
    
    const stmt = db.prepare(`
      INSERT INTO users (id, email, name, phone, password_hash, verification_token)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(userId, email, name, phone, passwordHash, verificationToken);
    
    // Enviar email de verificação
    const emailSent = await emailService.sendUserVerificationEmail(email, name, verificationToken);
    
    if (!emailSent) {
      console.warn('Falha ao enviar email de verificação para:', email);
    }
    
    res.status(201).json({
      message: 'Usuário criado com sucesso! Verifique seu email para ativar a conta.',
      userId,
      emailSent
    });
    
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

/**
 * Registro de motoboy
 */
router.post('/register/motoboy', async (req, res) => {
  try {
    const { email, password, name, phone, cpf, cnh, vehicleType, vehiclePlate } = req.body;
    
    // Validações
    if (!email || !password || !name || !phone || !cpf || !cnh || !vehicleType || !vehiclePlate) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }
    
    if (password.length < 6) {
      return res.status(400).json({ error: 'Senha deve ter pelo menos 6 caracteres' });
    }
    
    if (!['moto', 'carro', 'bicicleta'].includes(vehicleType)) {
      return res.status(400).json({ error: 'Tipo de veículo inválido' });
    }
    
    // Verificar se email já existe
    const existingMotoboy = db.prepare('SELECT id FROM motoboys WHERE email = ?').get(email);
    if (existingMotoboy) {
      return res.status(400).json({ error: 'Este email já está cadastrado' });
    }
    
    // Verificar se CPF já existe
    const existingCpf = db.prepare('SELECT id FROM motoboys WHERE cpf = ?').get(cpf);
    if (existingCpf) {
      return res.status(400).json({ error: 'Este CPF já está cadastrado' });
    }
    
    // Criar motoboy
    const motoboyId = uuidv4();
    const passwordHash = hashPassword(password);
    const verificationToken = emailService.generateVerificationToken();
    
    const stmt = db.prepare(`
      INSERT INTO motoboys (
        id, email, name, phone, cpf, cnh, vehicle_type, vehicle_plate,
        password_hash, verification_token
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      motoboyId, email, name, phone, cpf, cnh, vehicleType, vehiclePlate,
      passwordHash, verificationToken
    );
    
    // Enviar email de verificação
    const emailSent = await emailService.sendMotoboyVerificationEmail(email, name, verificationToken);
    
    if (!emailSent) {
      console.warn('Falha ao enviar email de verificação para:', email);
    }
    
    res.status(201).json({
      message: 'Motoboy cadastrado com sucesso! Verifique seu email para ativar a conta.',
      motoboyId,
      emailSent
    });
    
  } catch (error) {
    console.error('Erro ao registrar motoboy:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

/**
 * Verificação de email para usuários
 */
router.post('/verify/user', async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({ error: 'Token de verificação é obrigatório' });
    }
    
    // Buscar usuário pelo token
    const user = db.prepare('SELECT * FROM users WHERE verification_token = ?').get(token);
    
    if (!user) {
      return res.status(400).json({ error: 'Token de verificação inválido ou expirado' });
    }
    
    if (user.email_verified) {
      return res.status(400).json({ error: 'Email já foi verificado' });
    }
    
    // Ativar usuário
    const stmt = db.prepare(`
      UPDATE users 
      SET email_verified = TRUE, verification_token = NULL, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    
    stmt.run(user.id);
    
    res.json({ message: 'Email verificado com sucesso! Agora você pode fazer login.' });
    
  } catch (error) {
    console.error('Erro ao verificar email:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

/**
 * Verificação de email para motoboys
 */
router.post('/verify/motoboy', async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({ error: 'Token de verificação é obrigatório' });
    }
    
    // Buscar motoboy pelo token
    const motoboy = db.prepare('SELECT * FROM motoboys WHERE verification_token = ?').get(token);
    
    if (!motoboy) {
      return res.status(400).json({ error: 'Token de verificação inválido ou expirado' });
    }
    
    if (motoboy.email_verified) {
      return res.status(400).json({ error: 'Email já foi verificado' });
    }
    
    // Verificar email
    const stmt = db.prepare(`
      UPDATE motoboys 
      SET email_verified = TRUE, verification_token = NULL, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    
    stmt.run(motoboy.id);
    
    res.json({ 
      message: 'Email verificado com sucesso! Sua conta está aguardando aprovação da nossa equipe.' 
    });
    
  } catch (error) {
    console.error('Erro ao verificar email:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

/**
 * Login unificado (usuário, motoboy ou admin)
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password, userType } = req.body;
    
    if (!email || !password || !userType) {
      return res.status(400).json({ error: 'Email, senha e tipo de usuário são obrigatórios' });
    }
    
    let user = null;
    let tableName = '';
    let actualUserType = userType;
    
    // Buscar usuário na tabela apropriada
    if (userType === 'admin' || userType === 'user') {
      user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
      tableName = 'users';
      
      // Verificar se é admin
      if (user && user.role === 'admin') {
        actualUserType = 'admin';
      } else {
        actualUserType = 'user';
      }
    } else if (userType === 'motoboy') {
      user = db.prepare('SELECT * FROM motoboys WHERE email = ?').get(email);
      tableName = 'motoboys';
      actualUserType = 'motoboy';
    }
    
    if (!user) {
      return res.status(401).json({ error: 'Email ou senha incorretos' });
    }
    
    // Verificar senha
    if (!verifyPassword(password, user.password_hash)) {
      return res.status(401).json({ error: 'Email ou senha incorretos' });
    }
    
    // Verificações específicas por tipo
    if (actualUserType === 'admin') {
      // Admin sempre pode fazer login (sem verificação de email)
      console.log(`🔐 Admin login: ${email}`);
    } else if (actualUserType === 'user') {
      if (!user.email_verified) {
        return res.status(401).json({ error: 'Email não verificado. Verifique sua caixa de entrada.' });
      }
    } else if (actualUserType === 'motoboy') {
      if (!user.email_verified) {
        return res.status(401).json({ error: 'Email não verificado. Verifique sua caixa de entrada.' });
      }
      if (!user.is_approved) {
        return res.status(401).json({ error: 'Conta ainda não foi aprovada pela nossa equipe.' });
      }
    }
    
    // Verificar assinatura no Mercado Pago (apenas para usuários não-admin)
    let subscriptionInfo = null;
    if (actualUserType === 'user') {
      try {
        const mpService = MercadoPagoService.getInstance();
        const subscriptionStatus = await mpService.checkUserSubscription(email);
        
        // Atualizar status de assinatura no banco local
        const updateStmt = db.prepare(`
          UPDATE users 
          SET 
            is_premium = ?,
            subscription_id = ?,
            subscription_status = ?,
            subscription_end_date = ?,
            updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `);
        
        updateStmt.run(
          subscriptionStatus.isActive,
          subscriptionStatus.subscriptionId || null,
          subscriptionStatus.status || 'inactive',
          subscriptionStatus.nextBillingDate || null,
          user.id
        );
        
        subscriptionInfo = subscriptionStatus;
        console.log(`🔍 Assinatura verificada para ${email}:`, subscriptionStatus.isActive ? 'ATIVA' : 'INATIVA');
        
      } catch (error) {
        console.warn('⚠️ Erro ao verificar assinatura durante login:', error);
        // Não bloquear login por erro na verificação de assinatura
      }
    }
    
    // Retornar dados do usuário (sem senha)
    const { password_hash, verification_token, ...userData } = user;
    
    res.json({
      message: 'Login realizado com sucesso',
      user: {
        ...userData,
        user_type: actualUserType,
        subscription: subscriptionInfo
      }
    });
    
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

/**
 * Login de usuário (manter compatibilidade)
 */
router.post('/login/user', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }
    
    // Buscar usuário
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    
    if (!user) {
      return res.status(401).json({ error: 'Email ou senha incorretos' });
    }
    
    if (!user.email_verified && user.role !== 'admin') {
      return res.status(401).json({ error: 'Email não verificado. Verifique sua caixa de entrada.' });
    }
    
    // Verificar senha
    if (!verifyPassword(password, user.password_hash)) {
      return res.status(401).json({ error: 'Email ou senha incorretos' });
    }
    
    // Verificar assinatura no Mercado Pago (apenas para usuários não-admin)
    let subscriptionInfo = null;
    if (user.role !== 'admin') {
      try {
        const mpService = MercadoPagoService.getInstance();
        const subscriptionStatus = await mpService.checkUserSubscription(email);
        
        // Atualizar status de assinatura no banco local
        const updateStmt = db.prepare(`
          UPDATE users 
          SET 
            is_premium = ?,
            subscription_id = ?,
            subscription_status = ?,
            subscription_end_date = ?,
            updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `);
        
        updateStmt.run(
          subscriptionStatus.isActive,
          subscriptionStatus.subscriptionId || null,
          subscriptionStatus.status || 'inactive',
          subscriptionStatus.nextBillingDate || null,
          user.id
        );
        
        subscriptionInfo = subscriptionStatus;
        console.log(`🔍 Assinatura verificada para ${email}:`, subscriptionStatus.isActive ? 'ATIVA' : 'INATIVA');
        
      } catch (error) {
        console.warn('⚠️ Erro ao verificar assinatura durante login:', error);
        // Não bloquear login por erro na verificação de assinatura
      }
    }
    
    // Retornar dados do usuário (sem senha)
    const { password_hash, verification_token, ...userData } = user;
    
    const userType = user.role === 'admin' ? 'admin' : 'user';
    
    res.json({
      message: 'Login realizado com sucesso',
      user: {
        ...userData,
        user_type: userType,
        subscription: subscriptionInfo
      }
    });
    
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

/**
 * Login de motoboy
 */
router.post('/login/motoboy', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }
    
    // Buscar motoboy
    const motoboy = db.prepare('SELECT * FROM motoboys WHERE email = ?').get(email);
    
    if (!motoboy) {
      return res.status(401).json({ error: 'Email ou senha incorretos' });
    }
    
    if (!motoboy.email_verified) {
      return res.status(401).json({ error: 'Email não verificado. Verifique sua caixa de entrada.' });
    }
    
    if (!motoboy.is_approved) {
      return res.status(401).json({ error: 'Conta ainda não foi aprovada pela nossa equipe.' });
    }
    
    // Verificar senha
    if (!verifyPassword(password, motoboy.password_hash)) {
      return res.status(401).json({ error: 'Email ou senha incorretos' });
    }
    
    // Retornar dados do motoboy (sem senha)
    const { password_hash, verification_token, ...motoboyData } = motoboy;
    
    res.json({
      message: 'Login realizado com sucesso',
      user: {
        ...motoboyData,
        user_type: 'motoboy'
      }
    });
    
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

/**
 * Aprovação de motoboy (apenas para admin)
 */
router.post('/approve/motoboy/:motoboyId', async (req, res) => {
  try {
    const { motoboyId } = req.params;
    
    // Buscar motoboy
    const motoboy = db.prepare('SELECT * FROM motoboys WHERE id = ?').get(motoboyId);
    
    if (!motoboy) {
      return res.status(404).json({ error: 'Motoboy não encontrado' });
    }
    
    if (!motoboy.email_verified) {
      return res.status(400).json({ error: 'Motoboy ainda não verificou o email' });
    }
    
    if (motoboy.is_approved) {
      return res.status(400).json({ error: 'Motoboy já foi aprovado' });
    }
    
    // Aprovar motoboy
    const stmt = db.prepare(`
      UPDATE motoboys 
      SET is_approved = TRUE, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    
    stmt.run(motoboyId);
    
    // Enviar email de aprovação
    const emailSent = await emailService.sendMotoboyApprovalEmail(motoboy.email, motoboy.name);
    
    res.json({
      message: 'Motoboy aprovado com sucesso!',
      emailSent
    });
    
  } catch (error) {
    console.error('Erro ao aprovar motoboy:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

/**
 * Listar motoboys pendentes de aprovação
 */
router.get('/pending/motoboys', async (req, res) => {
  try {
    const motoboys = db.prepare(`
      SELECT id, email, name, phone, cpf, cnh, vehicle_type, vehicle_plate, created_at
      FROM motoboys 
      WHERE email_verified = TRUE AND is_approved = FALSE
      ORDER BY created_at DESC
    `).all();
    
    res.json({ motoboys });
    
  } catch (error) {
    console.error('Erro ao listar motoboys pendentes:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

export { router as authRoutes };

