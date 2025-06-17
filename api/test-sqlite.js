// Teste SQLite no Vercel
module.exports = function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Tentar carregar SQLite
    let sqliteStatus = 'not_loaded';
    let dbPath = process.env.DB_PATH || '/tmp/monopoly_express.db';
    let testResult = null;
    
    try {
      const Database = require('better-sqlite3');
      sqliteStatus = 'loaded';
      
      // Tentar criar banco em memória para teste
      const testDb = new Database(':memory:');
      testDb.exec('CREATE TABLE test (id INTEGER PRIMARY KEY, name TEXT)');
      testDb.exec("INSERT INTO test (name) VALUES ('Vercel Test')");
      
      const result = testDb.prepare('SELECT * FROM test').all();
      testResult = result;
      
      testDb.close();
      sqliteStatus = 'working';
      
    } catch (dbError) {
      sqliteStatus = 'error: ' + dbError.message;
    }
    
    res.status(200).json({
      status: 'success',
      timestamp: new Date().toISOString(),
      environment: {
        nodeEnv: process.env.NODE_ENV,
        vercel: process.env.VERCEL,
        runtime: process.version
      },
      sqlite: {
        status: sqliteStatus,
        dbPath: dbPath,
        testResult: testResult
      },
      system: {
        platform: process.platform,
        arch: process.arch,
        memory: process.memoryUsage()
      }
    });
    
  } catch (error) {
    console.error('Test error:', error);
    
    res.status(500).json({
      status: 'error',
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
  }
}

