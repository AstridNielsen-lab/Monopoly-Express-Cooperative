// Generated by view binder compiler. Do not edit!
package com.cooperativa.motoboy.databinding;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.viewbinding.ViewBinding;
import androidx.viewbinding.ViewBindings;
import com.cooperativa.motoboy.R;
import com.google.android.material.button.MaterialButton;
import com.google.android.material.card.MaterialCardView;
import java.lang.NullPointerException;
import java.lang.Override;
import java.lang.String;

public final class ItemCorridaBinding implements ViewBinding {
  @NonNull
  private final MaterialCardView rootView;

  @NonNull
  public final MaterialButton btnAceitarCorrida;

  @NonNull
  public final TextView tvColeta;

  @NonNull
  public final TextView tvDescricao;

  @NonNull
  public final TextView tvEnderecoColeta;

  @NonNull
  public final TextView tvEnderecoEntrega;

  @NonNull
  public final TextView tvEntrega;

  @NonNull
  public final TextView tvId;

  @NonNull
  public final TextView tvValor;

  private ItemCorridaBinding(@NonNull MaterialCardView rootView,
      @NonNull MaterialButton btnAceitarCorrida, @NonNull TextView tvColeta,
      @NonNull TextView tvDescricao, @NonNull TextView tvEnderecoColeta,
      @NonNull TextView tvEnderecoEntrega, @NonNull TextView tvEntrega, @NonNull TextView tvId,
      @NonNull TextView tvValor) {
    this.rootView = rootView;
    this.btnAceitarCorrida = btnAceitarCorrida;
    this.tvColeta = tvColeta;
    this.tvDescricao = tvDescricao;
    this.tvEnderecoColeta = tvEnderecoColeta;
    this.tvEnderecoEntrega = tvEnderecoEntrega;
    this.tvEntrega = tvEntrega;
    this.tvId = tvId;
    this.tvValor = tvValor;
  }

  @Override
  @NonNull
  public MaterialCardView getRoot() {
    return rootView;
  }

  @NonNull
  public static ItemCorridaBinding inflate(@NonNull LayoutInflater inflater) {
    return inflate(inflater, null, false);
  }

  @NonNull
  public static ItemCorridaBinding inflate(@NonNull LayoutInflater inflater,
      @Nullable ViewGroup parent, boolean attachToParent) {
    View root = inflater.inflate(R.layout.item_corrida, parent, false);
    if (attachToParent) {
      parent.addView(root);
    }
    return bind(root);
  }

  @NonNull
  public static ItemCorridaBinding bind(@NonNull View rootView) {
    // The body of this method is generated in a way you would not otherwise write.
    // This is done to optimize the compiled bytecode for size and performance.
    int id;
    missingId: {
      id = R.id.btnAceitarCorrida;
      MaterialButton btnAceitarCorrida = ViewBindings.findChildViewById(rootView, id);
      if (btnAceitarCorrida == null) {
        break missingId;
      }

      id = R.id.tvColeta;
      TextView tvColeta = ViewBindings.findChildViewById(rootView, id);
      if (tvColeta == null) {
        break missingId;
      }

      id = R.id.tvDescricao;
      TextView tvDescricao = ViewBindings.findChildViewById(rootView, id);
      if (tvDescricao == null) {
        break missingId;
      }

      id = R.id.tvEnderecoColeta;
      TextView tvEnderecoColeta = ViewBindings.findChildViewById(rootView, id);
      if (tvEnderecoColeta == null) {
        break missingId;
      }

      id = R.id.tvEnderecoEntrega;
      TextView tvEnderecoEntrega = ViewBindings.findChildViewById(rootView, id);
      if (tvEnderecoEntrega == null) {
        break missingId;
      }

      id = R.id.tvEntrega;
      TextView tvEntrega = ViewBindings.findChildViewById(rootView, id);
      if (tvEntrega == null) {
        break missingId;
      }

      id = R.id.tvId;
      TextView tvId = ViewBindings.findChildViewById(rootView, id);
      if (tvId == null) {
        break missingId;
      }

      id = R.id.tvValor;
      TextView tvValor = ViewBindings.findChildViewById(rootView, id);
      if (tvValor == null) {
        break missingId;
      }

      return new ItemCorridaBinding((MaterialCardView) rootView, btnAceitarCorrida, tvColeta,
          tvDescricao, tvEnderecoColeta, tvEnderecoEntrega, tvEntrega, tvId, tvValor);
    }
    String missingId = rootView.getResources().getResourceName(id);
    throw new NullPointerException("Missing required view with ID: ".concat(missingId));
  }
}
