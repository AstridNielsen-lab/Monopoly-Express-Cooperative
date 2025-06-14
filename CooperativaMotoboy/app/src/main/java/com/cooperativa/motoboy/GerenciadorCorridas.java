package com.cooperativa.motoboy;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

public class GerenciadorCorridas {
    private static GerenciadorCorridas instance;
    private List<Corrida> corridas;
    private AtomicInteger proximoId;

    private GerenciadorCorridas() {
        corridas = new ArrayList<>();
        proximoId = new AtomicInteger(1);
    }

    public static synchronized GerenciadorCorridas getInstance() {
        if (instance == null) {
            instance = new GerenciadorCorridas();
        }
        return instance;
    }

    public Corrida adicionarCorrida(String enderecoColeta, String enderecoEntrega, String descricao, double valorFrete) {
        int id = proximoId.getAndIncrement();
        Corrida novaCorrida = new Corrida(id, enderecoColeta, enderecoEntrega, descricao, valorFrete);
        corridas.add(novaCorrida);
        return novaCorrida;
    }

    public List<Corrida> getCorridasDisponiveis() {
        List<Corrida> disponiveis = new ArrayList<>();
        for (Corrida corrida : corridas) {
            if (Corrida.STATUS_AGUARDANDO.equals(corrida.getStatus())) {
                disponiveis.add(corrida);
            }
        }
        return disponiveis;
    }

    public boolean aceitarCorrida(int corridaId) {
        for (Corrida corrida : corridas) {
            if (corrida.getId() == corridaId && Corrida.STATUS_AGUARDANDO.equals(corrida.getStatus())) {
                corrida.setStatus(Corrida.STATUS_ACEITA);
                return true;
            }
        }
        return false;
    }

    public boolean atualizarStatusCorrida(int corridaId, String novoStatus) {
        for (Corrida corrida : corridas) {
            if (corrida.getId() == corridaId) {
                corrida.setStatus(novoStatus);
                return true;
            }
        }
        return false;
    }

    public Corrida buscarCorridaPorId(int id) {
        for (Corrida corrida : corridas) {
            if (corrida.getId() == id) {
                return corrida;
            }
        }
        return null;
    }

    public List<Corrida> getTodasCorridas() {
        return new ArrayList<>(corridas);
    }

    public void limparCorridas() {
        corridas.clear();
        proximoId.set(1);
    }
    
    // Método para adicionar dados de teste
    public void adicionarDadosTeste() {
        if (corridas.isEmpty()) {
            adicionarCorrida("Rua das Flores, 123 - Centro", "Av. Brasil, 456 - Zona Sul", "Entrega de documentos", 25.50);
            adicionarCorrida("Shopping Center Norte", "Rua Augusta, 789 - Centro", "Entrega de medicamentos", 18.75);
            adicionarCorrida("Terminal Rodoviário", "Av. Paulista, 1000", "Entrega de encomenda", 32.00);
            adicionarCorrida("Aeroporto Internacional", "Bairro Vila Nova", "Transporte de bagagem", 45.00);
        }
    }
}

