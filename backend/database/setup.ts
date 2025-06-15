import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, '../../database.sqlite');
export const db = new Database(dbPath);

// Configurações para performance
db.pragma('journal_mode = WAL');
db.pragma('synchronous = NORMAL');
db.pragma('cache_size = 1000000');
db.pragma('temp_store = memory');

export function setupDatabase() {
  console.log('📁 Configurando banco de dados SQLite...');
  
  try {
    // Criar tabelas
    createTables();
    console.log('✅ Banco de dados configurado com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao configurar banco de dados:', error);
    throw error;
  }
}

function createTables() {
  // Tabela de usuários (clientes)
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      email_verified BOOLEAN DEFAULT FALSE,
      verification_token TEXT,
      role TEXT DEFAULT 'user',
      is_premium BOOLEAN DEFAULT FALSE,
      subscription_id TEXT,
      subscription_status TEXT,
      subscription_end_date DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Tabela de motoboys
  db.exec(`
    CREATE TABLE IF NOT EXISTS motoboys (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      cpf TEXT NOT NULL,
      cnh TEXT NOT NULL,
      vehicle_type TEXT CHECK (vehicle_type IN ('moto', 'carro', 'bicicleta')) NOT NULL,
      vehicle_plate TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      email_verified BOOLEAN DEFAULT FALSE,
      verification_token TEXT,
      is_active BOOLEAN DEFAULT FALSE,
      is_approved BOOLEAN DEFAULT FALSE,
      rating REAL DEFAULT 5.0,
      total_deliveries INTEGER DEFAULT 0,
      latitude REAL,
      longitude REAL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Tabela de solicitações de entrega
  db.exec(`
    CREATE TABLE IF NOT EXISTS deliveries (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      motoboy_id TEXT,
      pickup_address TEXT NOT NULL,
      pickup_latitude REAL NOT NULL,
      pickup_longitude REAL NOT NULL,
      delivery_address TEXT NOT NULL,
      delivery_latitude REAL NOT NULL,
      delivery_longitude REAL NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      distance REAL NOT NULL,
      status TEXT CHECK (status IN ('pending', 'accepted', 'in_progress', 'completed', 'cancelled')) DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      completed_at DATETIME,
      FOREIGN KEY (user_id) REFERENCES users (id),
      FOREIGN KEY (motoboy_id) REFERENCES motoboys (id)
    )
  `);

  // Tabela de histórico de localização dos motoboys
  db.exec(`
    CREATE TABLE IF NOT EXISTS motoboy_locations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      motoboy_id TEXT NOT NULL,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (motoboy_id) REFERENCES motoboys (id)
    )
  `);

  // Tabela de avaliações
  db.exec(`
    CREATE TABLE IF NOT EXISTS ratings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      delivery_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      motoboy_id TEXT NOT NULL,
      rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
      comment TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (delivery_id) REFERENCES deliveries (id),
      FOREIGN KEY (user_id) REFERENCES users (id),
      FOREIGN KEY (motoboy_id) REFERENCES motoboys (id)
    )
  `);

  // Índices para performance
  db.exec('CREATE INDEX IF NOT EXISTS idx_users_email ON users (email)');
  db.exec('CREATE INDEX IF NOT EXISTS idx_motoboys_email ON motoboys (email)');
  db.exec('CREATE INDEX IF NOT EXISTS idx_deliveries_status ON deliveries (status)');
  db.exec('CREATE INDEX IF NOT EXISTS idx_deliveries_user_id ON deliveries (user_id)');
  db.exec('CREATE INDEX IF NOT EXISTS idx_deliveries_motoboy_id ON deliveries (motoboy_id)');
  db.exec('CREATE INDEX IF NOT EXISTS idx_motoboy_locations_motoboy_id ON motoboy_locations (motoboy_id)');
}

