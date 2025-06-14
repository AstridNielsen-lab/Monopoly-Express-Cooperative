package com.cooperativa.motoboy;

import android.content.SharedPreferences;
import android.os.AsyncTask;
import android.os.Bundle;
import android.text.TextUtils;
import android.view.View;
import android.widget.TextView;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import com.cooperativa.motoboy.database.DatabaseHelper;
import com.cooperativa.motoboy.database.Usuario;
import com.google.android.material.button.MaterialButton;
import com.google.android.material.textfield.TextInputEditText;
import com.google.android.material.textfield.TextInputLayout;
import org.json.JSONArray;
import org.json.JSONObject;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.text.DecimalFormat;

public class SolicitarEntregaActivity extends AppCompatActivity {

    private TextInputLayout tilEnderecoColeta, tilEnderecoEntrega, tilDescricao, tilValorFrete;
    private TextInputEditText etEnderecoColeta, etEnderecoEntrega, etDescricao, etValorFrete;
    private MaterialButton btnCalcularFrete, btnConfirmarEntrega;
    private TextView tvDistanciaInfo, tvCalculoInfo;
    
    private DatabaseHelper dbHelper;
    private SharedPreferences preferences;
    private Usuario currentUser;
    
    // Configurações de preço
    private static final double PRECO_POR_KM = 5.0; // R$ 5,00 por km conforme especificação
    private static final double VALOR_MINIMO = 5.0; // R$ 5,00 mínimo
    
    private double distanciaCalculada = 0.0;
    private double valorCalculado = 0.0;
    
    private static final String PREFS_NAME = "MonopolyExpressPrefs";
    private static final String KEY_USER_ID = "user_id";
    
    // Chave da API OpenRouteService (você deve registrar e obter sua própria chave)
    private static final String OPENROUTE_API_KEY = "5b3ce3597851110001cf6248...YOUR_KEY_HERE";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_solicitar_entrega);

        initComponents();
        loadUserData();
        setupClickListeners();
    }

    private void initComponents() {
        dbHelper = new DatabaseHelper(this);
        preferences = getSharedPreferences(PREFS_NAME, MODE_PRIVATE);
        
        // TextInputLayouts
        tilEnderecoColeta = findViewById(R.id.tilEnderecoColeta);
        tilEnderecoEntrega = findViewById(R.id.tilEnderecoEntrega);
        tilDescricao = findViewById(R.id.tilDescricao);
        tilValorFrete = findViewById(R.id.tilValorFrete);
        
        // EditTexts
        etEnderecoColeta = findViewById(R.id.etEnderecoColeta);
        etEnderecoEntrega = findViewById(R.id.etEnderecoEntrega);
        etDescricao = findViewById(R.id.etDescricao);
        etValorFrete = findViewById(R.id.etValorFrete);
        
        // Buttons
        btnCalcularFrete = findViewById(R.id.btnCalcularFrete);
        btnConfirmarEntrega = findViewById(R.id.btnConfirmarEntrega);
        
        // TextViews
        tvDistanciaInfo = findViewById(R.id.tvDistanciaInfo);
        tvCalculoInfo = findViewById(R.id.tvCalculoInfo);
        
        // Configurar campo de valor como somente leitura
        etValorFrete.setEnabled(false);
        
        // Configurar ActionBar
        if (getSupportActionBar() != null) {
            getSupportActionBar().setTitle("Solicitar Entrega");
            getSupportActionBar().setDisplayHomeAsUpEnabled(true);
        }
    }

    private void loadUserData() {
        int userId = preferences.getInt(KEY_USER_ID, -1);
        if (userId != -1) {
            currentUser = dbHelper.getUserById(userId);
        }
    }

    private void setupClickListeners() {
        btnCalcularFrete.setOnClickListener(v -> calcularFrete());
        btnConfirmarEntrega.setOnClickListener(v -> confirmarEntrega());
    }

    private void calcularFrete() {
        String enderecoColeta = etEnderecoColeta.getText().toString().trim();
        String enderecoEntrega = etEnderecoEntrega.getText().toString().trim();
        
        // Validações
        if (!validateAddresses(enderecoColeta, enderecoEntrega)) {
            return;
        }
        
        // Mostrar loading
        btnCalcularFrete.setEnabled(false);
        btnCalcularFrete.setText("Calculando...");
        tvDistanciaInfo.setText("Calculando distância...");
        tvDistanciaInfo.setVisibility(View.VISIBLE);
        
        // Executar cálculo em background
        new CalcularDistanciaTask().execute(enderecoColeta, enderecoEntrega);
    }

    private boolean validateAddresses(String coleta, String entrega) {
        boolean valid = true;
        
        if (TextUtils.isEmpty(coleta)) {
            tilEnderecoColeta.setError("Endereço de coleta é obrigatório");
            valid = false;
        } else {
            tilEnderecoColeta.setError(null);
        }
        
        if (TextUtils.isEmpty(entrega)) {
            tilEnderecoEntrega.setError("Endereço de entrega é obrigatório");
            valid = false;
        } else {
            tilEnderecoEntrega.setError(null);
        }
        
        return valid;
    }

    private void confirmarEntrega() {
        if (currentUser == null) {
            Toast.makeText(this, "Erro: usuário não encontrado", Toast.LENGTH_SHORT).show();
            return;
        }
        
        if (valorCalculado <= 0) {
            Toast.makeText(this, "Calcule o frete primeiro", Toast.LENGTH_SHORT).show();
            return;
        }
        
        String enderecoColeta = etEnderecoColeta.getText().toString().trim();
        String enderecoEntrega = etEnderecoEntrega.getText().toString().trim();
        String descricao = etDescricao.getText().toString().trim();
        
        if (descricao.isEmpty()) {
            descricao = "Entrega padrão";
        }
        
        // Criar nova corrida
        Corrida novaCorrida = new Corrida();
        novaCorrida.setEnderecoColeta(enderecoColeta);
        novaCorrida.setEnderecoEntrega(enderecoEntrega);
        novaCorrida.setDescricao(descricao);
        novaCorrida.setValorFrete(valorCalculado);
        novaCorrida.setStatus(Corrida.STATUS_AGUARDANDO);
        novaCorrida.setTimestamp(System.currentTimeMillis());
        
        // Inserir no banco
        long entregaId = dbHelper.insertEntrega(novaCorrida, currentUser.getId());
        
        if (entregaId > 0) {
            Toast.makeText(this, "Entrega solicitada com sucesso!", Toast.LENGTH_SHORT).show();
            finish(); // Voltar para o dashboard
        } else {
            Toast.makeText(this, "Erro ao solicitar entrega. Tente novamente.", Toast.LENGTH_SHORT).show();
        }
    }

    @Override
    public boolean onSupportNavigateUp() {
        onBackPressed();
        return true;
    }

    private class CalcularDistanciaTask extends AsyncTask<String, Void, String> {
        private String erro = null;

        @Override
        protected String doInBackground(String... enderecos) {
            try {
                String enderecoColeta = enderecos[0];
                String enderecoEntrega = enderecos[1];
                
                // Primeiro, obter coordenadas usando Nominatim (OpenStreetMap)
                double[] coordColeta = obterCoordenadas(enderecoColeta);
                double[] coordEntrega = obterCoordenadas(enderecoEntrega);
                
                if (coordColeta == null || coordEntrega == null) {
                    erro = "Não foi possível encontrar um ou ambos os endereços";
                    return null;
                }
                
                // Usar OpenRouteService para calcular distância por rota
                String openRouteUrl = String.format(
                    "https://api.openrouteservice.org/v2/directions/driving-car?api_key=%s&start=%f,%f&end=%f,%f",
                    OPENROUTE_API_KEY, coordColeta[1], coordColeta[0], coordEntrega[1], coordEntrega[0]
                );
                
                String response = fazerRequisicaoHttp(openRouteUrl);
                JSONObject jsonResponse = new JSONObject(response);
                
                JSONArray features = jsonResponse.getJSONArray("features");
                if (features.length() > 0) {
                    JSONObject feature = features.getJSONObject(0);
                    JSONObject properties = feature.getJSONObject("properties");
                    JSONArray segments = properties.getJSONArray("segments");
                    
                    if (segments.length() > 0) {
                        JSONObject segment = segments.getJSONObject(0);
                        double distanciaMetros = segment.getDouble("distance");
                        distanciaCalculada = distanciaMetros / 1000.0; // Converter para km
                        return "sucesso";
                    }
                }
                
                erro = "Não foi possível calcular a rota";
                return null;
                
            } catch (Exception e) {
                // Fallback: usar cálculo simples de distância euclidiana se API falhar
                erro = "Usando cálculo aproximado: " + e.getMessage();
                try {
                    String enderecoColeta = enderecos[0];
                    String enderecoEntrega = enderecos[1];
                    
                    double[] coordColeta = obterCoordenadas(enderecoColeta);
                    double[] coordEntrega = obterCoordenadas(enderecoEntrega);
                    
                    if (coordColeta != null && coordEntrega != null) {
                        distanciaCalculada = calcularDistanciaEuclidiana(coordColeta, coordEntrega);
                        return "sucesso_aproximado";
                    }
                } catch (Exception ex) {
                    erro = "Erro ao calcular distância: " + ex.getMessage();
                }
                return null;
            }
        }

        @Override
        protected void onPostExecute(String resultado) {
            // Restaurar botão
            btnCalcularFrete.setEnabled(true);
            btnCalcularFrete.setText("Calcular Frete");
            
            if (resultado != null && (resultado.equals("sucesso") || resultado.equals("sucesso_aproximado"))) {
                // Calcular valor do frete
                valorCalculado = Math.max(distanciaCalculada * PRECO_POR_KM, VALOR_MINIMO);
                
                // Formatar valores
                DecimalFormat dfDistancia = new DecimalFormat("#.##");
                DecimalFormat dfValor = new DecimalFormat("#.00");
                
                String distanciaFormatada = dfDistancia.format(distanciaCalculada);
                String valorFormatado = dfValor.format(valorCalculado);
                
                // Atualizar UI
                etValorFrete.setText("R$ " + valorFormatado);
                tvDistanciaInfo.setText("Distância: " + distanciaFormatada + " km");
                
                if (resultado.equals("sucesso_aproximado")) {
                    tvCalculoInfo.setText("Cálculo aproximado - " + distanciaFormatada + " km × R$ " + PRECO_POR_KM + " = R$ " + valorFormatado);
                } else {
                    tvCalculoInfo.setText(distanciaFormatada + " km × R$ " + PRECO_POR_KM + " = R$ " + valorFormatado);
                }
                tvCalculoInfo.setVisibility(View.VISIBLE);
                
                // Habilitar botão de confirmar
                btnConfirmarEntrega.setEnabled(true);
                
            } else {
                // Mostrar erro
                tvDistanciaInfo.setText(erro != null ? erro : "Erro desconhecido");
                tvCalculoInfo.setVisibility(View.GONE);
                Toast.makeText(SolicitarEntregaActivity.this, erro, Toast.LENGTH_LONG).show();
            }
        }

        private double[] obterCoordenadas(String endereco) throws Exception {
            String encodedAddress = URLEncoder.encode(endereco + ", Brasil", "UTF-8");
            String nominatimUrl = "https://nominatim.openstreetmap.org/search?format=json&q=" + encodedAddress + "&limit=1";
            
            String response = fazerRequisicaoHttp(nominatimUrl);
            JSONArray results = new JSONArray(response);
            
            if (results.length() > 0) {
                JSONObject result = results.getJSONObject(0);
                double lat = result.getDouble("lat");
                double lon = result.getDouble("lon");
                return new double[]{lat, lon};
            }
            
            return null;
        }
        
        private double calcularDistanciaEuclidiana(double[] coord1, double[] coord2) {
            double R = 6371; // Raio da Terra em km
            double dLat = Math.toRadians(coord2[0] - coord1[0]);
            double dLon = Math.toRadians(coord2[1] - coord1[1]);
            double a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                      Math.cos(Math.toRadians(coord1[0])) * Math.cos(Math.toRadians(coord2[0])) *
                      Math.sin(dLon/2) * Math.sin(dLon/2);
            double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
            return R * c;
        }

        private String fazerRequisicaoHttp(String urlString) throws Exception {
            URL url = new URL(urlString);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("GET");
            connection.setRequestProperty("User-Agent", "MonopolyExpress/1.0");
            connection.setConnectTimeout(10000);
            connection.setReadTimeout(15000);
            
            BufferedReader reader = new BufferedReader(
                new InputStreamReader(connection.getInputStream())
            );
            
            StringBuilder response = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                response.append(line);
            }
            reader.close();
            
            return response.toString();
        }
    }
}

