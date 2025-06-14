package com.cooperativa.motoboy;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;
import com.google.android.material.button.MaterialButton;
import java.text.NumberFormat;
import java.util.List;
import java.util.Locale;

public class CorridaAdapter extends RecyclerView.Adapter<CorridaAdapter.CorridaViewHolder> {

    private List<Corrida> corridas;
    private OnCorridaClickListener listener;

    public interface OnCorridaClickListener {
        void onAceitarCorrida(Corrida corrida);
    }

    public CorridaAdapter(List<Corrida> corridas, OnCorridaClickListener listener) {
        this.corridas = corridas;
        this.listener = listener;
    }

    @NonNull
    @Override
    public CorridaViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.item_corrida, parent, false);
        return new CorridaViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull CorridaViewHolder holder, int position) {
        Corrida corrida = corridas.get(position);
        holder.bind(corrida);
    }

    @Override
    public int getItemCount() {
        return corridas.size();
    }

    public void updateCorridas(List<Corrida> novasCorridas) {
        this.corridas = novasCorridas;
        notifyDataSetChanged();
    }

    class CorridaViewHolder extends RecyclerView.ViewHolder {
        private TextView tvId;
        private TextView tvColeta;
        private TextView tvEnderecoColeta;
        private TextView tvEntrega;
        private TextView tvEnderecoEntrega;
        private TextView tvDescricao;
        private TextView tvValor;
        private MaterialButton btnAceitarCorrida;

        public CorridaViewHolder(@NonNull View itemView) {
            super(itemView);
            
            tvId = itemView.findViewById(R.id.tvId);
            tvColeta = itemView.findViewById(R.id.tvColeta);
            tvEnderecoColeta = itemView.findViewById(R.id.tvEnderecoColeta);
            tvEntrega = itemView.findViewById(R.id.tvEntrega);
            tvEnderecoEntrega = itemView.findViewById(R.id.tvEnderecoEntrega);
            tvDescricao = itemView.findViewById(R.id.tvDescricao);
            tvValor = itemView.findViewById(R.id.tvValor);
            btnAceitarCorrida = itemView.findViewById(R.id.btnAceitarCorrida);
        }

        public void bind(Corrida corrida) {
            tvId.setText("Corrida #" + corrida.getId());
            tvEnderecoColeta.setText(corrida.getEnderecoColeta());
            tvEnderecoEntrega.setText(corrida.getEnderecoEntrega());
            
            if (corrida.getDescricao() != null && !corrida.getDescricao().isEmpty()) {
                tvDescricao.setText(corrida.getDescricao());
                tvDescricao.setVisibility(View.VISIBLE);
            } else {
                tvDescricao.setVisibility(View.GONE);
            }
            
            NumberFormat currencyFormat = NumberFormat.getCurrencyInstance(new Locale("pt", "BR"));
            tvValor.setText("Valor: " + currencyFormat.format(corrida.getValorFrete()));
            
            btnAceitarCorrida.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    if (listener != null) {
                        listener.onAceitarCorrida(corrida);
                    }
                }
            });
        }
    }
}

