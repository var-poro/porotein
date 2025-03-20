import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useRegister } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import styles from './Register.module.scss';

interface RegisterFormInputs {
    username: string;
    email: string;
    password: string;
}

const Register: React.FC = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormInputs>();
    const registerMutation = useRegister();
    const navigate = useNavigate();
    const [isRegistered, setIsRegistered] = useState(false);

    const onSubmit: SubmitHandler<RegisterFormInputs> = async (data) => {
        try {
            await registerMutation.mutateAsync(data);
            setIsRegistered(true);
        } catch (error) {
            console.error('Registration failed', error);
        }
    };

    if (isRegistered) {
        return (
            <div className={styles.container}>
                <h1>Inscription réussie !</h1>
                <p>Un email de confirmation a été envoyé à votre adresse email. Veuillez vérifier votre boîte de réception et cliquer sur le lien de confirmation pour activer votre compte.</p>
                <button
                    type="button"
                    onClick={() => navigate('/login')}
                    className={styles.linkButton}
                >
                    Retour à la connexion
                </button>
            </div>
        );
    }

    return (
        <form className={styles.container} onSubmit={handleSubmit(onSubmit)}>
            <h1>Bienvenue sur Porotein !</h1>
            <p>Crée ton compte pour commencer ton parcours</p>
            <div className={styles.inputContainer}>
                <label htmlFor="username">Nom d'utilisateur</label>
                <input 
                    id="username" 
                    placeholder="poro"
                    autoCapitalize="none"
                    autoComplete="username"
                    {...register('username', { required: true })} 
                />
                {errors.username && <span className={styles.error}>Ce champ est obligatoire</span>}
            </div>
            <div className={styles.inputContainer}>
                <label htmlFor="email">Email</label>
                <input 
                    id="email" 
                    type="email" 
                    placeholder="poro@example.com"
                    autoComplete="email"
                    {...register('email', { required: true })} 
                />
                {errors.email && <span className={styles.error}>Ce champ est obligatoire</span>}
            </div>
            <div className={styles.inputContainer}>
                <label htmlFor="password">Mot de passe</label>
                <input 
                    id="password" 
                    type="password" 
                    placeholder="********"
                    autoComplete="new-password"
                    {...register('password', { required: true })} 
                />
                {errors.password && <span className={styles.error}>Ce champ est obligatoire</span>}
            </div>
            <button type="submit" disabled={registerMutation.isLoading}>
                {registerMutation.isLoading ? 'Inscription...' : 'Inscription'}
            </button>
            <div className={styles.links}>
                <span>Déjà un compte ?</span>
                <button
                    type="button"
                    onClick={() => navigate('/login')}
                    className={styles.linkButton}
                >
                    Connecte-toi
                </button>
            </div>
        </form>
    );
};

export default Register;