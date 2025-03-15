import nodemailer from 'nodemailer';

// Configuration du transporteur d'email
export const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Template pour l'email de réinitialisation de mot de passe
export const getPasswordResetEmailTemplate = (username: string, resetToken: string, resetUrl: string) => {
  return {
    subject: 'Réinitialisation de votre mot de passe - Porotein',
    html: `
      <h1>Bonjour ${username},</h1>
      <p>Vous avez demandé la réinitialisation de votre mot de passe.</p>
      <p>Cliquez sur le lien ci-dessous pour réinitialiser votre mot de passe :</p>
      <a href="${resetUrl}?token=${resetToken}" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">
        Réinitialiser mon mot de passe
      </a>
      <p>Ce lien expirera dans 1 heure.</p>
      <p>Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet email.</p>
      <p>Cordialement,<br>L'équipe Porotein</p>
    `,
  };
}; 