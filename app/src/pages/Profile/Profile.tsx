import React, { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { getUserData, updateUserData } from '@/services/userService';
import styles from './Profile.module.scss';
import { Loading } from '@/components';
import { ConnectedDevice } from '@/types/User';

interface ProfileFormInputs {
  username: string;
  email: string;
  connectedDevice: ConnectedDevice;
}

const ThemeOption: React.FC<{
  icon: string;
  label: string;
  description: string;
  selected: boolean;
  onClick: () => void;
}> = ({ icon, label, description, selected, onClick }) => (
  <div 
    className={`${styles.themeOption} ${selected ? styles.selected : ''}`}
    onClick={onClick}
    role="button"
    tabIndex={0}
    onKeyPress={(e) => e.key === 'Enter' && onClick()}
  >
    <span className={styles.themeIcon}>{icon}</span>
    <div className={styles.themeInfo}>
      <span className={styles.themeLabel}>{label}</span>
      <span className={styles.themeDescription}>{description}</span>
    </div>
  </div>
);

const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: userData, isLoading } = useQuery('userData', getUserData, {
    enabled: !!user?.userId,
  });

  const { register, handleSubmit, setValue, watch } = useForm<ProfileFormInputs>();

  const updateMutation = useMutation(updateUserData, {
    onSuccess: () => {
      queryClient.invalidateQueries('userData');
    },
  });

  useEffect(() => {
    if (userData) {
      setValue('username', userData.username);
      setValue('email', userData.email);
      setValue('connectedDevice', userData.connectedDevice);
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

  const connectedDevice = watch('connectedDevice');

  return (
    <div className={styles.profilePage}>
      <h1>Profile</h1>

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
          <label>Équipement connecté</label>
          <div className={styles.connectedDeviceContainer}>
            <select
              {...register('connectedDevice.type')}
              className={styles.deviceSelect}
            >
              <option value="">Aucun</option>
              <option value="apple-watch">Apple Watch</option>
              <option value="garmin">Garmin</option>
              <option value="fitbit">Fitbit</option>
            </select>
            {connectedDevice?.type && (
              <label className={styles.toggleLabel}>
                <input
                  type="checkbox"
                  {...register('connectedDevice.enabled')}
                />
                Activer les notifications
              </label>
            )}
          </div>
          <small style={{ display: 'block', marginTop: '0.5rem', color: 'var(--text-secondary-color)' }}>
            Vous recevrez une notification au début de chaque séance pour lancer le suivi sur votre appareil.
          </small>
        </div>

        <div className={styles.formGroup}>
          <label>Thème de l'application</label>
          <div className={styles.themeOptions}>
            <ThemeOption
              icon="🌓"
              label="Automatique"
              description="S'adapte à votre système"
              selected={theme === 'auto'}
              onClick={() => setTheme('auto')}
            />
            <ThemeOption
              icon="☀️"
              label="Mode clair"
              description="Thème clair optimisé pour la journée"
              selected={theme === 'light'}
              onClick={() => setTheme('light')}
            />
            <ThemeOption
              icon="🌙"
              label="Mode sombre"
              description="Thème sombre pour une meilleure expérience nocturne"
              selected={theme === 'dark'}
              onClick={() => setTheme('dark')}
            />
            <ThemeOption
              icon="🔋"
              label="Mode économie d'énergie"
              description="Optimisé pour les écrans OLED/AMOLED"
              selected={theme === 'energy-saver'}
              onClick={() => setTheme('energy-saver')}
            />
          </div>
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
