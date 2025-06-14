package com.cooperativa.motoboy;

import android.os.Bundle;
import android.os.AsyncTask;
import android.text.Editable;
import android.text.TextWatcher;
import android.view.View;
import android.widget.TextView;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import com.google.android.material.button.MaterialButton;
import com.google.android.material.textfield.TextInputEditText;
import org.json.JSONArray;
import org.json.JSONObject;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.text.DecimalFormat;

public class ClienteActivity extends AppCompatActivity {

    private TextInputEditText etEnderecoColeta;
    private TextInputEditText etEnderecoEntrega;
    private TextInputEditText etDescricao;
    private TextInputEditText etValorFrete;
    private MaterialButton btnEnviarSolicitacao;
    private MaterialButton btnCalcularFrete;
    private TextView tvStatus;
    private TextView tvDistancia;

    private GerenciadorCorridas gerenciadorCorridas;
    private static final double PRECO_POR_KM = 5.0; // R$ 5,00 por km conforme especificação

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_cliente);

        initViews();
        setupClickListeners();
        
        gerenciadorCorridas = GerenciadorCorridas.getInstance();
        
        // Configurar action bar
        if (getSupportActionBar() != null) {
            getSupportActionBar().setTitle("Monopoly Express - Cliente");
            getSupportActionBar().setDisplayHomeAsUpEnabled(true);
        }
    }

    private void initViews() {
        etEnderecoColeta = findViewById(R.id.etEnderecoColeta);
        etEnderecoEntrega = findViewById(R.id.etEnderecoEntrega);
        etDescricao = findViewById(R.id.etDescricao);
        etValorFrete = findViewById(R.id.etValorFrete);
        btnEnviarSolicitacao = findViewById(R.id.btnEnviarSolicitacao);
        btnCalcularFrete = findViewById(R.id.btnCalcularFrete);
        tvStatus = findViewById(R.id.tvStatus);
        tvDistancia = findViewById(R.id.tvDistancia);
        
        // Tornar o campo de valor frete apenas leitura
        etValorFrete.setEnabled(false);
    }

    private void setupClickListeners() {
        btnEnviarSolicitacao.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                enviarSolicitacao();
            }
        });
        
        btnCalcularFrete.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                calcularFrete();
            }
        });
    }

    private void enviarSolicitacao() {
        String enderecoColeta = etEnderecoColeta.getText().toString().trim();
        String enderecoEntrega = etEnderecoEntrega.getText().toString().trim();
        String descricao = etDescricao.getText().toString().trim();
        String valorFreteStr = etValorFrete.getText().toString().trim();

        // Validações
        if (enderecoColeta.isEmpty()) {
            etEnderecoColeta.setError("Endereço de coleta é obrigatório");
            etEnderecoColeta.requestFocus();
            return;
        }

        if (enderecoEntrega.isEmpty()) {
            etEnderecoEntrega.setError("Endereço de entrega é obrigatório");
            etEnderecoEntrega.requestFocus();
            return;
        }

        if (valorFreteStr.isEmpty()) {
            etValorFrete.setError("Valor do frete é obrigatório");
            etValorFrete.requestFocus();
            return;
        }

        double valorFrete;
        try {
            valorFrete = Double.parseDouble(valorFreteStr);
            if (valorFrete <= 0) {
                etValorFrete.setError("Valor deve ser maior que zero");
                etValorFrete.requestFocus();
                return;
            }
        } catch (NumberFormatException e) {
            etValorFrete.setError("Valor inválido");
            etValorFrete.requestFocus();
            return;
        }

        // Criar a corrida
        Corrida novaCorrida = gerenciadorCorridas.adicionarCorrida(
                enderecoColeta, enderecoEntrega, descricao, valorFrete
        );

        // Mostrar sucesso
        Toast.makeText(this, "Solicitação enviada com sucesso!", Toast.LENGTH_SHORT).show();
        
        // Mostrar status
        tvStatus.setText("Corrida #" + novaCorrida.getId() + " - " + getString(R.string.status_aguardando));
        tvStatus.setVisibility(View.VISIBLE);
        
        // Limpar campos
        limparCampos();
    }

    private void calcularFrete() {
        String enderecoColeta = etEnderecoColeta.getText().toString().trim();
        String enderecoEntrega = etEnderecoEntrega.getText().toString().trim();
        
        if (enderecoColeta.isEmpty()) {
            etEnderecoColeta.setError("Endereço de coleta é obrigatório");
            etEnderecoColeta.requestFocus();
            return;
        }
        
        if (enderecoEntrega.isEmpty()) {
            etEnderecoEntrega.setError("Endereço de entrega é obrigatório");
            etEnderecoEntrega.requestFocus();
            return;
        }
        
        tvStatus.setText("Calculando distância...");
        tvStatus.setVisibility(View.VISIBLE);
        
        new CalcularDistanciaTask().execute(enderecoColeta, enderecoEntrega);
    }
    
    private void limparCampos() {
        etEnderecoColeta.setText("");
        etEnderecoEntrega.setText("");
        etDescricao.setText("");
        etValorFrete.setText("");
        tvDistancia.setVisibility(View.GONE);
    }

    @Override
    public boolean onSupportNavigateUp() {
        onBackPressed();
        return true;
    }
    
    private class CalcularDistanciaTask extends AsyncTask<String, Void, String> {
        private double distanciaKm = 0.0;
        private String erro = null;
        
        @Override
        protected String doInBackground(String... enderecos) {
            try {
                String enderecoColeta = enderecos[0];
                String enderecoEntrega = enderecos[1];
                
                // Primeiro, obter coordenadas dos endereços usando Nominatim (OpenStreetMap)
                double[] coordColeta = obterCoordenadas(enderecoColeta);
                double[] coordEntrega = obterCoordenadas(enderecoEntrega);
                
                if (coordColeta == null || coordEntrega == null) {
                    erro = "Não foi possível encontrar um ou ambos os endereços";
                    return null;
                }
                
                // Calcular rota usando OSRM
                String osrmUrl = String.format(
                    "http://router.project-osrm.org/route/v1/driving/%f,%f;%f,%f?overview=false",
                    coordColeta[1], coordColeta[0], coordEntrega[1], coordEntrega[0]
                );
                
                String response = fazerRequisicaoHttp(osrmUrl);
                JSONObject jsonResponse = new JSONObject(response);
                
                if (jsonResponse.getString("code").equals("Ok")) {
                    JSONArray routes = jsonResponse.getJSONArray("routes");
                    if (routes.length() > 0) {
                        JSONObject route = routes.getJSONObject(0);
                        double distanciaMetros = route.getDouble("distance");
                        distanciaKm = distanciaMetros / 1000.0;
                        return "sucesso";
                    }
                }
                
                erro = "Não foi possível calcular a rota";
                return null;
                
            } catch (Exception e) {
                erro = "Erro ao calcular distância: " + e.getMessage();
                return null;
            }
        }
        
        @Override
        protected void onPostExecute(String resultado) {
            if (resultado != null && resultado.equals("sucesso")) {
                // Calcular valor do frete
                double valorFrete = distanciaKm * PRECO_POR_KM;
                
                // Formatar valores
                DecimalFormat df = new DecimalFormat("#.##");
                String distanciaFormatada = df.format(distanciaKm);
                String valorFormatado = df.format(valorFrete);
                
                // Atualizar UI
                etValorFrete.setText(valorFormatado);
                tvDistancia.setText("Distância: " + distanciaFormatada + " km");
                tvDistancia.setVisibility(View.VISIBLE);
                tvStatus.setText("Frete calculado com sucesso!");
                
            } else {
                // Mostrar erro
                tvStatus.setText(erro != null ? erro : "Erro desconhecido");
                Toast.makeText(ClienteActivity.this, erro, Toast.LENGTH_LONG).show();
            }
        }
        
        private double[] obterCoordenadas(String endereco) throws Exception {
            String encodedAddress = URLEncoder.encode(endereco, "UTF-8");
            String nominatimUrl = "https://nominatim.openstreetmap.org/search?format=json&q=" + encodedAddress;
            
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
        
        private String fazerRequisicaoHttp(String urlString) throws Exception {
            URL url = new URL(urlString);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("GET");
            connection.setRequestProperty("User-Agent", "CooperativaMotoboy/1.0");
            connection.setConnectTimeout(10000);
            connection.setReadTimeout(10000);
            
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

