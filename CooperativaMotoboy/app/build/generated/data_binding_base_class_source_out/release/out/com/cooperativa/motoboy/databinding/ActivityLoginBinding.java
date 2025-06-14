// Generated by view binder compiler. Do not edit!
package com.cooperativa.motoboy.databinding;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AutoCompleteTextView;
import android.widget.LinearLayout;
import android.widget.ScrollView;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.viewbinding.ViewBinding;
import androidx.viewbinding.ViewBindings;
import com.cooperativa.motoboy.R;
import com.google.android.material.button.MaterialButton;
import com.google.android.material.textfield.TextInputEditText;
import com.google.android.material.textfield.TextInputLayout;
import com.google.android.material.textview.MaterialTextView;
import java.lang.NullPointerException;
import java.lang.Override;
import java.lang.String;

public final class ActivityLoginBinding implements ViewBinding {
  @NonNull
  private final ScrollView rootView;

  @NonNull
  public final AutoCompleteTextView actvUserType;

  @NonNull
  public final MaterialButton btnLogin;

  @NonNull
  public final MaterialButton btnRegister;

  @NonNull
  public final MaterialButton btnSwitchToLogin;

  @NonNull
  public final MaterialButton btnSwitchToRegister;

  @NonNull
  public final TextInputEditText etLoginEmail;

  @NonNull
  public final TextInputEditText etLoginPassword;

  @NonNull
  public final TextInputEditText etRegisterCpf;

  @NonNull
  public final TextInputEditText etRegisterEmail;

  @NonNull
  public final TextInputEditText etRegisterName;

  @NonNull
  public final TextInputEditText etRegisterPassword;

  @NonNull
  public final TextInputEditText etRegisterPhone;

  @NonNull
  public final LinearLayout loginContainer;

  @NonNull
  public final LinearLayout registerContainer;

  @NonNull
  public final TextInputLayout tilLoginEmail;

  @NonNull
  public final TextInputLayout tilLoginPassword;

  @NonNull
  public final TextInputLayout tilRegisterCpf;

  @NonNull
  public final TextInputLayout tilRegisterEmail;

  @NonNull
  public final TextInputLayout tilRegisterName;

  @NonNull
  public final TextInputLayout tilRegisterPassword;

  @NonNull
  public final TextInputLayout tilRegisterPhone;

  @NonNull
  public final TextInputLayout tilUserType;

  @NonNull
  public final MaterialTextView tvTitle;

  private ActivityLoginBinding(@NonNull ScrollView rootView,
      @NonNull AutoCompleteTextView actvUserType, @NonNull MaterialButton btnLogin,
      @NonNull MaterialButton btnRegister, @NonNull MaterialButton btnSwitchToLogin,
      @NonNull MaterialButton btnSwitchToRegister, @NonNull TextInputEditText etLoginEmail,
      @NonNull TextInputEditText etLoginPassword, @NonNull TextInputEditText etRegisterCpf,
      @NonNull TextInputEditText etRegisterEmail, @NonNull TextInputEditText etRegisterName,
      @NonNull TextInputEditText etRegisterPassword, @NonNull TextInputEditText etRegisterPhone,
      @NonNull LinearLayout loginContainer, @NonNull LinearLayout registerContainer,
      @NonNull TextInputLayout tilLoginEmail, @NonNull TextInputLayout tilLoginPassword,
      @NonNull TextInputLayout tilRegisterCpf, @NonNull TextInputLayout tilRegisterEmail,
      @NonNull TextInputLayout tilRegisterName, @NonNull TextInputLayout tilRegisterPassword,
      @NonNull TextInputLayout tilRegisterPhone, @NonNull TextInputLayout tilUserType,
      @NonNull MaterialTextView tvTitle) {
    this.rootView = rootView;
    this.actvUserType = actvUserType;
    this.btnLogin = btnLogin;
    this.btnRegister = btnRegister;
    this.btnSwitchToLogin = btnSwitchToLogin;
    this.btnSwitchToRegister = btnSwitchToRegister;
    this.etLoginEmail = etLoginEmail;
    this.etLoginPassword = etLoginPassword;
    this.etRegisterCpf = etRegisterCpf;
    this.etRegisterEmail = etRegisterEmail;
    this.etRegisterName = etRegisterName;
    this.etRegisterPassword = etRegisterPassword;
    this.etRegisterPhone = etRegisterPhone;
    this.loginContainer = loginContainer;
    this.registerContainer = registerContainer;
    this.tilLoginEmail = tilLoginEmail;
    this.tilLoginPassword = tilLoginPassword;
    this.tilRegisterCpf = tilRegisterCpf;
    this.tilRegisterEmail = tilRegisterEmail;
    this.tilRegisterName = tilRegisterName;
    this.tilRegisterPassword = tilRegisterPassword;
    this.tilRegisterPhone = tilRegisterPhone;
    this.tilUserType = tilUserType;
    this.tvTitle = tvTitle;
  }

  @Override
  @NonNull
  public ScrollView getRoot() {
    return rootView;
  }

  @NonNull
  public static ActivityLoginBinding inflate(@NonNull LayoutInflater inflater) {
    return inflate(inflater, null, false);
  }

  @NonNull
  public static ActivityLoginBinding inflate(@NonNull LayoutInflater inflater,
      @Nullable ViewGroup parent, boolean attachToParent) {
    View root = inflater.inflate(R.layout.activity_login, parent, false);
    if (attachToParent) {
      parent.addView(root);
    }
    return bind(root);
  }

  @NonNull
  public static ActivityLoginBinding bind(@NonNull View rootView) {
    // The body of this method is generated in a way you would not otherwise write.
    // This is done to optimize the compiled bytecode for size and performance.
    int id;
    missingId: {
      id = R.id.actvUserType;
      AutoCompleteTextView actvUserType = ViewBindings.findChildViewById(rootView, id);
      if (actvUserType == null) {
        break missingId;
      }

      id = R.id.btnLogin;
      MaterialButton btnLogin = ViewBindings.findChildViewById(rootView, id);
      if (btnLogin == null) {
        break missingId;
      }

      id = R.id.btnRegister;
      MaterialButton btnRegister = ViewBindings.findChildViewById(rootView, id);
      if (btnRegister == null) {
        break missingId;
      }

      id = R.id.btnSwitchToLogin;
      MaterialButton btnSwitchToLogin = ViewBindings.findChildViewById(rootView, id);
      if (btnSwitchToLogin == null) {
        break missingId;
      }

      id = R.id.btnSwitchToRegister;
      MaterialButton btnSwitchToRegister = ViewBindings.findChildViewById(rootView, id);
      if (btnSwitchToRegister == null) {
        break missingId;
      }

      id = R.id.etLoginEmail;
      TextInputEditText etLoginEmail = ViewBindings.findChildViewById(rootView, id);
      if (etLoginEmail == null) {
        break missingId;
      }

      id = R.id.etLoginPassword;
      TextInputEditText etLoginPassword = ViewBindings.findChildViewById(rootView, id);
      if (etLoginPassword == null) {
        break missingId;
      }

      id = R.id.etRegisterCpf;
      TextInputEditText etRegisterCpf = ViewBindings.findChildViewById(rootView, id);
      if (etRegisterCpf == null) {
        break missingId;
      }

      id = R.id.etRegisterEmail;
      TextInputEditText etRegisterEmail = ViewBindings.findChildViewById(rootView, id);
      if (etRegisterEmail == null) {
        break missingId;
      }

      id = R.id.etRegisterName;
      TextInputEditText etRegisterName = ViewBindings.findChildViewById(rootView, id);
      if (etRegisterName == null) {
        break missingId;
      }

      id = R.id.etRegisterPassword;
      TextInputEditText etRegisterPassword = ViewBindings.findChildViewById(rootView, id);
      if (etRegisterPassword == null) {
        break missingId;
      }

      id = R.id.etRegisterPhone;
      TextInputEditText etRegisterPhone = ViewBindings.findChildViewById(rootView, id);
      if (etRegisterPhone == null) {
        break missingId;
      }

      id = R.id.loginContainer;
      LinearLayout loginContainer = ViewBindings.findChildViewById(rootView, id);
      if (loginContainer == null) {
        break missingId;
      }

      id = R.id.registerContainer;
      LinearLayout registerContainer = ViewBindings.findChildViewById(rootView, id);
      if (registerContainer == null) {
        break missingId;
      }

      id = R.id.tilLoginEmail;
      TextInputLayout tilLoginEmail = ViewBindings.findChildViewById(rootView, id);
      if (tilLoginEmail == null) {
        break missingId;
      }

      id = R.id.tilLoginPassword;
      TextInputLayout tilLoginPassword = ViewBindings.findChildViewById(rootView, id);
      if (tilLoginPassword == null) {
        break missingId;
      }

      id = R.id.tilRegisterCpf;
      TextInputLayout tilRegisterCpf = ViewBindings.findChildViewById(rootView, id);
      if (tilRegisterCpf == null) {
        break missingId;
      }

      id = R.id.tilRegisterEmail;
      TextInputLayout tilRegisterEmail = ViewBindings.findChildViewById(rootView, id);
      if (tilRegisterEmail == null) {
        break missingId;
      }

      id = R.id.tilRegisterName;
      TextInputLayout tilRegisterName = ViewBindings.findChildViewById(rootView, id);
      if (tilRegisterName == null) {
        break missingId;
      }

      id = R.id.tilRegisterPassword;
      TextInputLayout tilRegisterPassword = ViewBindings.findChildViewById(rootView, id);
      if (tilRegisterPassword == null) {
        break missingId;
      }

      id = R.id.tilRegisterPhone;
      TextInputLayout tilRegisterPhone = ViewBindings.findChildViewById(rootView, id);
      if (tilRegisterPhone == null) {
        break missingId;
      }

      id = R.id.tilUserType;
      TextInputLayout tilUserType = ViewBindings.findChildViewById(rootView, id);
      if (tilUserType == null) {
        break missingId;
      }

      id = R.id.tvTitle;
      MaterialTextView tvTitle = ViewBindings.findChildViewById(rootView, id);
      if (tvTitle == null) {
        break missingId;
      }

      return new ActivityLoginBinding((ScrollView) rootView, actvUserType, btnLogin, btnRegister,
          btnSwitchToLogin, btnSwitchToRegister, etLoginEmail, etLoginPassword, etRegisterCpf,
          etRegisterEmail, etRegisterName, etRegisterPassword, etRegisterPhone, loginContainer,
          registerContainer, tilLoginEmail, tilLoginPassword, tilRegisterCpf, tilRegisterEmail,
          tilRegisterName, tilRegisterPassword, tilRegisterPhone, tilUserType, tvTitle);
    }
    String missingId = rootView.getResources().getResourceName(id);
    throw new NullPointerException("Missing required view with ID: ".concat(missingId));
  }
}
