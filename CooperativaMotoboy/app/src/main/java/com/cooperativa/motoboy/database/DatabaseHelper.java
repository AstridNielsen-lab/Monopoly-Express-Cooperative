package com.cooperativa.motoboy.database;

import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;
import android.util.Log;
import com.cooperativa.motoboy.Corrida;
import java.util.ArrayList;
import java.util.List;

public class DatabaseHelper extends SQLiteOpenHelper {
    
    private static final String TAG = "DatabaseHelper";
    private static final String DATABASE_NAME = "monopoly_express.db";
    private static final int DATABASE_VERSION = 1;
    
    // Tabela de Usuários
    private static final String TABLE_USUARIOS = "usuarios";
    private static final String COL_USER_ID = "id";
    private static final String COL_USER_NOME = "nome";
    private static final String COL_USER_CPF = "cpf";
    private static final String COL_USER_TELEFONE = "telefone";
    private static final String COL_USER_EMAIL = "email";
    private static final String COL_USER_SENHA = "senha";
    private static final String COL_USER_TIPO = "tipo";
    private static final String COL_USER_DATA_CRIACAO = "data_criacao";
    
    // Tabela de Entregas
    private static final String TABLE_ENTREGAS = "entregas";
    private static final String COL_ENTREGA_ID = "id";
    private static final String COL_ENTREGA_CLIENT_ID = "cliente_id";
    private static final String COL_ENTREGA_MOTOBOY_ID = "motoboy_id";
    private static final String COL_ENTREGA_ENDERECO_COLETA = "endereco_coleta";
    private static final String COL_ENTREGA_ENDERECO_ENTREGA = "endereco_entrega";
    private static final String COL_ENTREGA_DESCRICAO = "descricao";
    private static final String COL_ENTREGA_VALOR = "valor";
    private static final String COL_ENTREGA_STATUS = "status";
    private static final String COL_ENTREGA_DISTANCIA = "distancia_km";
    private static final String COL_ENTREGA_TIMESTAMP = "timestamp";
    
    public DatabaseHelper(Context context) {
        super(context, DATABASE_NAME, null, DATABASE_VERSION);
    }
    
    @Override
    public void onCreate(SQLiteDatabase db) {
        // Criar tabela de usuários
        String createUsersTable = "CREATE TABLE " + TABLE_USUARIOS + " (" +
                COL_USER_ID + " INTEGER PRIMARY KEY AUTOINCREMENT, " +
                COL_USER_NOME + " TEXT NOT NULL, " +
                COL_USER_CPF + " TEXT UNIQUE NOT NULL, " +
                COL_USER_TELEFONE + " TEXT, " +
                COL_USER_EMAIL + " TEXT UNIQUE NOT NULL, " +
                COL_USER_SENHA + " TEXT NOT NULL, " +
                COL_USER_TIPO + " TEXT NOT NULL CHECK(" + COL_USER_TIPO + " IN ('CLIENTE', 'MOTOBOY')), " +
                COL_USER_DATA_CRIACAO + " INTEGER DEFAULT (strftime('%s','now'))" +
                ")";
        
        // Criar tabela de entregas
        String createEntregasTable = "CREATE TABLE " + TABLE_ENTREGAS + " (" +
                COL_ENTREGA_ID + " INTEGER PRIMARY KEY AUTOINCREMENT, " +
                COL_ENTREGA_CLIENT_ID + " INTEGER NOT NULL, " +
                COL_ENTREGA_MOTOBOY_ID + " INTEGER, " +
                COL_ENTREGA_ENDERECO_COLETA + " TEXT NOT NULL, " +
                COL_ENTREGA_ENDERECO_ENTREGA + " TEXT NOT NULL, " +
                COL_ENTREGA_DESCRICAO + " TEXT, " +
                COL_ENTREGA_VALOR + " REAL NOT NULL, " +
                COL_ENTREGA_STATUS + " TEXT NOT NULL DEFAULT 'AGUARDANDO', " +
                COL_ENTREGA_DISTANCIA + " REAL, " +
                COL_ENTREGA_TIMESTAMP + " INTEGER DEFAULT (strftime('%s','now')), " +
                "FOREIGN KEY(" + COL_ENTREGA_CLIENT_ID + ") REFERENCES " + TABLE_USUARIOS + "(" + COL_USER_ID + "), " +
                "FOREIGN KEY(" + COL_ENTREGA_MOTOBOY_ID + ") REFERENCES " + TABLE_USUARIOS + "(" + COL_USER_ID + ")" +
                ")";
        
        try {
            db.execSQL(createUsersTable);
            db.execSQL(createEntregasTable);
            Log.d(TAG, "Tabelas criadas com sucesso");
        } catch (Exception e) {
            Log.e(TAG, "Erro ao criar tabelas: " + e.getMessage());
        }
    }
    
    @Override
    public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {
        Log.d(TAG, "Atualizando banco de dados da versão " + oldVersion + " para " + newVersion);
        db.execSQL("DROP TABLE IF EXISTS " + TABLE_ENTREGAS);
        db.execSQL("DROP TABLE IF EXISTS " + TABLE_USUARIOS);
        onCreate(db);
    }
    
    // ===== MÉTODOS PARA USUÁRIOS =====
    
    public long insertUser(Usuario usuario) {
        SQLiteDatabase db = this.getWritableDatabase();
        ContentValues values = new ContentValues();
        
        values.put(COL_USER_NOME, usuario.getNome());
        values.put(COL_USER_CPF, usuario.getCpf());
        values.put(COL_USER_TELEFONE, usuario.getTelefone());
        values.put(COL_USER_EMAIL, usuario.getEmail());
        values.put(COL_USER_SENHA, usuario.getSenha());
        values.put(COL_USER_TIPO, usuario.getTipo());
        values.put(COL_USER_DATA_CRIACAO, System.currentTimeMillis());
        
        try {
            long result = db.insert(TABLE_USUARIOS, null, values);
            Log.d(TAG, "Usuário inserido com ID: " + result);
            return result;
        } catch (Exception e) {
            Log.e(TAG, "Erro ao inserir usuário: " + e.getMessage());
            return -1;
        } finally {
            db.close();
        }
    }
    
    public Usuario authenticateUser(String email, String senha) {
        SQLiteDatabase db = this.getReadableDatabase();
        Usuario usuario = null;
        
        String query = "SELECT * FROM " + TABLE_USUARIOS + 
                      " WHERE " + COL_USER_EMAIL + " = ? AND " + COL_USER_SENHA + " = ?";
        
        try (Cursor cursor = db.rawQuery(query, new String[]{email, senha})) {
            if (cursor.moveToFirst()) {
                usuario = new Usuario();
                usuario.setId(cursor.getInt(cursor.getColumnIndexOrThrow(COL_USER_ID)));
                usuario.setNome(cursor.getString(cursor.getColumnIndexOrThrow(COL_USER_NOME)));
                usuario.setCpf(cursor.getString(cursor.getColumnIndexOrThrow(COL_USER_CPF)));
                usuario.setTelefone(cursor.getString(cursor.getColumnIndexOrThrow(COL_USER_TELEFONE)));
                usuario.setEmail(cursor.getString(cursor.getColumnIndexOrThrow(COL_USER_EMAIL)));
                usuario.setSenha(cursor.getString(cursor.getColumnIndexOrThrow(COL_USER_SENHA)));
                usuario.setTipo(cursor.getString(cursor.getColumnIndexOrThrow(COL_USER_TIPO)));
                usuario.setDataCadastro(cursor.getLong(cursor.getColumnIndexOrThrow(COL_USER_DATA_CRIACAO)));
                
                Log.d(TAG, "Usuário autenticado: " + usuario.getNome());
            }
        } catch (Exception e) {
            Log.e(TAG, "Erro ao autenticar usuário: " + e.getMessage());
        } finally {
            db.close();
        }
        
        return usuario;
    }
    
    public boolean emailExists(String email) {
        SQLiteDatabase db = this.getReadableDatabase();
        boolean exists = false;
        
        String query = "SELECT COUNT(*) FROM " + TABLE_USUARIOS + " WHERE " + COL_USER_EMAIL + " = ?";
        
        try (Cursor cursor = db.rawQuery(query, new String[]{email})) {
            if (cursor.moveToFirst()) {
                exists = cursor.getInt(0) > 0;
            }
        } catch (Exception e) {
            Log.e(TAG, "Erro ao verificar e-mail: " + e.getMessage());
        } finally {
            db.close();
        }
        
        return exists;
    }
    
    public Usuario getUserById(int userId) {
        SQLiteDatabase db = this.getReadableDatabase();
        Usuario usuario = null;
        
        String query = "SELECT * FROM " + TABLE_USUARIOS + " WHERE " + COL_USER_ID + " = ?";
        
        try (Cursor cursor = db.rawQuery(query, new String[]{String.valueOf(userId)})) {
            if (cursor.moveToFirst()) {
                usuario = new Usuario();
                usuario.setId(cursor.getInt(cursor.getColumnIndexOrThrow(COL_USER_ID)));
                usuario.setNome(cursor.getString(cursor.getColumnIndexOrThrow(COL_USER_NOME)));
                usuario.setCpf(cursor.getString(cursor.getColumnIndexOrThrow(COL_USER_CPF)));
                usuario.setTelefone(cursor.getString(cursor.getColumnIndexOrThrow(COL_USER_TELEFONE)));
                usuario.setEmail(cursor.getString(cursor.getColumnIndexOrThrow(COL_USER_EMAIL)));
                usuario.setTipo(cursor.getString(cursor.getColumnIndexOrThrow(COL_USER_TIPO)));
                usuario.setDataCadastro(cursor.getLong(cursor.getColumnIndexOrThrow(COL_USER_DATA_CRIACAO)));
            }
        } catch (Exception e) {
            Log.e(TAG, "Erro ao buscar usuário por ID: " + e.getMessage());
        } finally {
            db.close();
        }
        
        return usuario;
    }
    
    // ===== MÉTODOS PARA ENTREGAS =====
    
    public long insertEntrega(Corrida corrida, int clienteId) {
        SQLiteDatabase db = this.getWritableDatabase();
        ContentValues values = new ContentValues();
        
        values.put(COL_ENTREGA_CLIENT_ID, clienteId);
        values.put(COL_ENTREGA_ENDERECO_COLETA, corrida.getEnderecoColeta());
        values.put(COL_ENTREGA_ENDERECO_ENTREGA, corrida.getEnderecoEntrega());
        values.put(COL_ENTREGA_DESCRICAO, corrida.getDescricao());
        values.put(COL_ENTREGA_VALOR, corrida.getValorFrete());
        values.put(COL_ENTREGA_STATUS, corrida.getStatus());
        values.put(COL_ENTREGA_TIMESTAMP, corrida.getTimestamp());
        
        try {
            long result = db.insert(TABLE_ENTREGAS, null, values);
            Log.d(TAG, "Entrega inserida com ID: " + result);
            return result;
        } catch (Exception e) {
            Log.e(TAG, "Erro ao inserir entrega: " + e.getMessage());
            return -1;
        } finally {
            db.close();
        }
    }
    
    public List<Corrida> getEntregasDisponiveis() {
        List<Corrida> entregas = new ArrayList<>();
        SQLiteDatabase db = this.getReadableDatabase();
        
        String query = "SELECT * FROM " + TABLE_ENTREGAS + 
                      " WHERE " + COL_ENTREGA_STATUS + " = 'AGUARDANDO'" +
                      " ORDER BY " + COL_ENTREGA_TIMESTAMP + " ASC";
        
        try (Cursor cursor = db.rawQuery(query, null)) {
            while (cursor.moveToNext()) {
                Corrida corrida = new Corrida();
                corrida.setId(cursor.getInt(cursor.getColumnIndexOrThrow(COL_ENTREGA_ID)));
                corrida.setEnderecoColeta(cursor.getString(cursor.getColumnIndexOrThrow(COL_ENTREGA_ENDERECO_COLETA)));
                corrida.setEnderecoEntrega(cursor.getString(cursor.getColumnIndexOrThrow(COL_ENTREGA_ENDERECO_ENTREGA)));
                corrida.setDescricao(cursor.getString(cursor.getColumnIndexOrThrow(COL_ENTREGA_DESCRICAO)));
                corrida.setValorFrete(cursor.getDouble(cursor.getColumnIndexOrThrow(COL_ENTREGA_VALOR)));
                corrida.setStatus(cursor.getString(cursor.getColumnIndexOrThrow(COL_ENTREGA_STATUS)));
                corrida.setTimestamp(cursor.getLong(cursor.getColumnIndexOrThrow(COL_ENTREGA_TIMESTAMP)));
                
                entregas.add(corrida);
            }
        } catch (Exception e) {
            Log.e(TAG, "Erro ao buscar entregas disponíveis: " + e.getMessage());
        } finally {
            db.close();
        }
        
        return entregas;
    }
    
    public boolean aceitarEntrega(int entregaId, int motoboyId) {
        SQLiteDatabase db = this.getWritableDatabase();
        ContentValues values = new ContentValues();
        
        values.put(COL_ENTREGA_MOTOBOY_ID, motoboyId);
        values.put(COL_ENTREGA_STATUS, "ACEITA");
        
        try {
            int rowsAffected = db.update(TABLE_ENTREGAS, values, 
                COL_ENTREGA_ID + " = ? AND " + COL_ENTREGA_STATUS + " = 'AGUARDANDO'",
                new String[]{String.valueOf(entregaId)});
            
            Log.d(TAG, "Entrega aceita. Linhas afetadas: " + rowsAffected);
            return rowsAffected > 0;
        } catch (Exception e) {
            Log.e(TAG, "Erro ao aceitar entrega: " + e.getMessage());
            return false;
        } finally {
            db.close();
        }
    }
    
    public boolean updateStatusEntrega(int entregaId, String novoStatus) {
        SQLiteDatabase db = this.getWritableDatabase();
        ContentValues values = new ContentValues();
        
        values.put(COL_ENTREGA_STATUS, novoStatus);
        
        try {
            int rowsAffected = db.update(TABLE_ENTREGAS, values, 
                COL_ENTREGA_ID + " = ?",
                new String[]{String.valueOf(entregaId)});
            
            Log.d(TAG, "Status da entrega atualizado. Linhas afetadas: " + rowsAffected);
            return rowsAffected > 0;
        } catch (Exception e) {
            Log.e(TAG, "Erro ao atualizar status da entrega: " + e.getMessage());
            return false;
        } finally {
            db.close();
        }
    }
    
    public List<Corrida> getEntregasPorCliente(int clienteId) {
        List<Corrida> entregas = new ArrayList<>();
        SQLiteDatabase db = this.getReadableDatabase();
        
        String query = "SELECT * FROM " + TABLE_ENTREGAS + 
                      " WHERE " + COL_ENTREGA_CLIENT_ID + " = ?" +
                      " ORDER BY " + COL_ENTREGA_TIMESTAMP + " DESC";
        
        try (Cursor cursor = db.rawQuery(query, new String[]{String.valueOf(clienteId)})) {
            while (cursor.moveToNext()) {
                Corrida corrida = new Corrida();
                corrida.setId(cursor.getInt(cursor.getColumnIndexOrThrow(COL_ENTREGA_ID)));
                corrida.setEnderecoColeta(cursor.getString(cursor.getColumnIndexOrThrow(COL_ENTREGA_ENDERECO_COLETA)));
                corrida.setEnderecoEntrega(cursor.getString(cursor.getColumnIndexOrThrow(COL_ENTREGA_ENDERECO_ENTREGA)));
                corrida.setDescricao(cursor.getString(cursor.getColumnIndexOrThrow(COL_ENTREGA_DESCRICAO)));
                corrida.setValorFrete(cursor.getDouble(cursor.getColumnIndexOrThrow(COL_ENTREGA_VALOR)));
                corrida.setStatus(cursor.getString(cursor.getColumnIndexOrThrow(COL_ENTREGA_STATUS)));
                corrida.setTimestamp(cursor.getLong(cursor.getColumnIndexOrThrow(COL_ENTREGA_TIMESTAMP)));
                
                entregas.add(corrida);
            }
        } catch (Exception e) {
            Log.e(TAG, "Erro ao buscar entregas do cliente: " + e.getMessage());
        } finally {
            db.close();
        }
        
        return entregas;
    }
    
    public List<Corrida> getEntregasPorMotoboy(int motoboyId) {
        List<Corrida> entregas = new ArrayList<>();
        SQLiteDatabase db = this.getReadableDatabase();
        
        String query = "SELECT * FROM " + TABLE_ENTREGAS + 
                      " WHERE " + COL_ENTREGA_MOTOBOY_ID + " = ?" +
                      " ORDER BY " + COL_ENTREGA_TIMESTAMP + " DESC";
        
        try (Cursor cursor = db.rawQuery(query, new String[]{String.valueOf(motoboyId)})) {
            while (cursor.moveToNext()) {
                Corrida corrida = new Corrida();
                corrida.setId(cursor.getInt(cursor.getColumnIndexOrThrow(COL_ENTREGA_ID)));
                corrida.setEnderecoColeta(cursor.getString(cursor.getColumnIndexOrThrow(COL_ENTREGA_ENDERECO_COLETA)));
                corrida.setEnderecoEntrega(cursor.getString(cursor.getColumnIndexOrThrow(COL_ENTREGA_ENDERECO_ENTREGA)));
                corrida.setDescricao(cursor.getString(cursor.getColumnIndexOrThrow(COL_ENTREGA_DESCRICAO)));
                corrida.setValorFrete(cursor.getDouble(cursor.getColumnIndexOrThrow(COL_ENTREGA_VALOR)));
                corrida.setStatus(cursor.getString(cursor.getColumnIndexOrThrow(COL_ENTREGA_STATUS)));
                corrida.setTimestamp(cursor.getLong(cursor.getColumnIndexOrThrow(COL_ENTREGA_TIMESTAMP)));
                
                entregas.add(corrida);
            }
        } catch (Exception e) {
            Log.e(TAG, "Erro ao buscar entregas do motoboy: " + e.getMessage());
        } finally {
            db.close();
        }
        
        return entregas;
    }
}

