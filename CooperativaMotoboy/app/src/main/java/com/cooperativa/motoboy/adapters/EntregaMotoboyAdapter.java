package com.cooperativa.motoboy.adapters;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;
import com.cooperativa.motoboy.R;
import com.cooperativa.motoboy.database.Entrega;
import com.google.android.material.button.MaterialButton;

import java.text.NumberFormat;
import java.text.SimpleDateFormat;
import java.util.List;
import java.util.Locale;

public class EntregaMotoboyAdapter extends RecyclerView.Adapter<EntregaMotoboyAdapter.EntregaViewHolder> {
    
    private final Context context;
    private final List<Entrega> entregas;
    private final OnEntregaClickListener listener;
    private final NumberFormat currencyFormat;
    private final SimpleDateFormat dateFormat;
    
    public interface OnEntregaClickListener {
        void onAceitarEntrega(Entrega entrega);
        void onVerRota(Entrega entrega);
    }
    
    public EntregaMotoboyAdapter(Context context, List<Entrega> entregas, OnEntregaClickListener listener) {
        this.context = context;
        this.entregas = entregas;
        this.listener = listener;
        this.currencyFormat = NumberFormat.getCurrencyInstance(new Locale("pt", "BR"));
        this.dateFormat = new SimpleDateFormat("dd/MM/yyyy - HH:mm", Locale.getDefault());
    }
    
    @NonNull
    @Override
    public EntregaViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(context).inflate(R.layout.item_entrega_motoboy, parent, false);
        return new EntregaViewHolder(view);
    }
    
    @Override
    public void onBindViewHolder(@NonNull EntregaViewHolder holder, int position) {
        Entrega entrega = entregas.get(position);
        holder.bind(entrega);
    }
    
    @Override
    public int getItemCount() {
        return entregas.size();
    }
    
    public void updateEntregas(List<Entrega> novasEntregas) {
        this.entregas.clear();
        this.entregas.addAll(novasEntregas);
        notifyDataSetChanged();
    }
    
    class EntregaViewHolder extends RecyclerView.ViewHolder {
        private final TextView tvEntregaId;
        private final TextView tvDataHora;
        private final TextView tvValor;
        private final TextView tvEnderecoColeta;
        private final TextView tvEnderecoEntrega;
        private final TextView tvDistancia;
        private final TextView tvTempo;
        private final TextView tvStatus;
        private final MaterialButton btnAceitarEntrega;
        private final MaterialButton btnVerRota;
        
        public EntregaViewHolder(@NonNull View itemView) {
            super(itemView);
            
            tvEntregaId = itemView.findViewById(R.id.tvEntregaId);
            tvDataHora = itemView.findViewById(R.id.tvDataHora);
            tvValor = itemView.findViewById(R.id.tvValor);
            tvEnderecoColeta = itemView.findViewById(R.id.tvEnderecoColeta);
            tvEnderecoEntrega = itemView.findViewById(R.id.tvEnderecoEntrega);
            tvDistancia = itemView.findViewById(R.id.tvDistancia);
            tvTempo = itemView.findViewById(R.id.tvTempo);
            tvStatus = itemView.findViewById(R.id.tvStatus);
            btnAceitarEntrega = itemView.findViewById(R.id.btnAceitarEntrega);
            btnVerRota = itemView.findViewById(R.id.btnVerRota);
        }
        
        public void bind(Entrega entrega) {
            // Informações básicas
            tvEntregaId.setText("Entrega #" + String.format("%03d", entrega.getId()));
            tvDataHora.setText(dateFormat.format(entrega.getDataSolicitacao()));
            tvValor.setText(currencyFormat.format(entrega.getValor()));
            
            // Endereços
            tvEnderecoColeta.setText(entrega.getEnderecoColeta());
            tvEnderecoEntrega.setText(entrega.getEnderecoEntrega());
            
            // Informações da rota
            tvDistancia.setText(String.format("%.1f km", entrega.getDistancia()));
            
            // Calcular tempo estimado (assumindo 40 km/h de velocidade média)
            int tempoEstimado = (int) Math.round((entrega.getDistancia() / 40.0) * 60);
            tvTempo.setText(tempoEstimado + " min");
            
            // Status
            String status = entrega.getStatus();
            tvStatus.setText(getStatusText(status));
            tvStatus.setTextColor(getStatusColor(status));
            
            // Configurar botões baseado no status
            configurarBotoes(entrega, status);
            
            // Listeners dos botões
            btnAceitarEntrega.setOnClickListener(v -> {
                if (listener != null) {
                    listener.onAceitarEntrega(entrega);
                }
            });
            
            btnVerRota.setOnClickListener(v -> {
                if (listener != null) {
                    listener.onVerRota(entrega);
                }
            });
        }
        
        private void configurarBotoes(Entrega entrega, String status) {
            switch (status) {
                case "AGUARDANDO_MOTOBOY":
                    btnAceitarEntrega.setText("✅ Aceitar");
                    btnAceitarEntrega.setVisibility(View.VISIBLE);
                    btnAceitarEntrega.setEnabled(true);
                    btnVerRota.setText("🗺️ Ver Rota");
                    btnVerRota.setVisibility(View.VISIBLE);
                    break;
                    
                case "EM_ANDAMENTO":
                    btnAceitarEntrega.setText("🏁 Finalizar");
                    btnAceitarEntrega.setVisibility(View.VISIBLE);
                    btnAceitarEntrega.setEnabled(true);
                    btnVerRota.setText("🗺️ Ver Rota");
                    btnVerRota.setVisibility(View.VISIBLE);
                    break;
                    
                case "FINALIZADA":
                    btnAceitarEntrega.setText("✅ Finalizada");
                    btnAceitarEntrega.setVisibility(View.VISIBLE);
                    btnAceitarEntrega.setEnabled(false);
                    btnVerRota.setVisibility(View.GONE);
                    break;
                    
                default:
                    btnAceitarEntrega.setVisibility(View.GONE);
                    btnVerRota.setVisibility(View.GONE);
                    break;
            }
        }
        
        private String getStatusText(String status) {
            switch (status) {
                case "AGUARDANDO_MOTOBOY":
                    return "Aguardando";
                case "EM_ANDAMENTO":
                    return "Em Andamento";
                case "FINALIZADA":
                    return "Finalizada";
                case "CANCELADA":
                    return "Cancelada";
                default:
                    return status;
            }
        }
        
        private int getStatusColor(String status) {
            switch (status) {
                case "AGUARDANDO_MOTOBOY":
                    return context.getColor(R.color.warning_color);
                case "EM_ANDAMENTO":
                    return context.getColor(R.color.primary_color);
                case "FINALIZADA":
                    return context.getColor(R.color.success_color);
                case "CANCELADA":
                    return context.getColor(R.color.error_color);
                default:
                    return context.getColor(R.color.text_secondary);
            }
        }
    }
}

