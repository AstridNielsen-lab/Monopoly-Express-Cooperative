package com.cooperativa.motoboy;

import android.content.Intent;
import android.content.SharedPreferences;
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
import com.google.android.material.textview.MaterialTextView;
import java.util.regex.Pattern;

public class LoginActivity extends AppCompatActivity {

    // Views de Login
    private TextInputLayout tilLoginEmail, tilLoginPassword;
    private TextInputEditText etLoginEmail, etLoginPassword;
    private MaterialButton btnLogin, btnSwitchToRegister;
    
    // Views de Cadastro
    private TextInputLayout tilRegisterName, tilRegisterCpf, tilRegisterPhone, 
                           tilRegisterEmail, tilRegisterPassword, tilUserType;
    private TextInputEditText etRegisterName, etRegisterCpf, etRegisterPhone, 
                             etRegisterEmail, etRegisterPassword;
    private AutoCompleteTextView actvUserType;
    private MaterialButton btnRegister, btnSwitchToLogin;
    
    // Containers
    private View loginContainer, registerContainer;
    private MaterialTextView tvTitle;
    
    private DatabaseHelper dbHelper;
    private SharedPreferences preferences;
    private boolean isLoginMode = true;
    
    private static final String PREFS_NAME = "MonopolyExpressPrefs";
    private static final String KEY_USER_ID = "user_id";
    private static final String KEY_USER_TYPE = "user_type";
    private static final String KEY_IS_LOGGED_IN = "is_logged_in";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);

        initComponents();
        setupUserTypeSpinner();
        setupClickListeners();
        
        // Verificar se usuário já está logado
        if (isUserLoggedIn()) {
            redirectToMainActivity();
        }
    }

    private void initComponents() {
        dbHelper = new DatabaseHelper(this);
        preferences = getSharedPreferences(PREFS_NAME, MODE_PRIVATE);
        
        // Title
        tvTitle = findViewById(R.id.tvTitle);
        
        // Containers
        loginContainer = findViewById(R.id.loginContainer);
        registerContainer = findViewById(R.id.registerContainer);
        
        // Login Views
        tilLoginEmail = findViewById(R.id.tilLoginEmail);
        tilLoginPassword = findViewById(R.id.tilLoginPassword);
        etLoginEmail = findViewById(R.id.etLoginEmail);
        etLoginPassword = findViewById(R.id.etLoginPassword);
        btnLogin = findViewById(R.id.btnLogin);
        btnSwitchToRegister = findViewById(R.id.btnSwitchToRegister);
        
        // Register Views
        tilRegisterName = findViewById(R.id.tilRegisterName);
        tilRegisterCpf = findViewById(R.id.tilRegisterCpf);
        tilRegisterPhone = findViewById(R.id.tilRegisterPhone);
        tilRegisterEmail = findViewById(R.id.tilRegisterEmail);
        tilRegisterPassword = findViewById(R.id.tilRegisterPassword);
        tilUserType = findViewById(R.id.tilUserType);
        etRegisterName = findViewById(R.id.etRegisterName);
        etRegisterCpf = findViewById(R.id.etRegisterCpf);
        etRegisterPhone = findViewById(R.id.etRegisterPhone);
        etRegisterEmail = findViewById(R.id.etRegisterEmail);
        etRegisterPassword = findViewById(R.id.etRegisterPassword);
        actvUserType = findViewById(R.id.actvUserType);
        btnRegister = findViewById(R.id.btnRegister);
        btnSwitchToLogin = findViewById(R.id.btnSwitchToLogin);
    }

    private void setupUserTypeSpinner() {
        String[] userTypes = {getString(R.string.user_type_client), getString(R.string.user_type_motoboy)};
        ArrayAdapter<String> adapter = new ArrayAdapter<>(this, android.R.layout.simple_dropdown_item_1line, userTypes);
        actvUserType.setAdapter(adapter);
    }

    private void setupClickListeners() {
        btnLogin.setOnClickListener(v -> performLogin());
        btnRegister.setOnClickListener(v -> performRegister());
        btnSwitchToRegister.setOnClickListener(v -> switchToRegisterMode());
        btnSwitchToLogin.setOnClickListener(v -> switchToLoginMode());
    }

    private void switchToRegisterMode() {
        isLoginMode = false;
        loginContainer.setVisibility(View.GONE);
        registerContainer.setVisibility(View.VISIBLE);
        tvTitle.setText(R.string.register_title);
        clearAllFields();
    }

    private void switchToLoginMode() {
        isLoginMode = true;
        registerContainer.setVisibility(View.GONE);
        loginContainer.setVisibility(View.VISIBLE);
        tvTitle.setText(R.string.login_title);
        clearAllFields();
    }

    private void performLogin() {
        String email = etLoginEmail.getText().toString().trim();
        String password = etLoginPassword.getText().toString().trim();

        // Validações
        if (!validateLoginInputs(email, password)) {
            return;
        }

        // Verificar credenciais no banco
        Usuario usuario = dbHelper.authenticateUser(email, password);
        if (usuario != null) {
            // Login bem-sucedido
            saveUserSession(usuario);
            redirectToMainActivity();
            Toast.makeText(this, "Login realizado com sucesso!", Toast.LENGTH_SHORT).show();
        } else {
            Toast.makeText(this, "E-mail ou senha incorretos", Toast.LENGTH_SHORT).show();
        }
    }

    private void performRegister() {
        String name = etRegisterName.getText().toString().trim();
        String cpf = etRegisterCpf.getText().toString().trim();
        String phone = etRegisterPhone.getText().toString().trim();
        String email = etRegisterEmail.getText().toString().trim();
        String password = etRegisterPassword.getText().toString().trim();
        String userType = actvUserType.getText().toString().trim();

        // Validações
        if (!validateRegisterInputs(name, cpf, phone, email, password, userType)) {
            return;
        }

        // Verificar se e-mail já existe
        if (dbHelper.emailExists(email)) {
            tilRegisterEmail.setError("Este e-mail já está cadastrado");
            return;
        }

        // Criar novo usuário
        Usuario newUser = new Usuario();
        newUser.setNome(name);
        newUser.setCpf(cpf);
        newUser.setTelefone(phone);
        newUser.setEmail(email);
        newUser.setSenha(password);
        newUser.setTipo(userType.equals(getString(R.string.user_type_client)) ? "CLIENTE" : "MOTOBOY");

        long userId = dbHelper.insertUser(newUser);
        if (userId > 0) {
            newUser.setId((int) userId);
            saveUserSession(newUser);
            redirectToMainActivity();
            Toast.makeText(this, "Cadastro realizado com sucesso!", Toast.LENGTH_SHORT).show();
        } else {
            Toast.makeText(this, "Erro ao criar conta. Tente novamente.", Toast.LENGTH_SHORT).show();
        }
    }

    private boolean validateLoginInputs(String email, String password) {
        boolean isValid = true;

        // Validar e-mail
        if (TextUtils.isEmpty(email)) {
            tilLoginEmail.setError("E-mail é obrigatório");
            isValid = false;
        } else if (!isValidEmail(email)) {
            tilLoginEmail.setError("E-mail inválido");
            isValid = false;
        } else {
            tilLoginEmail.setError(null);
        }

        // Validar senha
        if (TextUtils.isEmpty(password)) {
            tilLoginPassword.setError("Senha é obrigatória");
            isValid = false;
        } else {
            tilLoginPassword.setError(null);
        }

        return isValid;
    }

    private boolean validateRegisterInputs(String name, String cpf, String phone, String email, String password, String userType) {
        boolean isValid = true;

        // Validar nome
        if (TextUtils.isEmpty(name)) {
            tilRegisterName.setError("Nome é obrigatório");
            isValid = false;
        } else {
            tilRegisterName.setError(null);
        }

        // Validar CPF
        if (TextUtils.isEmpty(cpf)) {
            tilRegisterCpf.setError("CPF é obrigatório");
            isValid = false;
        } else if (!isValidCPF(cpf)) {
            tilRegisterCpf.setError("CPF inválido");
            isValid = false;
        } else {
            tilRegisterCpf.setError(null);
        }

        // Validar telefone
        if (TextUtils.isEmpty(phone)) {
            tilRegisterPhone.setError("Telefone é obrigatório");
            isValid = false;
        } else {
            tilRegisterPhone.setError(null);
        }

        // Validar e-mail
        if (TextUtils.isEmpty(email)) {
            tilRegisterEmail.setError("E-mail é obrigatório");
            isValid = false;
        } else if (!isValidEmail(email)) {
            tilRegisterEmail.setError("E-mail inválido");
            isValid = false;
        } else {
            tilRegisterEmail.setError(null);
        }

        // Validar senha
        if (TextUtils.isEmpty(password)) {
            tilRegisterPassword.setError("Senha é obrigatória");
            isValid = false;
        } else if (password.length() < 6) {
            tilRegisterPassword.setError("Senha deve ter pelo menos 6 caracteres");
            isValid = false;
        } else {
            tilRegisterPassword.setError(null);
        }

        // Validar tipo de usuário
        if (TextUtils.isEmpty(userType)) {
            tilUserType.setError("Tipo de usuário é obrigatório");
            isValid = false;
        } else {
            tilUserType.setError(null);
        }

        return isValid;
    }

    private boolean isValidEmail(String email) {
        return Pattern.compile("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$").matcher(email).matches();
    }

    private boolean isValidCPF(String cpf) {
        // Remove pontos e traços
        cpf = cpf.replaceAll("[^0-9]", "");
        return cpf.length() == 11 && !cpf.matches("(\\d)\\1{10}"); // Validação básica
    }

    private void saveUserSession(Usuario usuario) {
        SharedPreferences.Editor editor = preferences.edit();
        editor.putInt(KEY_USER_ID, usuario.getId());
        editor.putString(KEY_USER_TYPE, usuario.getTipo());
        editor.putBoolean(KEY_IS_LOGGED_IN, true);
        editor.apply();
    }

    private boolean isUserLoggedIn() {
        return preferences.getBoolean(KEY_IS_LOGGED_IN, false);
    }

    private void redirectToMainActivity() {
        String userType = preferences.getString(KEY_USER_TYPE, "");
        Intent intent;
        
        if ("CLIENTE".equals(userType)) {
            intent = new Intent(this, ClienteDashboardActivity.class);
        } else if ("MOTOBOY".equals(userType)) {
            intent = new Intent(this, MotoboyMapaActivity.class);
        } else {
            intent = new Intent(this, MainActivity.class);
        }
        
        startActivity(intent);
        finish();
    }

    private void clearAllFields() {
        etLoginEmail.setText("");
        etLoginPassword.setText("");
        etRegisterName.setText("");
        etRegisterCpf.setText("");
        etRegisterPhone.setText("");
        etRegisterEmail.setText("");
        etRegisterPassword.setText("");
        actvUserType.setText("");
        
        // Limpar erros
        tilLoginEmail.setError(null);
        tilLoginPassword.setError(null);
        tilRegisterName.setError(null);
        tilRegisterCpf.setError(null);
        tilRegisterPhone.setError(null);
        tilRegisterEmail.setError(null);
        tilRegisterPassword.setError(null);
        tilUserType.setError(null);
    }
}

