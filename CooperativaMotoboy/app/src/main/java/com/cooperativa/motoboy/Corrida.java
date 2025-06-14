package com.cooperativa.motoboy;

public class Corrida {
    private int id;
    private String enderecoColeta;
    private String enderecoEntrega;
    private String descricao;
    private double valorFrete;
    private String status;
    private long timestamp;

    // Status possíveis
    public static final String STATUS_AGUARDANDO = "AGUARDANDO";
    public static final String STATUS_ACEITA = "ACEITA";
    public static final String STATUS_COLETADO = "COLETADO";
    public static final String STATUS_ENTREGUE = "ENTREGUE";

    public Corrida() {
        this.timestamp = System.currentTimeMillis();
        this.status = STATUS_AGUARDANDO;
    }

    public Corrida(int id, String enderecoColeta, String enderecoEntrega, String descricao, double valorFrete) {
        this.id = id;
        this.enderecoColeta = enderecoColeta;
        this.enderecoEntrega = enderecoEntrega;
        this.descricao = descricao;
        this.valorFrete = valorFrete;
        this.status = STATUS_AGUARDANDO;
        this.timestamp = System.currentTimeMillis();
    }

    // Getters e Setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
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

    public double getValorFrete() {
        return valorFrete;
    }

    public void setValorFrete(double valorFrete) {
        this.valorFrete = valorFrete;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public long getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(long timestamp) {
        this.timestamp = timestamp;
    }

    @Override
    public String toString() {
        return "Corrida{" +
                "id=" + id +
                ", enderecoColeta='" + enderecoColeta + '\'' +
                ", enderecoEntrega='" + enderecoEntrega + '\'' +
                ", descricao='" + descricao + '\'' +
                ", valorFrete=" + valorFrete +
                ", status='" + status + '\'' +
                ", timestamp=" + timestamp +
                '}';
    }
}

