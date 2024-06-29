import React, { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { getUserData, updateUserData } from '@/services/userService';
import styles from './Profile.module.scss';
import { Loading } from '@/components';

interface ProfileFormInputs {
  username: string;
  email: string;
}

const Profile: React.FC = () => {
  const { user, logout } = useAuth();
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
