import Database from 'better-sqlite3';
import crypto from 'crypto';

// Conectar ao banco
const db = new Database('./database.sqlite');

// Função para hash de senha
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

console.log('🔍 Verificando administrador...');

// Buscar admin
const admin = db.prepare('SELECT * FROM users WHERE email = ?').get('admin@monopolyexpress.com');

if (admin) {
  console.log('✅ Administrador encontrado:');
  console.log('   ID:', admin.id);
  console.log('   Email:', admin.email);
  console.log('   Nome:', admin.name);
  console.log('   Role:', admin.role || 'Não definida');
  console.log('   Email Verificado:', admin.email_verified ? 'Sim' : 'Não');
  
  // Verificar se precisa atualizar
  if (admin.role !== 'admin' || !admin.email_verified) {
    console.log('\n🔧 Atualizando administrador...');
    
    // Atualizar role e email verificado
    const updateStmt = db.prepare(`
      UPDATE users 
      SET role = 'admin', email_verified = TRUE, updated_at = CURRENT_TIMESTAMP
      WHERE email = ?
    `);
    
    updateStmt.run('admin@monopolyexpress.com');
    
    console.log('✅ Administrador atualizado com sucesso!');
  }
  
  // Verificar senha
  const expectedPassword = 'Julio@235689';
  const expectedHash = hashPassword(expectedPassword);
  
  if (admin.password_hash !== expectedHash) {
    console.log('\n🔑 Atualizando senha...');
    
    const updatePasswordStmt = db.prepare(`
      UPDATE users 
      SET password_hash = ?, updated_at = CURRENT_TIMESTAMP
      WHERE email = ?
    `);
    
    updatePasswordStmt.run(expectedHash, 'admin@monopolyexpress.com');
    
    console.log('✅ Senha atualizada!');
  }
  
  console.log('\n🔐 Credenciais de acesso:');
  console.log('   Email: admin@monopolyexpress.com');
  console.log('   Senha: Julio@235689');
  console.log('   Tipo: admin');
  
} else {
  console.log('❌ Administrador não encontrado!');
  console.log('Execute: node create-admin.js');
}

db.close();

