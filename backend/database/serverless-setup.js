// Setup de banco de dados SQLite para ambiente serverless (Vercel)
import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Caminho do banco em ambiente serverless
const DB_PATH = process.env.DB_PATH || '/tmp/monopoly_express.db';
const SCHEMA_PATH = path.join(__dirname, 'schema.sql');

let db = null;

// Inicializar banco de dados
export function initDatabase() {
  try {
    // Verificar se o banco já existe
    const dbExists = fs.existsSync(DB_PATH);
    
    // Criar conexão
    db = new Database(DB_PATH);
    
    // Se banco não existe, criar schema
    if (!dbExists) {
      console.log('🔄 Criando banco de dados SQLite...');
      
      // Ler e executar schema
      if (fs.existsSync(SCHEMA_PATH)) {
        const schema = fs.readFileSync(SCHEMA_PATH, 'utf8');
        db.exec(schema);
        console.log('✅ Schema do banco criado com sucesso');
      } else {
        // Schema inline caso arquivo não exista
        createInlineSchema();
      }
      
      // Criar usuário admin padrão
      createDefaultAdmin();
    }
    
    // Configurações de performance
    db.pragma('journal_mode = WAL');
    db.pragma('synchronous = NORMAL');
    db.pragma('cache_size = 1000');
    db.pragma('temp_store = MEMORY');
    
    console.log('✅ Banco de dados SQLite inicializado');
    return db;
    
  } catch (error) {
    console.error('❌ Erro ao inicializar banco:', error);
    throw error;
  }
}

// Schema inline para garantir funcionamento
function createInlineSchema() {
  const statements = [
    // Tabela de usuários
    `CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      phone TEXT,
      password_hash TEXT NOT NULL,
      role TEXT DEFAULT 'user',
      is_premium BOOLEAN DEFAULT FALSE,
      subscription_id TEXT,
      subscription_status TEXT DEFAULT 'inactive',
      subscription_end_date TEXT,
      email_verified BOOLEAN DEFAULT FALSE,
      verification_token TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    
    // Tabela de motoboys
    `CREATE TABLE IF NOT EXISTS motoboys (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      cpf TEXT UNIQUE NOT NULL,
      cnh TEXT,
      vehicle_type TEXT NOT NULL,
      vehicle_plate TEXT,
      password_hash TEXT NOT NULL,
      is_active BOOLEAN DEFAULT TRUE,
      is_approved BOOLEAN DEFAULT FALSE,
      rating REAL DEFAULT 5.0,
      total_deliveries INTEGER DEFAULT 0,
      latitude REAL,
      longitude REAL,
      email_verified BOOLEAN DEFAULT FALSE,
      verification_token TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    
    // Tabela de entregas
    `CREATE TABLE IF NOT EXISTS deliveries (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      motoboy_id TEXT,
      pickup_address TEXT NOT NULL,
      delivery_address TEXT NOT NULL,
      recipient_name TEXT NOT NULL,
      recipient_phone TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      distance REAL,
      status TEXT DEFAULT 'pending',
      payment_method TEXT NOT NULL,
      pickup_latitude REAL,
      pickup_longitude REAL,
      delivery_latitude REAL,
      delivery_longitude REAL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (motoboy_id) REFERENCES motoboys(id)
    )`,
    
    // Tabela de localizações dos motoboys
    `CREATE TABLE IF NOT EXISTS motoboy_locations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      motoboy_id TEXT NOT NULL,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (motoboy_id) REFERENCES motoboys(id)
    )`,
    
    // Índices para performance
    `CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`,
    `CREATE INDEX IF NOT EXISTS idx_motoboys_email ON motoboys(email)`,
    `CREATE INDEX IF NOT EXISTS idx_motoboys_cpf ON motoboys(cpf)`,
    `CREATE INDEX IF NOT EXISTS idx_deliveries_user ON deliveries(user_id)`,
    `CREATE INDEX IF NOT EXISTS idx_deliveries_motoboy ON deliveries(motoboy_id)`,
    `CREATE INDEX IF NOT EXISTS idx_deliveries_status ON deliveries(status)`,
    `CREATE INDEX IF NOT EXISTS idx_motoboy_locations_motoboy ON motoboy_locations(motoboy_id)`
  ];
  
  statements.forEach(statement => {
    try {
      db.exec(statement);
    } catch (error) {
      console.error('Erro ao executar statement:', error);
    }
  });
}

// Criar usuário admin padrão
async function createDefaultAdmin() {
  try {
    const adminExists = db.prepare('SELECT id FROM users WHERE role = "admin"').get();
    
    if (!adminExists) {
      const crypto = await import('crypto');
      const adminId = crypto.randomUUID();
      const passwordHash = crypto.createHash('sha256').update('admin123').digest('hex');
      
      const stmt = db.prepare(`
        INSERT INTO users (id, email, name, password_hash, role, email_verified)
        VALUES (?, ?, ?, ?, ?, ?)
      `);
      
      stmt.run(
        adminId,
        'admin@monopolyexpress.com',
        'Administrador',
        passwordHash,
        'admin',
        true
      );
      
      console.log('👤 Usuário admin criado: admin@monopolyexpress.com / admin123');
    }
  } catch (error) {
    console.error('Erro ao criar admin:', error);
  }
}

// Obter instância do banco
export function getDatabase() {
  if (!db) {
    return initDatabase();
  }
  return db;
}

// Fechar conexão (para cleanup)
export function closeDatabase() {
  if (db) {
    db.close();
    db = null;
  }
}

export { db };

