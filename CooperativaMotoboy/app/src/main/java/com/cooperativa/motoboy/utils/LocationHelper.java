package com.cooperativa.motoboy.utils;

import android.Manifest;
import android.content.Context;
import android.content.pm.PackageManager;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;
import androidx.core.app.ActivityCompat;

public class LocationHelper {
    private static final String TAG = "LocationHelper";
    private static final long MIN_TIME_BETWEEN_UPDATES = 5000; // 5 segundos
    private static final float MIN_DISTANCE_CHANGE_FOR_UPDATES = 10; // 10 metros
    
    private final Context context;
    private final LocationManager locationManager;
    private final LocationListener locationListener;
    private final OnLocationUpdateListener updateListener;
    private final Handler mainHandler;
    
    private Location lastKnownLocation;
    private boolean isRequestingLocationUpdates = false;
    
    public interface OnLocationUpdateListener {
        void onLocationUpdate(double latitude, double longitude, float accuracy);
        void onLocationError(String error);
        void onPermissionRequired();
    }
    
    public LocationHelper(Context context, OnLocationUpdateListener listener) {
        this.context = context;
        this.updateListener = listener;
        this.locationManager = (LocationManager) context.getSystemService(Context.LOCATION_SERVICE);
        this.mainHandler = new Handler(Looper.getMainLooper());
        
        this.locationListener = new LocationListener() {
            @Override
            public void onLocationChanged(Location location) {
                handleLocationUpdate(location);
            }
            
            @Override
            public void onStatusChanged(String provider, int status, Bundle extras) {
                Log.d(TAG, "Provider status changed: " + provider + " - " + status);
            }
            
            @Override
            public void onProviderEnabled(String provider) {
                Log.d(TAG, "Provider enabled: " + provider);
                startLocationUpdates();
            }
            
            @Override
            public void onProviderDisabled(String provider) {
                Log.d(TAG, "Provider disabled: " + provider);
                if (updateListener != null) {
                    updateListener.onLocationError("GPS desativado. Ative o GPS para continuar.");
                }
            }
        };
    }
    
    public void startLocationUpdates() {
        if (!hasLocationPermission()) {
            if (updateListener != null) {
                updateListener.onPermissionRequired();
            }
            return;
        }
        
        if (!isGpsEnabled()) {
            if (updateListener != null) {
                updateListener.onLocationError("GPS está desativado. Ative o GPS nas configurações.");
            }
            return;
        }
        
        try {
            // Primeiro tentar obter a última localização conhecida
            Location lastLocation = getLastKnownLocation();
            if (lastLocation != null && isLocationValid(lastLocation)) {
                handleLocationUpdate(lastLocation);
            }
            
            // Iniciar atualizações de localização
            if (!isRequestingLocationUpdates) {
                locationManager.requestLocationUpdates(
                    LocationManager.GPS_PROVIDER,
                    MIN_TIME_BETWEEN_UPDATES,
                    MIN_DISTANCE_CHANGE_FOR_UPDATES,
                    locationListener
                );
                
                // Fallback para Network Provider se disponível
                if (locationManager.isProviderEnabled(LocationManager.NETWORK_PROVIDER)) {
                    locationManager.requestLocationUpdates(
                        LocationManager.NETWORK_PROVIDER,
                        MIN_TIME_BETWEEN_UPDATES,
                        MIN_DISTANCE_CHANGE_FOR_UPDATES,
                        locationListener
                    );
                }
                
                isRequestingLocationUpdates = true;
                Log.d(TAG, "Atualizações de localização iniciadas");
            }
            
        } catch (SecurityException e) {
            Log.e(TAG, "Erro de permissão ao iniciar localização", e);
            if (updateListener != null) {
                updateListener.onPermissionRequired();
            }
        } catch (Exception e) {
            Log.e(TAG, "Erro ao iniciar localização", e);
            if (updateListener != null) {
                updateListener.onLocationError("Erro ao acessar GPS: " + e.getMessage());
            }
        }
    }
    
    public void stopLocationUpdates() {
        try {
            if (isRequestingLocationUpdates) {
                locationManager.removeUpdates(locationListener);
                isRequestingLocationUpdates = false;
                Log.d(TAG, "Atualizações de localização paradas");
            }
        } catch (Exception e) {
            Log.e(TAG, "Erro ao parar localização", e);
        }
    }
    
    public Location getLastKnownLocation() {
        if (!hasLocationPermission()) {
            return null;
        }
        
        try {
            Location gpsLocation = locationManager.getLastKnownLocation(LocationManager.GPS_PROVIDER);
            Location networkLocation = locationManager.getLastKnownLocation(LocationManager.NETWORK_PROVIDER);
            
            // Retornar a localização mais recente
            if (gpsLocation != null && networkLocation != null) {
                return gpsLocation.getTime() > networkLocation.getTime() ? gpsLocation : networkLocation;
            } else if (gpsLocation != null) {
                return gpsLocation;
            } else {
                return networkLocation;
            }
        } catch (SecurityException e) {
            Log.e(TAG, "Erro de permissão ao obter última localização", e);
            return null;
        }
    }
    
    public boolean hasLocationPermission() {
        return ActivityCompat.checkSelfPermission(context, Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED ||
               ActivityCompat.checkSelfPermission(context, Manifest.permission.ACCESS_COARSE_LOCATION) == PackageManager.PERMISSION_GRANTED;
    }
    
    public boolean isGpsEnabled() {
        return locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER) ||
               locationManager.isProviderEnabled(LocationManager.NETWORK_PROVIDER);
    }
    
    public Location getCurrentLocation() {
        return lastKnownLocation;
    }
    
    public String getLocationString() {
        if (lastKnownLocation != null) {
            return String.format("%.6f, %.6f", 
                lastKnownLocation.getLatitude(), 
                lastKnownLocation.getLongitude());
        }
        return "Localização indisponível";
    }
    
    public double getDistanceTo(double destLatitude, double destLongitude) {
        if (lastKnownLocation == null) {
            return 0;
        }
        
        float[] results = new float[1];
        Location.distanceBetween(
            lastKnownLocation.getLatitude(),
            lastKnownLocation.getLongitude(),
            destLatitude,
            destLongitude,
            results
        );
        
        return results[0] / 1000.0; // Converter para quilômetros
    }
    
    private void handleLocationUpdate(Location location) {
        if (location != null && isLocationValid(location)) {
            lastKnownLocation = location;
            
            Log.d(TAG, String.format("Nova localização: %.6f, %.6f (Precisão: %.1fm)",
                location.getLatitude(), location.getLongitude(), location.getAccuracy()));
            
            // Notificar no thread principal
            mainHandler.post(() -> {
                if (updateListener != null) {
                    updateListener.onLocationUpdate(
                        location.getLatitude(),
                        location.getLongitude(),
                        location.getAccuracy()
                    );
                }
            });
        }
    }
    
    private boolean isLocationValid(Location location) {
        if (location == null) {
            return false;
        }
        
        // Verificar se a localização não é muito antiga (máximo 5 minutos)
        long fiveMinutesAgo = System.currentTimeMillis() - (5 * 60 * 1000);
        if (location.getTime() < fiveMinutesAgo) {
            return false;
        }
        
        // Verificar se a precisão é aceitável (máximo 100 metros)
        return location.getAccuracy() <= 100;
    }
    
    // Método para simular localização (apenas para testes)
    public void simulateLocation(double latitude, double longitude) {
        if (updateListener != null) {
            Log.d(TAG, "Simulando localização: " + latitude + ", " + longitude);
            updateListener.onLocationUpdate(latitude, longitude, 10.0f);
        }
    }
}

