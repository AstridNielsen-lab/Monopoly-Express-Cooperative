import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Conectar ao banco
const dbPath = path.join(__dirname, 'database.sqlite');
const db = new Database(dbPath);

console.log('🔍 Testando conexão com o banco de dados...');
console.log('📝 Caminho do banco:', dbPath);
console.log('');

try {
  // Testar conexão
  const result = db.prepare('SELECT 1 as test').get();
  console.log('✅ Conexão com o banco: OK');
  
  // Listar tabelas
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
  console.log('📋 Tabelas encontradas:', tables.length);
  tables.forEach(table => {
    console.log('   -', table.name);
  });
  console.log('');
  
  // Verificar usuários
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get();
  console.log('👤 Total de usuários:', userCount.count);
  
  const users = db.prepare('SELECT id, email, name, role, email_verified FROM users').all();
  if (users.length > 0) {
    console.log('📋 Usuários cadastrados:');
    users.forEach(user => {
      console.log(`   - ${user.name} (${user.email}) - Role: ${user.role || 'user'} - Verificado: ${user.email_verified ? '✅' : '❌'}`);
    });
  }
  console.log('');
  
  // Verificar motoboys
  const motoboyCount = db.prepare('SELECT COUNT(*) as count FROM motoboys').get();
  console.log('🏍️ Total de motoboys:', motoboyCount.count);
  
  const motoboys = db.prepare('SELECT id, email, name, email_verified, is_approved FROM motoboys').all();
  if (motoboys.length > 0) {
    console.log('📋 Motoboys cadastrados:');
    motoboys.forEach(motoboy => {
      console.log(`   - ${motoboy.name} (${motoboy.email}) - Verificado: ${motoboy.email_verified ? '✅' : '❌'} - Aprovado: ${motoboy.is_approved ? '✅' : '❌'}`);
    });
  }
  console.log('');
  
  // Verificar entregas
  const deliveryCount = db.prepare('SELECT COUNT(*) as count FROM deliveries').get();
  console.log('🚚 Total de entregas:', deliveryCount.count);
  console.log('');
  
  // Verificar índices
  const indexes = db.prepare("SELECT name FROM sqlite_master WHERE type='index' AND name NOT LIKE 'sqlite_%'").all();
  console.log('🔍 Índices criados:', indexes.length);
  indexes.forEach(index => {
    console.log('   -', index.name);
  });
  console.log('');
  
  console.log('✅ Banco de dados funcionando corretamente!');
  console.log('🚀 Pronto para uso!');
  
} catch (error) {
  console.error('❌ Erro ao testar banco de dados:', error.message);
  process.exit(1);
} finally {
  db.close();
}

