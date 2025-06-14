package com.cooperativa.motoboy;

import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.view.animation.Animation;
import android.view.animation.AnimationUtils;
import android.widget.ImageView;
import android.widget.ProgressBar;
import android.widget.TextView;
import androidx.appcompat.app.AppCompatActivity;

public class SplashActivity extends AppCompatActivity {

    private static final int SPLASH_DURATION = 3000; // 3 segundos
    
    private ImageView ivLogo;
    private TextView tvAppName;
    private ProgressBar progressBar;
    private Handler handler;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_splash);

        initViews();
        startAnimations();
        scheduleMainActivity();
    }

    private void initViews() {
        ivLogo = findViewById(R.id.ivLogo);
        tvAppName = findViewById(R.id.tvAppName);
        progressBar = findViewById(R.id.progressBar);
    }

    private void startAnimations() {
        // Animação de fade in para o logo
        Animation fadeIn = AnimationUtils.loadAnimation(this, R.anim.fade_in);
        ivLogo.startAnimation(fadeIn);
        
        // Animação de slide up para o texto
        Animation slideUp = AnimationUtils.loadAnimation(this, R.anim.slide_up);
        tvAppName.startAnimation(slideUp);
        
        // Animação de rotação para o progress bar
        Animation rotate = AnimationUtils.loadAnimation(this, R.anim.rotate);
        progressBar.startAnimation(rotate);
    }

    private void scheduleMainActivity() {
        handler = new Handler();
        handler.postDelayed(new Runnable() {
            @Override
            public void run() {
                // Verificar se usuário já está logado
                Intent intent = new Intent(SplashActivity.this, LoginActivity.class);
                startActivity(intent);
                finish();
            }
        }, SPLASH_DURATION);
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        if (handler != null) {
            handler.removeCallbacksAndMessages(null);
        }
    }
}

