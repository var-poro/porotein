import React, { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { getUserData, updateUserData } from '@/services/userService';
import styles from './Profile.module.scss';
import { Loading } from '@/components';
import WeightChart from '../Weight/components/WeightChart';
import { WeightDetail as WeightDetailType } from '@/types/Weight';

interface ProfileFormInputs {
  username: string;
  email: string;
}

const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: userData, isLoading } = useQuery('userData', getUserData, {
    enabled: !!user?.userId,
  });

  const { register, handleSubmit, setValue } = useForm<ProfileFormInputs>();

  const updateMutation = useMutation(updateUserData, {
    onSuccess: () => {
      queryClient.invalidateQueries('userData');
    },
  });

  useEffect(() => {
    if (userData) {
      setValue('username', userData.username);
      setValue('email', userData.email);
    }
  }, [userData, setValue]);

  const onSubmit: SubmitHandler<ProfileFormInputs> = async (data) => {
    updateMutation.mutate(data);
  };

  const handleLogout = () => {
    logout(() => navigate('/login'));
  };

  if (isLoading) {
    return <Loading />;
  }

  const formattedWeightHistory: WeightDetailType[] = userData?.weightHistory.map(entry => ({
    ...entry,
    date: typeof entry.date === 'string' ? entry.date : new Date(entry.date).toISOString(),
  })) || [];

  return (
    <div className={styles.profilePage}>
      <h1>Profile</h1>
      
      <div className={styles.weightSection}>
        <WeightChart data={formattedWeightHistory} />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className={styles.profileForm}>
        <div className={styles.formGroup}>
          <label htmlFor="username">Username</label>
          <input id="username" {...register('username', { required: true })} />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            {...register('email', { required: true })}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="theme">Theme</label>
          <select
            id="theme"
            value={theme}
            onChange={(e) => setTheme(e.target.value as 'light' | 'dark' | 'auto' | 'energy-saver')}
          >
            <option value="auto">Automatique</option>
            <option value="light">Mode clair</option>
            <option value="dark">Mode sombre</option>
            <option value="energy-saver">Mode économie d'énergie</option>
          </select>
          <small style={{ display: 'block', marginTop: '0.5rem', color: 'var(--text-secondary-color)' }}>
            Le mode économie d'énergie utilise un noir absolu pour maximiser les économies d'énergie sur les écrans OLED/AMOLED.
          </small>
        </div>

        <div className={styles.buttonsContainer}>
          <button type="submit">Mettre à jour mon profil</button>
          <button type="button" onClick={handleLogout}>
            Déconnexion
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
