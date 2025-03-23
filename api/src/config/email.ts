import nodemailer from 'nodemailer';
import { config } from './config';

// Configuration du transporteur d'email
export const transporter = nodemailer.createTransport({
  host: config.email.host,
  port: config.email.port,
  secure: true, // true for 465, false for other ports like 587
  auth: {
    user: config.email.user,
    pass: config.email.password,
  },
  debug: true, // Activer les logs de débogage
  logger: true, // Activer les logs
});

// Vérifier la configuration du transporteur
transporter.verify((error, success) => {
  if (error) {
    console.error('Erreur de configuration du transporteur email:', error);
  } else {
    console.log('Configuration du transporteur email réussie');
  }
});

// Template pour l'email de réinitialisation de mot de passe
export const getPasswordResetEmailTemplate = (username: string, resetToken: string, resetUrl: string) => {
  const emailTemplate = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Réinitialisation de mot de passe - Porotein</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
          
          body {
            font-family: 'Inter', sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f5f5f5;
          }
          
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          
          .header {
            text-align: center;
            padding: 20px 0;
            border-bottom: 2px solid #f0f0f0;
          }
          
          .logo {
            max-width: 150px;
            height: auto;
            margin-bottom: 20px;
          }
          
          .content {
            padding: 30px 20px;
          }
          
          h1 {
            color: #1a1a1a;
            font-size: 24px;
            font-weight: 600;
            margin-bottom: 20px;
            text-align: center;
          }
          
          p {
            margin-bottom: 20px;
            color: #4a4a4a;
          }
          
          .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #3f51b5;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 500;
            text-align: center;
            margin: 20px 0;
          }
          
          .footer {
            text-align: center;
            padding: 20px;
            border-top: 2px solid #f0f0f0;
            color: #666;
            font-size: 14px;
          }
          
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img src="https://porotein.fr/porotein-logo.png" alt="Porotein Logo" class="logo">
            <h1>Réinitialisation de mot de passe</h1>
          </div>
          
          <div class="content">
            <p>Bonjour <b>${username}</b>,</p>
            
            <p>Vous avez demandé la réinitialisation de votre mot de passe sur Porotein. Pour procéder à la réinitialisation, cliquez sur le bouton ci-dessous :</p>
            
            <div style="text-align: center;">
              <a href="${resetUrl}?token=${resetToken}" class="button">
                Réinitialiser mon mot de passe
              </a>
            </div>
            
            <p>Ce lien expirera dans 1 heure pour des raisons de sécurité.</p>
            
            <p>Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet email en toute sécurité.</p>
          </div>
          
          <div class="footer">
            <p>© ${new Date().getFullYear()} Porotein. Tous droits réservés.</p>
            
            <p>Pour toute question, contactez-nous à contact@porotein.fr</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return {
    subject: 'Réinitialisation de votre mot de passe - Porotein',
    html: emailTemplate,
  };
};

// Template pour l'email de confirmation d'inscription
export const getRegistrationEmailTemplate = (username: string, verificationToken: string, verificationUrl: string) => {
  const emailTemplate = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Confirmation de votre inscription - Porotein</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
          
          body {
            font-family: 'Inter', sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            overflow: auto;
            padding: 20px;
            background-color: #f5f5f5;
          }
          
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          
          .header {
            text-align: center;
            padding: 20px 0;
            border-bottom: 2px solid #f0f0f0;
          }
          
          .logo {
            max-width: 150px;
            height: auto;
            margin-bottom: 20px;
          }
          
          .content {
            padding: 30px 20px;
          }
          
          h1 {
            color: #1a1a1a;
            font-size: 24px;
            font-weight: 600;
            margin-bottom: 20px;
            text-align: center;
          }
          
          p {
            margin-bottom: 20px;
            color: #4a4a4a;
          }
          
          .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #3f51b5;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 500;
            text-align: center;
            margin: 20px 0;
          }
          
          .footer {
            text-align: center;
            padding: 20px;
            border-top: 2px solid #f0f0f0;
            color: #666;
            font-size: 14px;
          }
          
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img src="https://porotein.fr/porotein-logo.png" alt="Porotein Logo" class="logo">
            <h1>Confirmation de votre inscription</h1>
          </div>
          
          <div class="content">
            <p>Bonjour <b>${username}</b>,</p>
            
            <p>Merci de vous être inscrit sur Porotein ! Pour confirmer votre adresse email et accéder à votre compte, cliquez sur le bouton ci-dessous :</p>
            
            <div style="text-align: center;">
              <a href="${verificationUrl}?token=${verificationToken}" class="button">
                Confirmer mon email
              </a>
            </div>
            
            <p>Ce lien expirera dans 24 heures pour des raisons de sécurité.</p>
            
            <p>Si vous n'avez pas créé de compte sur Porotein, vous pouvez ignorer cet email en toute sécurité.</p>
          </div>
          
          <div class="footer">
            <p>© ${new Date().getFullYear()} Porotein. Tous droits réservés.</p>
            
            <p>Pour toute question, contactez-nous à contact@porotein.fr</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return {
    subject: 'Confirmation de votre inscription - Porotein',
    html: emailTemplate,
  };
};

export const getMagicLinkEmailTemplate = (username: string, token: string, magicLinkUrl: string) => {
  const encodedToken = encodeURIComponent(token);
  const emailTemplate = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Connexion à votre compte - Porotein</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
          
          body {
            font-family: 'Inter', sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f5f5f5;
          }
          
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          
          .header {
            text-align: center;
            padding: 20px 0;
            border-bottom: 2px solid #f0f0f0;
          }
          
          .logo {
            max-width: 150px;
            height: auto;
            margin-bottom: 20px;
          }
          
          .content {
            padding: 30px 20px;
          }
          
          h1 {
            color: #1a1a1a;
            font-size: 24px;
            font-weight: 600;
            margin-bottom: 20px;
            text-align: center;
          }
          
          p {
            margin-bottom: 20px;
            color: #4a4a4a;
          }
          
          .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #3f51b5;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 500;
            text-align: center;
            margin: 20px 0;
          }
          
          .footer {
            text-align: center;
            padding: 20px;
            border-top: 2px solid #f0f0f0;
            color: #666;
            font-size: 14px;
          }
          
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img src="https://porotein.fr/porotein-logo.png" alt="Porotein Logo" class="logo">
            <h1>Connexion à votre compte</h1>
          </div>
          
          <div class="content">
            <p>Bonjour <b>${username}</b>,</p>
            
            <p>Vous avez demandé à vous connecter à votre compte. Cliquez sur le bouton ci-dessous pour vous connecter :</p>
            
            <div style="text-align: center;">
              <a href="${magicLinkUrl}?token=${encodedToken}" class="button">
                Se connecter
              </a>
            </div>
            
            <p>Ce lien expirera dans 15 minutes pour des raisons de sécurité.</p>
            
            <p>Si vous n'avez pas demandé cette connexion, vous pouvez ignorer cet email en toute sécurité.</p>
          </div>
          
          <div class="footer">
            <p>© ${new Date().getFullYear()} Porotein. Tous droits réservés.</p>
            
            <p>Pour toute question, contactez-nous à contact@porotein.fr</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return {
    subject: 'Connexion à votre compte - Porotein',
    html: emailTemplate,
  };
}; 