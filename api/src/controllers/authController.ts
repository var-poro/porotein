import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { Schema } from 'mongoose';
import crypto from 'crypto';
import { transporter, getPasswordResetEmailTemplate } from '../config/email';

const generateAccessToken = (userId: Schema.Types.ObjectId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET as string, { expiresIn: '24h' });
};

const generateRefreshToken = (userId: Schema.Types.ObjectId) => {
  return jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET as string, { expiresIn: '7d' });
};

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).send({ error: 'All fields are required' });
    }

    const hashedPassword = await bcrypt.hash(password, 8);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(201).send({ user, accessToken });
  } catch (error) {
    if (error instanceof Error) {
      console.log('Error:', error.message);
      if ((error as any).code === 11000) {
        return res.status(400).send({ error: 'Email already in use' });
      }
      res.status(400).send({ error: error.message });
    } else {
      res.status(500).send({ error: 'Unknown error occurred' });
    }
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
      return res.status(404).json({ error: 'Aucun compte associé à cette adresse email.' });
    }

    // Générer un token unique
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = await bcrypt.hash(resetToken, 8);

    // Sauvegarder le token et sa date d'expiration
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // Expire dans 1 heure
    await user.save();

    // Construire l'URL de réinitialisation
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password`;

    // Envoyer l'email
    const emailTemplate = getPasswordResetEmailTemplate(user.username, resetToken, resetUrl);
    await transporter.sendMail({
      to: user.email,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
    });

    res.json({ message: 'Un email de réinitialisation a été envoyé.' });
  } catch (error) {
    console.error('Erreur lors de la réinitialisation du mot de passe:', error);
    res.status(500).json({ error: 'Erreur lors de l\'envoi de l\'email de réinitialisation.' });
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