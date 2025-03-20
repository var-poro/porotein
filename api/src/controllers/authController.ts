import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { Schema } from 'mongoose';
import crypto from 'crypto';
import { transporter, getPasswordResetEmailTemplate, getRegistrationEmailTemplate, getMagicLinkEmailTemplate } from '../config/email';
import { config } from '../config/config';

const generateAccessToken = (userId: Schema.Types.ObjectId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET as string, { expiresIn: '24h' });
};

const generateRefreshToken = (userId: Schema.Types.ObjectId) => {
  return jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET as string, { expiresIn: '7d' });
};

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Cet email est déjà utilisé' });
    }

    // Créer le token de vérification d'email
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const hashedVerificationToken = crypto
      .createHash('sha256')
      .update(verificationToken)
      .digest('hex');

    // Créer le nouvel utilisateur
    const hashedPassword = await bcrypt.hash(password, 8);
    const user = new User({
      username,
      email,
      password: hashedPassword,
      emailVerificationToken: hashedVerificationToken,
      emailVerified: false
    });

    await user.save();

    // Générer le token JWT
    const accessToken = generateAccessToken(user._id);

    // Envoyer l'email de confirmation
    const verificationUrl = `${config.frontendUrl}/verify-email`;
    const emailTemplate = getRegistrationEmailTemplate(username, verificationToken, verificationUrl);

    await transporter.sendMail({
      from: config.email.user,
      to: user.email,
      ...emailTemplate,
    });

    res.status(201).json({
      message: 'Inscription réussie. Veuillez vérifier votre email pour confirmer votre compte.',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        emailVerified: user.emailVerified
      },
      accessToken
    });
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    res.status(500).json({ message: 'Erreur lors de l\'inscription' });
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    // Trouver l'utilisateur avec le token de vérification
    const user = await User.findOne({
      emailVerificationToken: crypto
        .createHash('sha256')
        .update(token)
        .digest('hex')
    });

    if (!user) {
      return res.status(400).json({ message: 'Token de vérification invalide' });
    }

    // Mettre à jour l'utilisateur
    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    await user.save();

    // Générer un nouveau token JWT
    const accessToken = generateAccessToken(user._id);

    res.json({
      message: 'Email vérifié avec succès',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        emailVerified: user.emailVerified
      },
      accessToken
    });
  } catch (error) {
    console.error('Erreur lors de la vérification de l\'email:', error);
    res.status(500).json({ message: 'Erreur lors de la vérification de l\'email' });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { identifier, password } = req.body;
    const user = await User.findOne({ $or: [{ email: identifier }, { username: identifier }] });
    if (!user) {
      return res.status(401).send({ error: 'Invalid email/username or password' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send({ error: 'Invalid email/username or password' });
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.send({ user, accessToken });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).send({ error: error.message });
    } else {
      res.status(500).send({ error: 'Unknown error occurred' });
    }
  }
};

export const refreshAccessToken = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(401).send({ error: 'Authentication required' });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET as string) as {
      userId: Schema.Types.ObjectId
    };
    const accessToken = generateAccessToken(decoded.userId);
    res.send({ accessToken });
  } catch (error) {
    res.status(403).send({ error: 'Invalid refresh token' });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 heure

    await user.save();

    const resetUrl = `${config.frontendUrl}/reset-password`;
    const emailTemplate = getPasswordResetEmailTemplate(user.username, resetToken, resetUrl);

    await transporter.sendMail({
      from: config.email.user,
      to: user.email,
      ...emailTemplate,
    });

    res.json({ message: 'Email de réinitialisation envoyé' });
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    res.status(500).json({ message: 'Erreur lors de l\'envoi de l\'email' });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, password } = req.body;
    
    // Trouver l'utilisateur avec un token valide
    const user = await User.findOne({
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ error: 'Le token de réinitialisation est invalide ou a expiré.' });
    }

    // Vérifier le token
    const isValidToken = await bcrypt.compare(token, user.resetPasswordToken || '');
    if (!isValidToken) {
      return res.status(400).json({ error: 'Token invalide.' });
    }

    // Mettre à jour le mot de passe
    const hashedPassword = await bcrypt.hash(password, 8);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: 'Mot de passe réinitialisé avec succès.' });
  } catch (error) {
    console.error('Erreur lors de la réinitialisation du mot de passe:', error);
    res.status(500).json({ error: 'Erreur lors de la réinitialisation du mot de passe.' });
  }
};

export const sendMagicLink = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'Aucun compte associé à cet email' });
    }

    // Créer le token de magic link
    const magicLinkToken = crypto.randomBytes(32).toString('hex');
    const hashedMagicLinkToken = crypto
      .createHash('sha256')
      .update(magicLinkToken)
      .digest('hex');

    // Stocker le token dans l'utilisateur
    user.magicLinkToken = hashedMagicLinkToken;
    user.magicLinkExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
    await user.save();

    // Envoyer l'email avec le magic link
    const magicLinkUrl = `${config.frontendUrl}/verify-magic-link`;
    const emailTemplate = getMagicLinkEmailTemplate(user.username, magicLinkToken, magicLinkUrl);

    await transporter.sendMail({
      from: config.email.user,
      to: user.email,
      ...emailTemplate,
    });

    res.json({ message: 'Magic link envoyé avec succès' });
  } catch (error) {
    console.error('Erreur lors de l\'envoi du magic link:', error);
    res.status(500).json({ message: 'Erreur lors de l\'envoi du magic link' });
  }
};

export const verifyMagicLink = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    // Trouver l'utilisateur avec le token de magic link valide
    const user = await User.findOne({
      magicLinkToken: crypto
        .createHash('sha256')
        .update(token)
        .digest('hex'),
      magicLinkExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Token de magic link invalide ou expiré' });
    }

    // Générer un nouveau token JWT
    const accessToken = generateAccessToken(user._id);

    // Réinitialiser le magic link
    user.magicLinkToken = undefined;
    user.magicLinkExpires = undefined;
    await user.save();

    res.json({
      message: 'Connexion réussie',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        emailVerified: user.emailVerified
      },
      accessToken
    });
  } catch (error) {
    console.error('Erreur lors de la vérification du magic link:', error);
    res.status(500).json({ message: 'Erreur lors de la vérification du magic link' });
  }
};