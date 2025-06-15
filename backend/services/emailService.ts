import nodemailer from 'nodemailer';
import crypto from 'crypto';

interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

// Configuração do SMTP (exemplo com Gmail)
// Em produção, use variáveis de ambiente
const emailConfig: EmailConfig = {
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true para 465, false para outras portas
  auth: {
    user: process.env.SMTP_USER || 'juliocamposmachado@gmail.com',
    pass: process.env.SMTP_PASS || 'rwtozztiprpwjxcok'
  }
};

const transporter = nodemailer.createTransport(emailConfig);

export class EmailService {
  private static instance: EmailService;

  private constructor() {}

  public static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  /**
   * Gera um token de verificação
   */
  generateVerificationToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Envia email de verificação para motoboy
   */
  async sendMotoboyVerificationEmail(email: string, name: string, token: string): Promise<boolean> {
    try {
      const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-motoboy?token=${token}`;
      
      const mailOptions = {
        from: `"Monopoly Express" <${emailConfig.auth.user}>`,
        to: email,
        subject: 'Verificação de E-mail - Monopoly Express Motoboy',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #f97316; padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">🏍️ Monopoly Express</h1>
            </div>
            
            <div style="padding: 30px; background-color: #ffffff;">
              <h2 style="color: #333;">Olá, ${name}!</h2>
              
              <p style="color: #666; line-height: 1.6;">
                Bem-vindo à Monopoly Express! Você se cadastrou como motoboy em nossa plataforma.
              </p>
              
              <p style="color: #666; line-height: 1.6;">
                Para ativar sua conta e começar a receber corridas, você precisa verificar seu e-mail clicando no botão abaixo:
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${verificationUrl}" 
                   style="background-color: #f97316; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                  Verificar E-mail
                </a>
              </div>
              
              <p style="color: #666; line-height: 1.6; font-size: 14px;">
                Se o botão não funcionar, copie e cole este link em seu navegador:
                <br>
                <a href="${verificationUrl}" style="color: #f97316;">${verificationUrl}</a>
              </p>
              
              <div style="margin-top: 30px; padding: 20px; background-color: #fef3cd; border-radius: 5px;">
                <p style="color: #856404; margin: 0; font-size: 14px;">
                  <strong>⚠️ Importante:</strong> Após a verificação, sua conta passará por uma análise nossa equipe. 
                  Você será notificado quando sua conta for aprovada para começar a trabalhar.
                </p>
              </div>
            </div>
            
            <div style="background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666;">
              <p>Este é um e-mail automático, não responda.</p>
              <p>Monopoly Express - Entregas Rápidas e Seguras</p>
            </div>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);
      console.log(`✅ Email de verificação enviado para: ${email}`);
      return true;
    } catch (error) {
      console.error('❌ Erro ao enviar email de verificação:', error);
      return false;
    }
  }

  /**
   * Envia email de aprovação para motoboy
   */
  async sendMotoboyApprovalEmail(email: string, name: string): Promise<boolean> {
    try {
      const loginUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/login`;
      
      const mailOptions = {
        from: `"Monopoly Express" <${emailConfig.auth.user}>`,
        to: email,
        subject: '🎉 Conta Aprovada - Monopoly Express',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #22c55e; padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">🏍️ Monopoly Express</h1>
            </div>
            
            <div style="padding: 30px; background-color: #ffffff;">
              <h2 style="color: #333;">Parabéns, ${name}! 🎉</h2>
              
              <p style="color: #666; line-height: 1.6;">
                Sua conta foi <strong>aprovada</strong> e você já pode começar a trabalhar como motoboy na Monopoly Express!
              </p>
              
              <div style="background-color: #dcfce7; padding: 20px; border-radius: 5px; margin: 20px 0;">
                <p style="color: #166534; margin: 0; font-weight: bold;">
                  ✅ Conta verificada e aprovada<br>
                  ✅ Já pode receber corridas<br>
                  ✅ Comece a ganhar dinheiro agora!
                </p>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${loginUrl}" 
                   style="background-color: #22c55e; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                  Fazer Login
                </a>
              </div>
              
              <p style="color: #666; line-height: 1.6;">
                Agora você pode fazer login no app e começar a aceitar corridas. Lembre-se de manter seu status online para receber as solicitações.
              </p>
            </div>
            
            <div style="background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666;">
              <p>Monopoly Express - Entregas Rápidas e Seguras</p>
            </div>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);
      console.log(`✅ Email de aprovação enviado para: ${email}`);
      return true;
    } catch (error) {
      console.error('❌ Erro ao enviar email de aprovação:', error);
      return false;
    }
  }

  /**
   * Envia email de verificação para usuários
   */
  async sendUserVerificationEmail(email: string, name: string, token: string): Promise<boolean> {
    try {
      const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-user?token=${token}`;
      
      const mailOptions = {
        from: `"Monopoly Express" <${emailConfig.auth.user}>`,
        to: email,
        subject: 'Verificação de E-mail - Monopoly Express',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #3b82f6; padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">📦 Monopoly Express</h1>
            </div>
            
            <div style="padding: 30px; background-color: #ffffff;">
              <h2 style="color: #333;">Olá, ${name}!</h2>
              
              <p style="color: #666; line-height: 1.6;">
                Bem-vindo à Monopoly Express! Para começar a usar nossa plataforma de entregas, você precisa verificar seu e-mail.
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${verificationUrl}" 
                   style="background-color: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                  Verificar E-mail
                </a>
              </div>
              
              <p style="color: #666; line-height: 1.6; font-size: 14px;">
                Se o botão não funcionar, copie e cole este link em seu navegador:
                <br>
                <a href="${verificationUrl}" style="color: #3b82f6;">${verificationUrl}</a>
              </p>
            </div>
            
            <div style="background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666;">
              <p>Este é um e-mail automático, não responda.</p>
              <p>Monopoly Express - Entregas Rápidas e Seguras</p>
            </div>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);
      console.log(`✅ Email de verificação enviado para: ${email}`);
      return true;
    } catch (error) {
      console.error('❌ Erro ao enviar email de verificação:', error);
      return false;
    }
  }
}

