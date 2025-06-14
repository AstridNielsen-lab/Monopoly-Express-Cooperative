package com.cooperativa.motoboy;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import androidx.appcompat.app.AppCompatActivity;
import com.google.android.material.button.MaterialButton;

public class MainActivity extends AppCompatActivity {

    private MaterialButton btnCliente;
    private MaterialButton btnMotoboy;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        initViews();
        setupClickListeners();
    }

    private void initViews() {
        btnCliente = findViewById(R.id.btnCliente);
        btnMotoboy = findViewById(R.id.btnMotoboy);
        
        // Adicionar dados de teste na primeira execução (descomente para teste)
        // GerenciadorCorridas.getInstance().adicionarDadosTeste();
    }

    private void setupClickListeners() {
        btnCliente.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(MainActivity.this, ClienteActivity.class);
                startActivity(intent);
            }
        });

        btnMotoboy.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(MainActivity.this, MotoboyActivity.class);
                startActivity(intent);
            }
        });
    }
}

