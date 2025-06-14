package com.cooperativa.motoboy.database;

import java.util.Date;

public class Entrega {
    private int id;
    private int clienteId;
    private int motoboyId;
    private String enderecoColeta;
    private String enderecoEntrega;
    private String descricao;
    private double valor;
    private String status;
    private double distancia;
    private Date dataSolicitacao;
    private long timestamp;
    
    // Constantes para status
    public static final String STATUS_AGUARDANDO_MOTOBOY = "AGUARDANDO_MOTOBOY";
    public static final String STATUS_EM_ANDAMENTO = "EM_ANDAMENTO";
    public static final String STATUS_FINALIZADA = "FINALIZADA";
    public static final String STATUS_CANCELADA = "CANCELADA";
    
    // Construtor vazio
    public Entrega() {
        this.timestamp = System.currentTimeMillis();
        this.dataSolicitacao = new Date(this.timestamp);
        this.status = STATUS_AGUARDANDO_MOTOBOY;
    }
    
    // Construtor completo
    public Entrega(int id, int clienteId, int motoboyId, String enderecoColeta, 
                   String enderecoEntrega, String descricao, double valor, 
                   String status, double distancia, long timestamp) {
        this.id = id;
        this.clienteId = clienteId;
        this.motoboyId = motoboyId;
        this.enderecoColeta = enderecoColeta;
        this.enderecoEntrega = enderecoEntrega;
        this.descricao = descricao;
        this.valor = valor;
        this.status = status;
        this.distancia = distancia;
        this.timestamp = timestamp;
        this.dataSolicitacao = new Date(timestamp);
    }
    
    // Getters e Setters
    public int getId() {
        return id;
    }
    
    public void setId(int id) {
        this.id = id;
    }
    
    public int getClienteId() {
        return clienteId;
    }
    
    public void setClienteId(int clienteId) {
        this.clienteId = clienteId;
    }
    
    public int getMotoboyId() {
        return motoboyId;
    }
    
    public void setMotoboyId(int motoboyId) {
        this.motoboyId = motoboyId;
    }
    
    public String getEnderecoColeta() {
        return enderecoColeta;
    }
    
    public void setEnderecoColeta(String enderecoColeta) {
        this.enderecoColeta = enderecoColeta;
    }
    
    public String getEnderecoEntrega() {
        return enderecoEntrega;
    }
    
    public void setEnderecoEntrega(String enderecoEntrega) {
        this.enderecoEntrega = enderecoEntrega;
    }
    
    public String getDescricao() {
        return descricao;
    }
    
    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }
    
    public double getValor() {
        return valor;
    }
    
    public void setValor(double valor) {
        this.valor = valor;
    }
    
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }
    
    public double getDistancia() {
        return distancia;
    }
    
    public void setDistancia(double distancia) {
        this.distancia = distancia;
    }
    
    public Date getDataSolicitacao() {
        return dataSolicitacao;
    }
    
    public void setDataSolicitacao(Date dataSolicitacao) {
        this.dataSolicitacao = dataSolicitacao;
        if (dataSolicitacao != null) {
            this.timestamp = dataSolicitacao.getTime();
        }
    }
    
    public long getTimestamp() {
        return timestamp;
    }
    
    public void setTimestamp(long timestamp) {
        this.timestamp = timestamp;
        this.dataSolicitacao = new Date(timestamp);
    }
    
    // Métodos auxiliares
    public boolean isDisponivel() {
        return STATUS_AGUARDANDO_MOTOBOY.equals(status);
    }
    
    public boolean isEmAndamento() {
        return STATUS_EM_ANDAMENTO.equals(status);
    }
    
    public boolean isFinalizada() {
        return STATUS_FINALIZADA.equals(status);
    }
    
    public boolean isCancelada() {
        return STATUS_CANCELADA.equals(status);
    }
    
    public String getStatusFormatado() {
        switch (status) {
            case STATUS_AGUARDANDO_MOTOBOY:
                return "Aguardando Motoboy";
            case STATUS_EM_ANDAMENTO:
                return "Em Andamento";
            case STATUS_FINALIZADA:
                return "Finalizada";
            case STATUS_CANCELADA:
                return "Cancelada";
            default:
                return status;
        }
    }
    
    @Override
    public String toString() {
        return "Entrega{" +
                "id=" + id +
                ", clienteId=" + clienteId +
                ", motoboyId=" + motoboyId +
                ", enderecoColeta='" + enderecoColeta + '\'' +
                ", enderecoEntrega='" + enderecoEntrega + '\'' +
                ", valor=" + valor +
                ", status='" + status + '\'' +
                ", distancia=" + distancia +
                '}';
    }
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        
        Entrega entrega = (Entrega) o;
        return id == entrega.id;
    }
    
    @Override
    public int hashCode() {
        return id;
    }
}

