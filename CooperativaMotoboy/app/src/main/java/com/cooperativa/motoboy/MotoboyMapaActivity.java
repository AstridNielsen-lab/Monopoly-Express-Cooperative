package com.cooperativa.motoboy;

import android.Manifest;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.location.Location;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import android.provider.Settings;
import android.util.Log;
import android.webkit.JavascriptInterface;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.cooperativa.motoboy.adapters.EntregaMotoboyAdapter;
import com.cooperativa.motoboy.database.DatabaseHelper;
import com.cooperativa.motoboy.database.Entrega;
import com.cooperativa.motoboy.database.EntregaDAO;
import com.cooperativa.motoboy.utils.LocationHelper;
import com.google.android.material.button.MaterialButton;

import java.util.ArrayList;
import java.util.List;

public class MotoboyMapaActivity extends AppCompatActivity 
    implements LocationHelper.OnLocationUpdateListener, EntregaMotoboyAdapter.OnEntregaClickListener {
    
    private static final String TAG = "MotoboyMapaActivity";
    private static final int LOCATION_PERMISSION_REQUEST_CODE = 1001;
    private static final String PREFS_NAME = "MonopolyExpressPrefs";
    
    // Views
    private Toolbar toolbar;
    private TextView tvLocationStatus;
    private TextView tvCurrentLocation;
    private TextView tvEntregasDisponiveis;
    private TextView tvEntregasAceitas;
    private TextView tvEntregasFinalizadas;
    private WebView webViewMapa;
    private RecyclerView rvEntregas;
    private MaterialButton btnAcaoEntrega;
    
    // Data
    private LocationHelper locationHelper;
    private EntregaDAO entregaDAO;
    private EntregaMotoboyAdapter entregaAdapter;
    private List<Entrega> listaEntregas;
    private SharedPreferences preferences;
    
    // Estado
    private boolean isMapLoaded = false;
    private Handler updateHandler;
    private Runnable updateRunnable;
    private int motoboyId;
    
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_motoboy_mapa);
        
        initializeComponents();
        setupViews();
        setupWebView();
        setupRecyclerView();
        setupLocationHelper();
        
        // Carregar dados iniciais
        loadEntregas();
        updateStatistics();
        
        // Iniciar atualizações periódicas
        startPeriodicUpdates();
    }
    
    private void initializeComponents() {
        preferences = getSharedPreferences(PREFS_NAME, MODE_PRIVATE);
        motoboyId = preferences.getInt("user_id", -1);
        
        // Database
        DatabaseHelper dbHelper = new DatabaseHelper(this);
        entregaDAO = new EntregaDAO(dbHelper);
        
        // Lista de entregas
        listaEntregas = new ArrayList<>();
        
        // Handler para atualizações
        updateHandler = new Handler();
    }
    
    private void setupViews() {
        // Toolbar
        toolbar = findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);
        if (getSupportActionBar() != null) {
            getSupportActionBar().setDisplayHomeAsUpEnabled(true);
        }
        
        // Status
        tvLocationStatus = findViewById(R.id.tvLocationStatus);
        tvCurrentLocation = findViewById(R.id.tvCurrentLocation);
        
        // Estatísticas
        tvEntregasDisponiveis = findViewById(R.id.tvEntregasDisponiveis);
        tvEntregasAceitas = findViewById(R.id.tvEntregasAceitas);
        tvEntregasFinalizadas = findViewById(R.id.tvEntregasFinalizadas);
        
        // Mapa
        webViewMapa = findViewById(R.id.webViewMapa);
        
        // RecyclerView
        rvEntregas = findViewById(R.id.rvEntregas);
        
        // Botão de ação
        btnAcaoEntrega = findViewById(R.id.btnAcaoEntrega);
        btnAcaoEntrega.setOnClickListener(v -> {
            if (locationHelper != null) {
                locationHelper.startLocationUpdates();
                Toast.makeText(this, "Atualizando localização...", Toast.LENGTH_SHORT).show();
            }
        });
        
        // Toolbar navigation
        toolbar.setNavigationOnClickListener(v -> {
            // Voltar para login ou dashboard
            finish();
        });
    }
    
    private void setupWebView() {
        WebSettings webSettings = webViewMapa.getSettings();
        webSettings.setJavaScriptEnabled(true);
        webSettings.setDomStorageEnabled(true);
        webSettings.setLoadWithOverviewMode(true);
        webSettings.setUseWideViewPort(true);
        webSettings.setBuiltInZoomControls(false);
        webSettings.setDisplayZoomControls(false);
        webSettings.setSupportZoom(true);
        webSettings.setDefaultTextEncodingName("utf-8");
        
        // Interface JavaScript
        webViewMapa.addJavascriptInterface(new WebViewInterface(), "Android");
        
        webViewMapa.setWebViewClient(new WebViewClient() {
            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
                isMapLoaded = true;
                Log.d(TAG, "Mapa carregado com sucesso");
                
                // Se já temos localização, atualizar o mapa
                if (locationHelper != null && locationHelper.getCurrentLocation() != null) {
                    updateMapLocation();
                }
            }
            
            @Override
            public void onReceivedError(WebView view, int errorCode, String description, String failingUrl) {
                super.onReceivedError(view, errorCode, description, failingUrl);
                Log.e(TAG, "Erro ao carregar mapa: " + description);
                Toast.makeText(MotoboyMapaActivity.this, "Erro ao carregar mapa", Toast.LENGTH_SHORT).show();
            }
        });
        
        // Carregar mapa
        webViewMapa.loadUrl("file:///android_asset/mapa.html");
    }
    
    private void setupRecyclerView() {
        entregaAdapter = new EntregaMotoboyAdapter(this, listaEntregas, this);
        rvEntregas.setLayoutManager(new LinearLayoutManager(this));
        rvEntregas.setAdapter(entregaAdapter);
        rvEntregas.setNestedScrollingEnabled(false);
    }
    
    private void setupLocationHelper() {
        locationHelper = new LocationHelper(this, this);
        
        // Verificar permissões
        if (hasLocationPermission()) {
            locationHelper.startLocationUpdates();
        } else {
            requestLocationPermission();
        }
    }
    
    private boolean hasLocationPermission() {
        return ContextCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED;
    }
    
    private void requestLocationPermission() {
        if (ActivityCompat.shouldShowRequestPermissionRationale(this, Manifest.permission.ACCESS_FINE_LOCATION)) {
            new AlertDialog.Builder(this)
                .setTitle("Permissão de Localização")
                .setMessage("Este app precisa acessar sua localização para mostrar entregas próximas e calcular rotas.")
                .setPositiveButton("Permitir", (dialog, which) -> {
                    ActivityCompat.requestPermissions(this,
                        new String[]{Manifest.permission.ACCESS_FINE_LOCATION, Manifest.permission.ACCESS_COARSE_LOCATION},
                        LOCATION_PERMISSION_REQUEST_CODE);
                })
                .setNegativeButton("Negar", (dialog, which) -> {
                    Toast.makeText(this, "Permissão necessária para funcionar", Toast.LENGTH_LONG).show();
                    finish();
                })
                .show();
        } else {
            ActivityCompat.requestPermissions(this,
                new String[]{Manifest.permission.ACCESS_FINE_LOCATION, Manifest.permission.ACCESS_COARSE_LOCATION},
                LOCATION_PERMISSION_REQUEST_CODE);
        }
    }
    
    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        
        if (requestCode == LOCATION_PERMISSION_REQUEST_CODE) {
            if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                setupLocationHelper();
            } else {
                Toast.makeText(this, "Permissão de localização negada", Toast.LENGTH_LONG).show();
                // Oferecer ir para configurações
                showSettingsDialog();
            }
        }
    }
    
    private void showSettingsDialog() {
        new AlertDialog.Builder(this)
            .setTitle("Permissão Necessária")
            .setMessage("Para usar o mapa, é necessário permitir acesso à localização nas configurações.")
            .setPositiveButton("Configurações", (dialog, which) -> {
                Intent intent = new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
                Uri uri = Uri.fromParts("package", getPackageName(), null);
                intent.setData(uri);
                startActivity(intent);
            })
            .setNegativeButton("Cancelar", (dialog, which) -> finish())
            .show();
    }
    
    // Implementação do LocationHelper.OnLocationUpdateListener
    @Override
    public void onLocationUpdate(double latitude, double longitude, float accuracy) {
        runOnUiThread(() -> {
            tvLocationStatus.setText("GPS Ativo - Localização em tempo real");
            tvCurrentLocation.setText(String.format("%.6f, %.6f", latitude, longitude));
            
            updateMapLocation();
        });
    }
    
    @Override
    public void onLocationError(String error) {
        runOnUiThread(() -> {
            tvLocationStatus.setText("Erro: " + error);
            tvCurrentLocation.setText("Indisponível");
            Toast.makeText(this, error, Toast.LENGTH_LONG).show();
        });
    }
    
    @Override
    public void onPermissionRequired() {
        runOnUiThread(() -> {
            requestLocationPermission();
        });
    }
    
    // Implementação do EntregaMotoboyAdapter.OnEntregaClickListener
    @Override
    public void onAceitarEntrega(Entrega entrega) {
        String novoStatus;
        String mensagem;
        
        switch (entrega.getStatus()) {
            case "AGUARDANDO_MOTOBOY":
                novoStatus = "EM_ANDAMENTO";
                mensagem = "Entrega aceita! Siga a rota no mapa.";
                entrega.setMotoboyId(motoboyId);
                break;
                
            case "EM_ANDAMENTO":
                novoStatus = "FINALIZADA";
                mensagem = "Entrega finalizada com sucesso!";
                break;
                
            default:
                return;
        }
        
        entrega.setStatus(novoStatus);
        entregaDAO.atualizar(entrega);
        
        Toast.makeText(this, mensagem, Toast.LENGTH_SHORT).show();
        
        // Atualizar lista e estatísticas
        loadEntregas();
        updateStatistics();
        
        // Se finalizada, limpar mapa
        if ("FINALIZADA".equals(novoStatus)) {
            clearMap();
        }
    }
    
    @Override
    public void onVerRota(Entrega entrega) {
        showRouteOnMap(entrega);
    }
    
    private void loadEntregas() {
        // Carregar entregas disponíveis e do motoboy atual
        List<Entrega> todasEntregas = entregaDAO.buscarTodas();
        listaEntregas.clear();
        
        for (Entrega entrega : todasEntregas) {
            // Mostrar entregas aguardando ou em andamento pelo motoboy atual
            if ("AGUARDANDO_MOTOBOY".equals(entrega.getStatus()) || 
                ("EM_ANDAMENTO".equals(entrega.getStatus()) && entrega.getMotoboyId() == motoboyId)) {
                listaEntregas.add(entrega);
            }
        }
        
        entregaAdapter.updateEntregas(listaEntregas);
    }
    
    private void updateStatistics() {
        List<Entrega> todasEntregas = entregaDAO.buscarTodas();
        
        int disponiveis = 0;
        int emAndamento = 0;
        int finalizadas = 0;
        
        for (Entrega entrega : todasEntregas) {
            switch (entrega.getStatus()) {
                case "AGUARDANDO_MOTOBOY":
                    disponiveis++;
                    break;
                case "EM_ANDAMENTO":
                    if (entrega.getMotoboyId() == motoboyId) {
                        emAndamento++;
                    }
                    break;
                case "FINALIZADA":
                    if (entrega.getMotoboyId() == motoboyId) {
                        finalizadas++;
                    }
                    break;
            }
        }
        
        tvEntregasDisponiveis.setText(String.valueOf(disponiveis));
        tvEntregasAceitas.setText(String.valueOf(emAndamento));
        tvEntregasFinalizadas.setText(String.valueOf(finalizadas));
    }
    
    private void updateMapLocation() {
        if (isMapLoaded && locationHelper != null) {
            Location location = locationHelper.getCurrentLocation();
            if (location != null) {
                String script = String.format("updateMotoboyLocation(%f, %f);", 
                    location.getLatitude(), location.getLongitude());
                webViewMapa.evaluateJavascript(script, null);
            }
        }
    }
    
    private void showRouteOnMap(Entrega entrega) {
        if (isMapLoaded) {
            // Simular coordenadas dos endereços (seria necessário implementar geocoding real)
            double pickupLat = -23.5505 + (Math.random() - 0.5) * 0.1; // São Paulo área
            double pickupLng = -46.6333 + (Math.random() - 0.5) * 0.1;
            double deliveryLat = -23.5505 + (Math.random() - 0.5) * 0.1;
            double deliveryLng = -46.6333 + (Math.random() - 0.5) * 0.1;
            
            String script = String.format("showRoute(%f, %f, %f, %f, %d);", 
                pickupLat, pickupLng, deliveryLat, deliveryLng, entrega.getId());
            webViewMapa.evaluateJavascript(script, null);
        }
    }
    
    private void clearMap() {
        if (isMapLoaded) {
            webViewMapa.evaluateJavascript("clearMap();", null);
        }
    }
    
    private void startPeriodicUpdates() {
        updateRunnable = new Runnable() {
            @Override
            public void run() {
                loadEntregas();
                updateStatistics();
                updateHandler.postDelayed(this, 30000); // Atualizar a cada 30 segundos
            }
        };
        updateHandler.postDelayed(updateRunnable, 30000);
    }
    
    private void stopPeriodicUpdates() {
        if (updateHandler != null && updateRunnable != null) {
            updateHandler.removeCallbacks(updateRunnable);
        }
    }
    
    @Override
    protected void onResume() {
        super.onResume();
        if (locationHelper != null) {
            locationHelper.startLocationUpdates();
        }
    }
    
    @Override
    protected void onPause() {
        super.onPause();
        if (locationHelper != null) {
            locationHelper.stopLocationUpdates();
        }
    }
    
    @Override
    protected void onDestroy() {
        super.onDestroy();
        stopPeriodicUpdates();
        if (locationHelper != null) {
            locationHelper.stopLocationUpdates();
        }
    }
    
    // Interface JavaScript para comunicação com WebView
    private class WebViewInterface {
        @JavascriptInterface
        public void onRouteCalculated(String distance, String duration, String value) {
            Log.d(TAG, String.format("Rota calculada: %s km, %s min, R$ %s", distance, duration, value));
        }
        
        @JavascriptInterface
        public void onMapClick(String latitude, String longitude) {
            Log.d(TAG, "Clique no mapa: " + latitude + ", " + longitude);
        }
    }
}

