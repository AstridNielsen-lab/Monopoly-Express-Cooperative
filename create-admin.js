import Database from 'better-sqlite3';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Conectar ao banco
const dbPath = path.join(__dirname, 'database.sqlite');
const db = new Database(dbPath);

// Função para hash de senha
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// Dados do administrador
const adminData = {
  id: uuidv4(),
  email: 'admin@monopolyexpress.com',
  name: 'Admim',
  phone: '(11) 99999-9999',
  password: 'Julio@235689',
  role: 'admin'
};

console.log('🔧 Criando usuário administrador...');
console.log('📧 Email:', adminData.email);
console.log('👤 Nome:', adminData.name);
console.log('🔑 Senha:', adminData.password);
console.log('');

try {
  // Verificar se o admin já existe
  const existingAdmin = db.prepare('SELECT id FROM users WHERE email = ?').get(adminData.email);
  
  if (existingAdmin) {
    console.log('⚠️  Usuário administrador já existe!');
    console.log('✅ Email:', adminData.email);
    console.log('📝 Para alterar a senha, delete o usuário primeiro.');
    process.exit(0);
  }
  
  // Criar a tabela de usuários se não existir
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      email_verified BOOLEAN DEFAULT TRUE,
      verification_token TEXT,
      role TEXT DEFAULT 'user',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  // Verificar se a coluna 'role' existe, se não, adicionar
  try {
    db.exec('ALTER TABLE users ADD COLUMN role TEXT DEFAULT "user"');
    console.log('✅ Coluna "role" adicionada à tabela users');
  } catch (error) {
    // Coluna já existe, continuar
  }
  
  // Hash da senha
  const passwordHash = hashPassword(adminData.password);
  
  // Inserir o administrador
  const stmt = db.prepare(`
    INSERT INTO users (id, email, name, phone, password_hash, email_verified, role)
    VALUES (?, ?, ?, ?, ?, TRUE, 'admin')
  `);
  
  stmt.run(adminData.id, adminData.email, adminData.name, adminData.phone, passwordHash);
  
  console.log('✅ Usuário administrador criado com sucesso!');
  console.log('');
  console.log('📋 Detalhes do administrador:');
  console.log('   ID:', adminData.id);
  console.log('   Email:', adminData.email);
  console.log('   Nome:', adminData.name);
  console.log('   Telefone:', adminData.phone);
  console.log('   Função: admin');
  console.log('   Email Verificado: ✅ Sim');
  console.log('');
  console.log('🔐 Credenciais de acesso:');
  console.log('   Email:', adminData.email);
  console.log('   Senha:', adminData.password);
  console.log('');
  console.log('🌐 Para acessar:');
  console.log('   1. Inicie o backend: npm run backend');
  console.log('   2. Inicie o frontend: npm run dev');
  console.log('   3. Acesse: http://localhost:5173/login');
  console.log('   4. Use as credenciais acima');
  
} catch (error) {
  console.error('❌ Erro ao criar administrador:', error.message);
  process.exit(1);
} finally {
  db.close();
}

