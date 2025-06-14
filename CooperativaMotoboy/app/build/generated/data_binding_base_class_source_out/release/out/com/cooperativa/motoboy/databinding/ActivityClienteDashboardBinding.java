// Generated by view binder compiler. Do not edit!
package com.cooperativa.motoboy.databinding;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.cardview.widget.CardView;
import androidx.coordinatorlayout.widget.CoordinatorLayout;
import androidx.recyclerview.widget.RecyclerView;
import androidx.viewbinding.ViewBinding;
import androidx.viewbinding.ViewBindings;
import com.cooperativa.motoboy.R;
import com.google.android.material.floatingactionbutton.FloatingActionButton;
import java.lang.NullPointerException;
import java.lang.Override;
import java.lang.String;

public final class ActivityClienteDashboardBinding implements ViewBinding {
  @NonNull
  private final CoordinatorLayout rootView;

  @NonNull
  public final CardView cardEntregasAndamento;

  @NonNull
  public final CardView cardHistorico;

  @NonNull
  public final CardView cardSolicitarEntrega;

  @NonNull
  public final FloatingActionButton fabNovaEntrega;

  @NonNull
  public final RecyclerView rvEntregasRecentes;

  @NonNull
  public final TextView tvEntregasAndamento;

  @NonNull
  public final TextView tvEntregasFinalizadas;

  @NonNull
  public final TextView tvTotalEntregas;

  @NonNull
  public final TextView tvWelcomeUser;

  private ActivityClienteDashboardBinding(@NonNull CoordinatorLayout rootView,
      @NonNull CardView cardEntregasAndamento, @NonNull CardView cardHistorico,
      @NonNull CardView cardSolicitarEntrega, @NonNull FloatingActionButton fabNovaEntrega,
      @NonNull RecyclerView rvEntregasRecentes, @NonNull TextView tvEntregasAndamento,
      @NonNull TextView tvEntregasFinalizadas, @NonNull TextView tvTotalEntregas,
      @NonNull TextView tvWelcomeUser) {
    this.rootView = rootView;
    this.cardEntregasAndamento = cardEntregasAndamento;
    this.cardHistorico = cardHistorico;
    this.cardSolicitarEntrega = cardSolicitarEntrega;
    this.fabNovaEntrega = fabNovaEntrega;
    this.rvEntregasRecentes = rvEntregasRecentes;
    this.tvEntregasAndamento = tvEntregasAndamento;
    this.tvEntregasFinalizadas = tvEntregasFinalizadas;
    this.tvTotalEntregas = tvTotalEntregas;
    this.tvWelcomeUser = tvWelcomeUser;
  }

  @Override
  @NonNull
  public CoordinatorLayout getRoot() {
    return rootView;
  }

  @NonNull
  public static ActivityClienteDashboardBinding inflate(@NonNull LayoutInflater inflater) {
    return inflate(inflater, null, false);
  }

  @NonNull
  public static ActivityClienteDashboardBinding inflate(@NonNull LayoutInflater inflater,
      @Nullable ViewGroup parent, boolean attachToParent) {
    View root = inflater.inflate(R.layout.activity_cliente_dashboard, parent, false);
    if (attachToParent) {
      parent.addView(root);
    }
    return bind(root);
  }

  @NonNull
  public static ActivityClienteDashboardBinding bind(@NonNull View rootView) {
    // The body of this method is generated in a way you would not otherwise write.
    // This is done to optimize the compiled bytecode for size and performance.
    int id;
    missingId: {
      id = R.id.cardEntregasAndamento;
      CardView cardEntregasAndamento = ViewBindings.findChildViewById(rootView, id);
      if (cardEntregasAndamento == null) {
        break missingId;
      }

      id = R.id.cardHistorico;
      CardView cardHistorico = ViewBindings.findChildViewById(rootView, id);
      if (cardHistorico == null) {
        break missingId;
      }

      id = R.id.cardSolicitarEntrega;
      CardView cardSolicitarEntrega = ViewBindings.findChildViewById(rootView, id);
      if (cardSolicitarEntrega == null) {
        break missingId;
      }

      id = R.id.fabNovaEntrega;
      FloatingActionButton fabNovaEntrega = ViewBindings.findChildViewById(rootView, id);
      if (fabNovaEntrega == null) {
        break missingId;
      }

      id = R.id.rvEntregasRecentes;
      RecyclerView rvEntregasRecentes = ViewBindings.findChildViewById(rootView, id);
      if (rvEntregasRecentes == null) {
        break missingId;
      }

      id = R.id.tvEntregasAndamento;
      TextView tvEntregasAndamento = ViewBindings.findChildViewById(rootView, id);
      if (tvEntregasAndamento == null) {
        break missingId;
      }

      id = R.id.tvEntregasFinalizadas;
      TextView tvEntregasFinalizadas = ViewBindings.findChildViewById(rootView, id);
      if (tvEntregasFinalizadas == null) {
        break missingId;
      }

      id = R.id.tvTotalEntregas;
      TextView tvTotalEntregas = ViewBindings.findChildViewById(rootView, id);
      if (tvTotalEntregas == null) {
        break missingId;
      }

      id = R.id.tvWelcomeUser;
      TextView tvWelcomeUser = ViewBindings.findChildViewById(rootView, id);
      if (tvWelcomeUser == null) {
        break missingId;
      }

      return new ActivityClienteDashboardBinding((CoordinatorLayout) rootView,
          cardEntregasAndamento, cardHistorico, cardSolicitarEntrega, fabNovaEntrega,
          rvEntregasRecentes, tvEntregasAndamento, tvEntregasFinalizadas, tvTotalEntregas,
          tvWelcomeUser);
    }
    String missingId = rootView.getResources().getResourceName(id);
    throw new NullPointerException("Missing required view with ID: ".concat(missingId));
  }
}
