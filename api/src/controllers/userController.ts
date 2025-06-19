import {Request, Response} from 'express';
import User from '../models/User';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { transporter, getPasswordResetEmailTemplate, getRegistrationEmailTemplate } from '../config/email';
import { config } from '../config/config';

interface AuthRequest extends Request {
    userId?: string;
    userRole?: string;
}

export const getCurrentUser = async (req: AuthRequest, res: Response) => {
    try {
        const user = await User.findById(req.userId).populate('activeProgram');
        if (!user) {
            return res.status(404).send();
        }
        res.send(user);
    } catch (error) {
        res.status(500).send(error);
    }
};

export const updateCurrentUser = async (req: AuthRequest, res: Response) => {
    try {
        const updates = req.body;
        const user = await User.findByIdAndUpdate(req.userId, updates, {new: true, runValidators: true});
        if (!user) {
            return res.status(404).send();
        }
        res.send(user);
    } catch (error) {
        res.status(400).send(error);
    }
};

export const createUser = async (req: Request, res: Response) => {
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
            emailVerified: false,
            isActive: false, // L'utilisateur est inactif par défaut
            role: 'user',
            lastActivationEmailSent: new Date()
        });

        await user.save();

        // Envoyer l'email de confirmation
        const verificationUrl = `${config.frontendUrl}/verify-email`;
        const emailTemplate = getRegistrationEmailTemplate(username, verificationToken, verificationUrl);

        await transporter.sendMail({
            from: config.email.user,
            to: user.email,
            ...emailTemplate,
        });

        res.status(201).json({
            message: 'Utilisateur créé avec succès. Un email de confirmation a été envoyé.',
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                emailVerified: user.emailVerified,
                isActive: user.isActive,
                role: user.role,
                lastActivationEmailSent: user.lastActivationEmailSent
            }
        });
    } catch (error) {
        console.error('Erreur lors de la création de l\'utilisateur:', error);
        res.status(500).json({ message: 'Erreur lors de la création de l\'utilisateur' });
    }
};

export const getUser = async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send();
        }
        res.send(user);
    } catch (error) {
        res.status(500).send(error);
    }
};

export const updateUser = async (req: AuthRequest, res: Response) => {
    try {
        const updates = req.body;
        if (updates.password) {
            updates.password = await bcrypt.hash(updates.password, 8);
        }
        const user = await User.findByIdAndUpdate(req.params.id, updates, {new: true, runValidators: true});
        if (!user) {
            return res.status(404).send();
        }
        res.send(user);
    } catch (error) {
        res.status(400).send(error);
    }
};

export const deleteUser = async (req: AuthRequest, res: Response) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { deleted: true, isActive: false },
            { new: true }
        );
        if (!user) {
            return res.status(404).send();
        }
        res.send(user);
    } catch (error) {
        res.status(500).send(error);
    }
};

export const getAllUsers = async (req: AuthRequest, res: Response) => {
    try {
        const users = await User.find({ isActive: true });
        res.send(users);
    } catch (error) {
        res.status(500).send(error);
    }
};

export const getUserById = async (req: AuthRequest, res: Response) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send();
        }
        res.send(user);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Add a new weight entry
export const addWeight = async (req: AuthRequest, res: Response) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).send();
        }
        
        const weightEntry = {
            weight: req.body.weight,
            date: new Date(req.body.date || Date.now())
        };
        
        user.weightHistory.push(weightEntry);
        await user.save();
        
        res.status(201).send(weightEntry);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Get weight history
export const getWeightHistory = async (req: AuthRequest, res: Response) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).send();
        }
        
        res.send(user.weightHistory);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Update a weight entry
export const updateWeight = async (req: AuthRequest, res: Response) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).send();
        }

        const entryIndex = user.weightHistory.findIndex(
            entry => entry._id?.toString() === req.params.entryId
        );

        if (entryIndex === -1) {
            return res.status(404).send();
        }

        user.weightHistory[entryIndex] = {
            ...user.weightHistory[entryIndex],
            weight: req.body.weight,
            date: new Date(req.body.date)
        };

        await user.save();
        res.send(user.weightHistory[entryIndex]);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Delete a weight entry
export const deleteWeight = async (req: AuthRequest, res: Response) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).send();
        }

        user.weightHistory = user.weightHistory.filter(
            entry => entry._id?.toString() !== req.params.entryId
        );

        await user.save();
        res.send({ message: 'Weight entry deleted' });
    } catch (error) {
        res.status(500).send(error);
    }
};

export const resendActivationEmail = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Vérifier si un email a été envoyé récemment (moins de 5 minutes)
    if (user.lastActivationEmailSent) {
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      if (user.lastActivationEmailSent > fiveMinutesAgo) {
        return res.status(429).json({ 
          message: 'Un email a déjà été envoyé récemment. Veuillez attendre 5 minutes avant de réessayer.',
          lastEmailSent: user.lastActivationEmailSent
        });
      }
    }

    // Générer un nouveau token de vérification
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const hashedVerificationToken = crypto
      .createHash('sha256')
      .update(verificationToken)
      .digest('hex');

    user.emailVerificationToken = hashedVerificationToken;
    user.lastActivationEmailSent = new Date();
    await user.save();

    // Envoyer l'email de confirmation
    const verificationUrl = `${config.frontendUrl}/verify-email`;
    const emailTemplate = getRegistrationEmailTemplate(user.username, verificationToken, verificationUrl);

    await transporter.sendMail({
      from: config.email.user,
      to: user.email,
      ...emailTemplate,
    });

    res.json({ 
      message: 'Email d\'activation envoyé avec succès',
      lastEmailSent: user.lastActivationEmailSent
    });
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email d\'activation:', error);
    res.status(500).json({ message: 'Erreur lors de l\'envoi de l\'email d\'activation' });
  }
};

export const resetPassword = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Vérifier si un email a été envoyé récemment (moins de 5 minutes)
    if (user.lastPasswordResetEmailSent) {
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      if (user.lastPasswordResetEmailSent > fiveMinutesAgo) {
        return res.status(429).json({ 
          message: 'Un email a déjà été envoyé récemment. Veuillez attendre 5 minutes avant de réessayer.',
          lastEmailSent: user.lastPasswordResetEmailSent
        });
      }
    }

    // Générer un nouveau token de réinitialisation
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 heure
    user.lastPasswordResetEmailSent = new Date();

    await user.save();

    // Envoyer l'email de réinitialisation
    const resetUrl = `${config.frontendUrl}/reset-password`;
    const emailTemplate = getPasswordResetEmailTemplate(user.username, resetToken, resetUrl);

    await transporter.sendMail({
      from: config.email.user,
      to: user.email,
      ...emailTemplate,
    });

    res.json({ 
      message: 'Email de réinitialisation envoyé avec succès',
      lastEmailSent: user.lastPasswordResetEmailSent
    });
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email de réinitialisation:', error);
    res.status(500).json({ message: 'Erreur lors de l\'envoi de l\'email de réinitialisation' });
  }
};

export const toggleUserStatus = async (req: AuthRequest, res: Response) => {
  try {
    // Get current user to toggle the status
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    
    // Update user status
    const updatedUser = {
      _id: user._id,
      isActive: !user.isActive
    };
    
    await User.findByIdAndUpdate(
      req.params.id,
      { isActive: !user.isActive },
      { new: true }
    );

    res.send(updatedUser);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut:', error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour du statut' });
  }
};

export const restoreUser = async (req: AuthRequest, res: Response) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { deleted: false },
            { new: true }
        );
        if (!user) {
            return res.status(404).send();
        }
        res.send(user);
    } catch (error) {
        res.status(500).send(error);
    }
};