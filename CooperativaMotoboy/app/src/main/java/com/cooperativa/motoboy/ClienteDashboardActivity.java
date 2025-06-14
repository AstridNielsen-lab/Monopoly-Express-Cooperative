package com.cooperativa.motoboy;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.TextView;
import androidx.appcompat.app.AppCompatActivity;
import androidx.cardview.widget.CardView;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import com.cooperativa.motoboy.database.DatabaseHelper;
import com.cooperativa.motoboy.database.Usuario;
import com.google.android.material.button.MaterialButton;
import com.google.android.material.floatingactionbutton.FloatingActionButton;
import java.util.ArrayList;
import java.util.List;

public class ClienteDashboardActivity extends AppCompatActivity {

    private TextView tvWelcomeUser, tvTotalEntregas, tvEntregasAndamento, tvEntregasFinalizadas;
    private CardView cardSolicitarEntrega, cardEntregasAndamento, cardHistorico;
    private RecyclerView rvEntregasRecentes;
    private FloatingActionButton fabNovaEntrega;
    
    private DatabaseHelper dbHelper;
    private SharedPreferences preferences;
    private Usuario currentUser;
    private CorridaAdapter recentEntregasAdapter;
    
    private static final String PREFS_NAME = "MonopolyExpressPrefs";
    private static final String KEY_USER_ID = "user_id";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_cliente_dashboard);

        initComponents();
        loadUserData();
        setupClickListeners();
        loadDashboardData();
        setupRecyclerView();
    }

    private void initComponents() {
        dbHelper = new DatabaseHelper(this);
        preferences = getSharedPreferences(PREFS_NAME, MODE_PRIVATE);
        
        // Views
        tvWelcomeUser = findViewById(R.id.tvWelcomeUser);
        tvTotalEntregas = findViewById(R.id.tvTotalEntregas);
        tvEntregasAndamento = findViewById(R.id.tvEntregasAndamento);
        tvEntregasFinalizadas = findViewById(R.id.tvEntregasFinalizadas);
        
        cardSolicitarEntrega = findViewById(R.id.cardSolicitarEntrega);
        cardEntregasAndamento = findViewById(R.id.cardEntregasAndamento);
        cardHistorico = findViewById(R.id.cardHistorico);
        
        rvEntregasRecentes = findViewById(R.id.rvEntregasRecentes);
        fabNovaEntrega = findViewById(R.id.fabNovaEntrega);
        
        // Configurar ActionBar
        if (getSupportActionBar() != null) {
            getSupportActionBar().setTitle("Dashboard - Cliente");
            getSupportActionBar().setDisplayHomeAsUpEnabled(false);
        }
    }

    private void loadUserData() {
        int userId = preferences.getInt(KEY_USER_ID, -1);
        if (userId != -1) {
            currentUser = dbHelper.getUserById(userId);
            if (currentUser != null) {
                String firstName = currentUser.getNome().split(" ")[0];
                tvWelcomeUser.setText("Olá, " + firstName + "!");
            }
        }
    }

    private void setupClickListeners() {
        cardSolicitarEntrega.setOnClickListener(v -> {
            Intent intent = new Intent(this, SolicitarEntregaActivity.class);
            startActivity(intent);
        });
        
        cardEntregasAndamento.setOnClickListener(v -> {
            // TODO: Implementar EntregasAndamentoActivity
            // Intent intent = new Intent(this, EntregasAndamentoActivity.class);
            // startActivity(intent);
        });
        
        cardHistorico.setOnClickListener(v -> {
            // TODO: Implementar HistoricoActivity
            // Intent intent = new Intent(this, HistoricoActivity.class);
            // startActivity(intent);
        });
        
        fabNovaEntrega.setOnClickListener(v -> {
            Intent intent = new Intent(this, SolicitarEntregaActivity.class);
            startActivity(intent);
        });
    }

    private void loadDashboardData() {
        if (currentUser != null) {
            List<Corrida> userEntregas = dbHelper.getEntregasPorCliente(currentUser.getId());
            
            // Estatísticas
            int totalEntregas = userEntregas.size();
            int entregasAndamento = 0;
            int entregasFinalizadas = 0;
            
            for (Corrida entrega : userEntregas) {
                if ("ENTREGUE".equals(entrega.getStatus()) || "FINALIZADA".equals(entrega.getStatus())) {
                    entregasFinalizadas++;
                } else if (!"AGUARDANDO".equals(entrega.getStatus())) {
                    entregasAndamento++;
                }
            }
            
            // Atualizar UI
            tvTotalEntregas.setText(String.valueOf(totalEntregas));
            tvEntregasAndamento.setText(String.valueOf(entregasAndamento));
            tvEntregasFinalizadas.setText(String.valueOf(entregasFinalizadas));
            
            // Carregar entregas recentes (últimas 5)
            List<Corrida> entregasRecentes = new ArrayList<>();
            for (int i = 0; i < Math.min(5, userEntregas.size()); i++) {
                entregasRecentes.add(userEntregas.get(i));
            }
            
            if (recentEntregasAdapter != null) {
                recentEntregasAdapter.updateCorridas(entregasRecentes);
            }
        }
    }

    private void setupRecyclerView() {
        rvEntregasRecentes.setLayoutManager(new LinearLayoutManager(this));
        recentEntregasAdapter = new CorridaAdapter(new ArrayList<>(), new CorridaAdapter.OnCorridaClickListener() {
            @Override
            public void onAceitarCorrida(Corrida corrida) {
                // Não aplicável para clientes
            }
        });
        rvEntregasRecentes.setAdapter(recentEntregasAdapter);
    }

    @Override
    protected void onResume() {
        super.onResume();
        loadDashboardData(); // Recarregar dados quando voltar para a tela
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.dashboard_menu, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        int id = item.getItemId();
        
        if (id == R.id.action_profile) {
            // TODO: Implementar PerfilActivity
            // Intent intent = new Intent(this, PerfilActivity.class);
            // startActivity(intent);
            return true;
        } else if (id == R.id.action_logout) {
            logout();
            return true;
        }
        
        return super.onOptionsItemSelected(item);
    }

    private void logout() {
        SharedPreferences.Editor editor = preferences.edit();
        editor.clear();
        editor.apply();
        
        Intent intent = new Intent(this, LoginActivity.class);
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
        startActivity(intent);
        finish();
    }
}

