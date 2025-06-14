package com.cooperativa.motoboy;

import android.os.Bundle;
import android.view.View;
import android.widget.TextView;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import com.google.android.material.button.MaterialButton;
import java.util.ArrayList;
import java.util.List;

public class MotoboyActivity extends AppCompatActivity implements CorridaAdapter.OnCorridaClickListener {

    private RecyclerView rvCorridas;
    private TextView tvNenhumaCorrida;
    private MaterialButton btnAtualizarCorridas;
    
    private CorridaAdapter adapter;
    private GerenciadorCorridas gerenciadorCorridas;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_motoboy);

        initViews();
        setupRecyclerView();
        setupClickListeners();
        
        gerenciadorCorridas = GerenciadorCorridas.getInstance();
        
        // Configurar action bar
        if (getSupportActionBar() != null) {
            getSupportActionBar().setTitle("Monopoly Express - Motoboy");
            getSupportActionBar().setDisplayHomeAsUpEnabled(true);
        }
        
        // Carregar corridas
        carregarCorridas();
    }

    private void initViews() {
        rvCorridas = findViewById(R.id.rvCorridas);
        tvNenhumaCorrida = findViewById(R.id.tvNenhumaCorrida);
        btnAtualizarCorridas = findViewById(R.id.btnAtualizarCorridas);
    }

    private void setupRecyclerView() {
        rvCorridas.setLayoutManager(new LinearLayoutManager(this));
        // Inicializar adapter com lista vazia, será atualizada no carregarCorridas()
        adapter = new CorridaAdapter(new ArrayList<>(), this);
        rvCorridas.setAdapter(adapter);
    }

    private void setupClickListeners() {
        btnAtualizarCorridas.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                carregarCorridas();
                Toast.makeText(MotoboyActivity.this, "Lista atualizada", Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void carregarCorridas() {
        if (gerenciadorCorridas == null) {
            gerenciadorCorridas = GerenciadorCorridas.getInstance();
        }
        
        List<Corrida> corridasDisponiveis = gerenciadorCorridas.getCorridasDisponiveis();
        
        if (corridasDisponiveis.isEmpty()) {
            rvCorridas.setVisibility(View.GONE);
            tvNenhumaCorrida.setVisibility(View.VISIBLE);
        } else {
            rvCorridas.setVisibility(View.VISIBLE);
            tvNenhumaCorrida.setVisibility(View.GONE);
            adapter.updateCorridas(corridasDisponiveis);
        }
    }

    @Override
    public void onAceitarCorrida(Corrida corrida) {
        boolean sucesso = gerenciadorCorridas.aceitarCorrida(corrida.getId());
        
        if (sucesso) {
            Toast.makeText(this, 
                "Corrida #" + corrida.getId() + " aceita com sucesso!", 
                Toast.LENGTH_SHORT).show();
            
            // Atualizar a lista
            carregarCorridas();
        } else {
            Toast.makeText(this, 
                "Erro ao aceitar corrida. Ela pode já ter sido aceita por outro motoboy.", 
                Toast.LENGTH_SHORT).show();
        }
    }

    @Override
    protected void onResume() {
        super.onResume();
        // Atualizar a lista quando voltar para a tela
        carregarCorridas();
    }

    @Override
    public boolean onSupportNavigateUp() {
        onBackPressed();
        return true;
    }
}

