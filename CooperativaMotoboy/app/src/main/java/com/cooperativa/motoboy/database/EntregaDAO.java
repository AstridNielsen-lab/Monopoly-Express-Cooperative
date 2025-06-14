package com.cooperativa.motoboy.database;

import android.content.ContentValues;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.util.Log;

import java.util.ArrayList;
import java.util.List;

public class EntregaDAO {
    
    private static final String TAG = "EntregaDAO";
    private final DatabaseHelper dbHelper;
    
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
    
    public EntregaDAO(DatabaseHelper dbHelper) {
        this.dbHelper = dbHelper;
    }
    
    // Inserir nova entrega
    public long inserir(Entrega entrega) {
        SQLiteDatabase db = dbHelper.getWritableDatabase();
        ContentValues values = new ContentValues();
        
        values.put(COL_ENTREGA_CLIENT_ID, entrega.getClienteId());
        values.put(COL_ENTREGA_MOTOBOY_ID, entrega.getMotoboyId());
        values.put(COL_ENTREGA_ENDERECO_COLETA, entrega.getEnderecoColeta());
        values.put(COL_ENTREGA_ENDERECO_ENTREGA, entrega.getEnderecoEntrega());
        values.put(COL_ENTREGA_DESCRICAO, entrega.getDescricao());
        values.put(COL_ENTREGA_VALOR, entrega.getValor());
        values.put(COL_ENTREGA_STATUS, entrega.getStatus());
        values.put(COL_ENTREGA_DISTANCIA, entrega.getDistancia());
        values.put(COL_ENTREGA_TIMESTAMP, entrega.getTimestamp());
        
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
    
    // Atualizar entrega existente
    public boolean atualizar(Entrega entrega) {
        SQLiteDatabase db = dbHelper.getWritableDatabase();
        ContentValues values = new ContentValues();
        
        values.put(COL_ENTREGA_CLIENT_ID, entrega.getClienteId());
        values.put(COL_ENTREGA_MOTOBOY_ID, entrega.getMotoboyId());
        values.put(COL_ENTREGA_ENDERECO_COLETA, entrega.getEnderecoColeta());
        values.put(COL_ENTREGA_ENDERECO_ENTREGA, entrega.getEnderecoEntrega());
        values.put(COL_ENTREGA_DESCRICAO, entrega.getDescricao());
        values.put(COL_ENTREGA_VALOR, entrega.getValor());
        values.put(COL_ENTREGA_STATUS, entrega.getStatus());
        values.put(COL_ENTREGA_DISTANCIA, entrega.getDistancia());
        
        try {
            int rowsAffected = db.update(TABLE_ENTREGAS, values, 
                COL_ENTREGA_ID + " = ?", new String[]{String.valueOf(entrega.getId())});
            
            Log.d(TAG, "Entrega atualizada. Linhas afetadas: " + rowsAffected);
            return rowsAffected > 0;
        } catch (Exception e) {
            Log.e(TAG, "Erro ao atualizar entrega: " + e.getMessage());
            return false;
        } finally {
            db.close();
        }
    }
    
    // Buscar entrega por ID
    public Entrega buscarPorId(int id) {
        SQLiteDatabase db = dbHelper.getReadableDatabase();
        Entrega entrega = null;
        
        String query = "SELECT * FROM " + TABLE_ENTREGAS + " WHERE " + COL_ENTREGA_ID + " = ?";
        
        try (Cursor cursor = db.rawQuery(query, new String[]{String.valueOf(id)})) {
            if (cursor.moveToFirst()) {
                entrega = criarEntregaDoCursor(cursor);
            }
        } catch (Exception e) {
            Log.e(TAG, "Erro ao buscar entrega por ID: " + e.getMessage());
        } finally {
            db.close();
        }
        
        return entrega;
    }
    
    // Buscar todas as entregas
    public List<Entrega> buscarTodas() {
        List<Entrega> entregas = new ArrayList<>();
        SQLiteDatabase db = dbHelper.getReadableDatabase();
        
        String query = "SELECT * FROM " + TABLE_ENTREGAS + " ORDER BY " + COL_ENTREGA_TIMESTAMP + " DESC";
        
        try (Cursor cursor = db.rawQuery(query, null)) {
            while (cursor.moveToNext()) {
                entregas.add(criarEntregaDoCursor(cursor));
            }
        } catch (Exception e) {
            Log.e(TAG, "Erro ao buscar todas as entregas: " + e.getMessage());
        } finally {
            db.close();
        }
        
        return entregas;
    }
    
    // Buscar entregas por status
    public List<Entrega> buscarPorStatus(String status) {
        List<Entrega> entregas = new ArrayList<>();
        SQLiteDatabase db = dbHelper.getReadableDatabase();
        
        String query = "SELECT * FROM " + TABLE_ENTREGAS + 
                      " WHERE " + COL_ENTREGA_STATUS + " = ?" +
                      " ORDER BY " + COL_ENTREGA_TIMESTAMP + " DESC";
        
        try (Cursor cursor = db.rawQuery(query, new String[]{status})) {
            while (cursor.moveToNext()) {
                entregas.add(criarEntregaDoCursor(cursor));
            }
        } catch (Exception e) {
            Log.e(TAG, "Erro ao buscar entregas por status: " + e.getMessage());
        } finally {
            db.close();
        }
        
        return entregas;
    }
    
    // Buscar entregas do cliente
    public List<Entrega> buscarPorCliente(int clienteId) {
        List<Entrega> entregas = new ArrayList<>();
        SQLiteDatabase db = dbHelper.getReadableDatabase();
        
        String query = "SELECT * FROM " + TABLE_ENTREGAS + 
                      " WHERE " + COL_ENTREGA_CLIENT_ID + " = ?" +
                      " ORDER BY " + COL_ENTREGA_TIMESTAMP + " DESC";
        
        try (Cursor cursor = db.rawQuery(query, new String[]{String.valueOf(clienteId)})) {
            while (cursor.moveToNext()) {
                entregas.add(criarEntregaDoCursor(cursor));
            }
        } catch (Exception e) {
            Log.e(TAG, "Erro ao buscar entregas do cliente: " + e.getMessage());
        } finally {
            db.close();
        }
        
        return entregas;
    }
    
    // Buscar entregas do motoboy
    public List<Entrega> buscarPorMotoboy(int motoboyId) {
        List<Entrega> entregas = new ArrayList<>();
        SQLiteDatabase db = dbHelper.getReadableDatabase();
        
        String query = "SELECT * FROM " + TABLE_ENTREGAS + 
                      " WHERE " + COL_ENTREGA_MOTOBOY_ID + " = ?" +
                      " ORDER BY " + COL_ENTREGA_TIMESTAMP + " DESC";
        
        try (Cursor cursor = db.rawQuery(query, new String[]{String.valueOf(motoboyId)})) {
            while (cursor.moveToNext()) {
                entregas.add(criarEntregaDoCursor(cursor));
            }
        } catch (Exception e) {
            Log.e(TAG, "Erro ao buscar entregas do motoboy: " + e.getMessage());
        } finally {
            db.close();
        }
        
        return entregas;
    }
    
    // Buscar entregas disponíveis (aguardando motoboy)
    public List<Entrega> buscarDisponiveis() {
        return buscarPorStatus(Entrega.STATUS_AGUARDANDO_MOTOBOY);
    }
    
    // Aceitar entrega (motoboy pega a entrega)
    public boolean aceitarEntrega(int entregaId, int motoboyId) {
        SQLiteDatabase db = dbHelper.getWritableDatabase();
        ContentValues values = new ContentValues();
        
        values.put(COL_ENTREGA_MOTOBOY_ID, motoboyId);
        values.put(COL_ENTREGA_STATUS, Entrega.STATUS_EM_ANDAMENTO);
        
        try {
            int rowsAffected = db.update(TABLE_ENTREGAS, values, 
                COL_ENTREGA_ID + " = ? AND " + COL_ENTREGA_STATUS + " = ?",
                new String[]{String.valueOf(entregaId), Entrega.STATUS_AGUARDANDO_MOTOBOY});
            
            Log.d(TAG, "Entrega aceita. Linhas afetadas: " + rowsAffected);
            return rowsAffected > 0;
        } catch (Exception e) {
            Log.e(TAG, "Erro ao aceitar entrega: " + e.getMessage());
            return false;
        } finally {
            db.close();
        }
    }
    
    // Finalizar entrega
    public boolean finalizarEntrega(int entregaId) {
        return atualizarStatus(entregaId, Entrega.STATUS_FINALIZADA);
    }
    
    // Cancelar entrega
    public boolean cancelarEntrega(int entregaId) {
        return atualizarStatus(entregaId, Entrega.STATUS_CANCELADA);
    }
    
    // Atualizar status da entrega
    public boolean atualizarStatus(int entregaId, String novoStatus) {
        SQLiteDatabase db = dbHelper.getWritableDatabase();
        ContentValues values = new ContentValues();
        
        values.put(COL_ENTREGA_STATUS, novoStatus);
        
        try {
            int rowsAffected = db.update(TABLE_ENTREGAS, values, 
                COL_ENTREGA_ID + " = ?", new String[]{String.valueOf(entregaId)});
            
            Log.d(TAG, "Status da entrega atualizado para: " + novoStatus + ". Linhas afetadas: " + rowsAffected);
            return rowsAffected > 0;
        } catch (Exception e) {
            Log.e(TAG, "Erro ao atualizar status da entrega: " + e.getMessage());
            return false;
        } finally {
            db.close();
        }
    }
    
    // Deletar entrega
    public boolean deletar(int entregaId) {
        SQLiteDatabase db = dbHelper.getWritableDatabase();
        
        try {
            int rowsAffected = db.delete(TABLE_ENTREGAS, 
                COL_ENTREGA_ID + " = ?", new String[]{String.valueOf(entregaId)});
            
            Log.d(TAG, "Entrega deletada. Linhas afetadas: " + rowsAffected);
            return rowsAffected > 0;
        } catch (Exception e) {
            Log.e(TAG, "Erro ao deletar entrega: " + e.getMessage());
            return false;
        } finally {
            db.close();
        }
    }
    
    // Contar entregas por status
    public int contarPorStatus(String status) {
        SQLiteDatabase db = dbHelper.getReadableDatabase();
        int count = 0;
        
        String query = "SELECT COUNT(*) FROM " + TABLE_ENTREGAS + " WHERE " + COL_ENTREGA_STATUS + " = ?";
        
        try (Cursor cursor = db.rawQuery(query, new String[]{status})) {
            if (cursor.moveToFirst()) {
                count = cursor.getInt(0);
            }
        } catch (Exception e) {
            Log.e(TAG, "Erro ao contar entregas por status: " + e.getMessage());
        } finally {
            db.close();
        }
        
        return count;
    }
    
    // Contar entregas do motoboy por status
    public int contarPorMotoboyEStatus(int motoboyId, String status) {
        SQLiteDatabase db = dbHelper.getReadableDatabase();
        int count = 0;
        
        String query = "SELECT COUNT(*) FROM " + TABLE_ENTREGAS + 
                      " WHERE " + COL_ENTREGA_MOTOBOY_ID + " = ? AND " + COL_ENTREGA_STATUS + " = ?";
        
        try (Cursor cursor = db.rawQuery(query, new String[]{String.valueOf(motoboyId), status})) {
            if (cursor.moveToFirst()) {
                count = cursor.getInt(0);
            }
        } catch (Exception e) {
            Log.e(TAG, "Erro ao contar entregas do motoboy por status: " + e.getMessage());
        } finally {
            db.close();
        }
        
        return count;
    }
    
    // Método auxiliar para criar objeto Entrega a partir do Cursor
    private Entrega criarEntregaDoCursor(Cursor cursor) {
        Entrega entrega = new Entrega();
        
        entrega.setId(cursor.getInt(cursor.getColumnIndexOrThrow(COL_ENTREGA_ID)));
        entrega.setClienteId(cursor.getInt(cursor.getColumnIndexOrThrow(COL_ENTREGA_CLIENT_ID)));
        
        int motoboyIdIndex = cursor.getColumnIndex(COL_ENTREGA_MOTOBOY_ID);
        if (motoboyIdIndex != -1 && !cursor.isNull(motoboyIdIndex)) {
            entrega.setMotoboyId(cursor.getInt(motoboyIdIndex));
        }
        
        entrega.setEnderecoColeta(cursor.getString(cursor.getColumnIndexOrThrow(COL_ENTREGA_ENDERECO_COLETA)));
        entrega.setEnderecoEntrega(cursor.getString(cursor.getColumnIndexOrThrow(COL_ENTREGA_ENDERECO_ENTREGA)));
        
        int descricaoIndex = cursor.getColumnIndex(COL_ENTREGA_DESCRICAO);
        if (descricaoIndex != -1 && !cursor.isNull(descricaoIndex)) {
            entrega.setDescricao(cursor.getString(descricaoIndex));
        }
        
        entrega.setValor(cursor.getDouble(cursor.getColumnIndexOrThrow(COL_ENTREGA_VALOR)));
        entrega.setStatus(cursor.getString(cursor.getColumnIndexOrThrow(COL_ENTREGA_STATUS)));
        
        int distanciaIndex = cursor.getColumnIndex(COL_ENTREGA_DISTANCIA);
        if (distanciaIndex != -1 && !cursor.isNull(distanciaIndex)) {
            entrega.setDistancia(cursor.getDouble(distanciaIndex));
        }
        
        entrega.setTimestamp(cursor.getLong(cursor.getColumnIndexOrThrow(COL_ENTREGA_TIMESTAMP)));
        
        return entrega;
    }
}

