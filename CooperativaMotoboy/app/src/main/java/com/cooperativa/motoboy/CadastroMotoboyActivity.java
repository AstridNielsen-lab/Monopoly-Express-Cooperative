package com.cooperativa.motoboy;

import android.content.Intent;
import android.os.Bundle;
import android.text.TextUtils;
import android.view.View;
import android.widget.ArrayAdapter;
import android.widget.AutoCompleteTextView;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import com.cooperativa.motoboy.database.DatabaseHelper;
import com.cooperativa.motoboy.database.Usuario;
import com.google.android.material.button.MaterialButton;
import com.google.android.material.textfield.TextInputEditText;
import com.google.android.material.textfield.TextInputLayout;
import java.util.regex.Pattern;

public class CadastroMotoboyActivity extends AppCompatActivity {

    // Views de cadastro
    private TextInputLayout tilNome, tilCpf, tilTelefone, tilEmail, tilSenha, 
                           tilConfirmarSenha, tilCnh, tilTipoVeiculo, tilPlacaVeiculo;
    private TextInputEditText etNome, etCpf, etTelefone, etEmail, etSenha, 
                             etConfirmarSenha, etCnh, etPlacaVeiculo;
    private AutoCompleteTextView actvTipoVeiculo;
    private MaterialButton btnCadastrar, btnVoltar;
    
    private DatabaseHelper dbHelper;
    
    // Tipos de veículo disponíveis
    private static final String[] TIPOS_VEICULO = {
        "Bicicleta", "Motocicleta", "Carro"
    };

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_cadastro_motoboy);

        initComponents();
        setupTipoVeiculoSpinner();
        setupClickListeners();
        setupFieldValidations();
    }

    private void initComponents() {
        dbHelper = new DatabaseHelper(this);
        
        // TextInputLayouts
        tilNome = findViewById(R.id.tilNome);
        tilCpf = findViewById(R.id.tilCpf);
        tilTelefone = findViewById(R.id.tilTelefone);
        tilEmail = findViewById(R.id.tilEmail);
        tilSenha = findViewById(R.id.tilSenha);
        tilConfirmarSenha = findViewById(R.id.tilConfirmarSenha);
        tilCnh = findViewById(R.id.tilCnh);
        tilTipoVeiculo = findViewById(R.id.tilTipoVeiculo);
        tilPlacaVeiculo = findViewById(R.id.tilPlacaVeiculo);
        
        // EditTexts
        etNome = findViewById(R.id.etNome);
        etCpf = findViewById(R.id.etCpf);
        etTelefone = findViewById(R.id.etTelefone);
        etEmail = findViewById(R.id.etEmail);
        etSenha = findViewById(R.id.etSenha);
        etConfirmarSenha = findViewById(R.id.etConfirmarSenha);
        etCnh = findViewById(R.id.etCnh);
        etPlacaVeiculo = findViewById(R.id.etPlacaVeiculo);
        actvTipoVeiculo = findViewById(R.id.actvTipoVeiculo);
        
        // Buttons
        btnCadastrar = findViewById(R.id.btnCadastrar);
        btnVoltar = findViewById(R.id.btnVoltar);
        
        // Configurar ActionBar
        if (getSupportActionBar() != null) {
            getSupportActionBar().setTitle("Cadastro Motoboy");
            getSupportActionBar().setDisplayHomeAsUpEnabled(true);
        }
    }

    private void setupTipoVeiculoSpinner() {
        ArrayAdapter<String> adapter = new ArrayAdapter<>(this, 
            android.R.layout.simple_dropdown_item_1line, TIPOS_VEICULO);
        actvTipoVeiculo.setAdapter(adapter);
    }

    private void setupClickListeners() {
        btnCadastrar.setOnClickListener(v -> performCadastro());
        btnVoltar.setOnClickListener(v -> finish());
    }

    private void setupFieldValidations() {
        // Listener para tipo de veículo - habilita/desabilita campos CNH e placa
        actvTipoVeiculo.setOnItemClickListener((parent, view, position, id) -> {
            String tipoSelecionado = TIPOS_VEICULO[position];
            boolean isBicicleta = "Bicicleta".equals(tipoSelecionado);
            
            // Para bicicleta, CNH e placa são opcionais
            tilCnh.setHint(isBicicleta ? "CNH (opcional)" : "CNH *");
            tilPlacaVeiculo.setHint(isBicicleta ? "Placa (opcional)" : "Placa do Veículo *");
            
            // Limpar erros quando muda o tipo
            tilCnh.setError(null);
            tilPlacaVeiculo.setError(null);
        });
    }

    private void performCadastro() {
        // Obter valores dos campos
        String nome = etNome.getText().toString().trim();
        String cpf = etCpf.getText().toString().trim();
        String telefone = etTelefone.getText().toString().trim();
        String email = etEmail.getText().toString().trim();
        String senha = etSenha.getText().toString().trim();
        String confirmarSenha = etConfirmarSenha.getText().toString().trim();
        String cnh = etCnh.getText().toString().trim();
        String tipoVeiculo = actvTipoVeiculo.getText().toString().trim();
        String placaVeiculo = etPlacaVeiculo.getText().toString().trim();

        // Validações
        if (!validateInputs(nome, cpf, telefone, email, senha, confirmarSenha, 
                           cnh, tipoVeiculo, placaVeiculo)) {
            return;
        }

        // Verificar duplicatas
        if (dbHelper.emailExists(email)) {
            tilEmail.setError("Este e-mail já está cadastrado");
            return;
        }

        if (dbHelper.cpfExists(cpf)) {
            tilCpf.setError("Este CPF já está cadastrado");
            return;
        }

        // Criar usuário motoboy
        Usuario motoboy = new Usuario();
        motoboy.setNome(nome);
        motoboy.setCpf(cpf);
        motoboy.setTelefone(telefone);
        motoboy.setEmail(email);
        motoboy.setSenha(senha);
        motoboy.setTipo("MOTOBOY");
        motoboy.setCnh(cnh.isEmpty() ? null : cnh);
        motoboy.setTipoVeiculo(tipoVeiculo);
        motoboy.setPlacaVeiculo(placaVeiculo.isEmpty() ? null : placaVeiculo);
        motoboy.setEmailVerificado(true); // Simplificado para demo
        motoboy.setAtivo(true);

        // Inserir no banco
        long userId = dbHelper.insertUser(motoboy);
        if (userId > 0) {
            Toast.makeText(this, "Motoboy cadastrado com sucesso! Aguarde aprovação.", 
                         Toast.LENGTH_LONG).show();
            
            // Voltar para login
            Intent intent = new Intent(this, LoginActivity.class);
            intent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
            startActivity(intent);
            finish();
        } else {
            Toast.makeText(this, "Erro ao cadastrar motoboy. Tente novamente.", 
                         Toast.LENGTH_SHORT).show();
        }
    }

    private boolean validateInputs(String nome, String cpf, String telefone, String email, 
                                 String senha, String confirmarSenha, String cnh, 
                                 String tipoVeiculo, String placaVeiculo) {
        boolean isValid = true;

        // Validar nome
        if (TextUtils.isEmpty(nome)) {
            tilNome.setError("Nome é obrigatório");
            isValid = false;
        } else {
            tilNome.setError(null);
        }

        // Validar CPF
        if (TextUtils.isEmpty(cpf)) {
            tilCpf.setError("CPF é obrigatório");
            isValid = false;
        } else if (!isValidCPF(cpf)) {
            tilCpf.setError("CPF inválido");
            isValid = false;
        } else {
            tilCpf.setError(null);
        }

        // Validar telefone
        if (TextUtils.isEmpty(telefone)) {
            tilTelefone.setError("Telefone é obrigatório");
            isValid = false;
        } else {
            tilTelefone.setError(null);
        }

        // Validar e-mail
        if (TextUtils.isEmpty(email)) {
            tilEmail.setError("E-mail é obrigatório");
            isValid = false;
        } else if (!isValidEmail(email)) {
            tilEmail.setError("E-mail inválido");
            isValid = false;
        } else {
            tilEmail.setError(null);
        }

        // Validar senha
        if (TextUtils.isEmpty(senha)) {
            tilSenha.setError("Senha é obrigatória");
            isValid = false;
        } else if (senha.length() < 6) {
            tilSenha.setError("Senha deve ter pelo menos 6 caracteres");
            isValid = false;
        } else {
            tilSenha.setError(null);
        }

        // Validar confirmação de senha
        if (!senha.equals(confirmarSenha)) {
            tilConfirmarSenha.setError("Senhas não coincidem");
            isValid = false;
        } else {
            tilConfirmarSenha.setError(null);
        }

        // Validar tipo de veículo
        if (TextUtils.isEmpty(tipoVeiculo)) {
            tilTipoVeiculo.setError("Tipo de veículo é obrigatório");
            isValid = false;
        } else {
            tilTipoVeiculo.setError(null);
        }

        // Validar CNH e placa (obrigatórios exceto para bicicleta)
        boolean isBicicleta = "Bicicleta".equals(tipoVeiculo);
        
        if (!isBicicleta) {
            if (TextUtils.isEmpty(cnh)) {
                tilCnh.setError("CNH é obrigatória para motocicletas e carros");
                isValid = false;
            } else {
                tilCnh.setError(null);
            }

            if (TextUtils.isEmpty(placaVeiculo)) {
                tilPlacaVeiculo.setError("Placa é obrigatória para motocicletas e carros");
                isValid = false;
            } else {
                tilPlacaVeiculo.setError(null);
            }
        } else {
            // Para bicicleta, limpar erros
            tilCnh.setError(null);
            tilPlacaVeiculo.setError(null);
        }

        return isValid;
    }

    private boolean isValidEmail(String email) {
        return Pattern.compile("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$")
                     .matcher(email).matches();
    }

    private boolean isValidCPF(String cpf) {
        // Remove pontos e traços
        cpf = cpf.replaceAll("[^0-9]", "");
        
        // Verificações básicas
        if (cpf.length() != 11) return false;
        if (cpf.matches("(\\d)\\1{10}")) return false; // Todos os dígitos iguais
        
        // Validação dos dígitos verificadores
        try {
            int soma = 0;
            for (int i = 0; i < 9; i++) {
                soma += Character.getNumericValue(cpf.charAt(i)) * (10 - i);
            }
            int resto = soma % 11;
            int dv1 = resto < 2 ? 0 : 11 - resto;
            
            if (dv1 != Character.getNumericValue(cpf.charAt(9))) {
                return false;
            }
            
            soma = 0;
            for (int i = 0; i < 10; i++) {
                soma += Character.getNumericValue(cpf.charAt(i)) * (11 - i);
            }
            resto = soma % 11;
            int dv2 = resto < 2 ? 0 : 11 - resto;
            
            return dv2 == Character.getNumericValue(cpf.charAt(10));
            
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    public boolean onSupportNavigateUp() {
        onBackPressed();
        return true;
    }
}

