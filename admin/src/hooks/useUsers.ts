import { useState, useEffect } from 'react';
import { User, CreateUserResponse } from '../services/userService';
import userService from '../services/userService';
import { notifications } from '@mantine/notifications';

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [emailLoading, setEmailLoading] = useState<string | null>(null);
  const [emailSuccess, setEmailSuccess] = useState<string | null>(null);
  const [deletedUsers, setDeletedUsers] = useState<{ [key: string]: User }>({});

  const fetchUsers = async () => {
    try {
      const data = await userService.getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (data: { username: string; email: string; password: string }) => {
    try {
      const response: CreateUserResponse = await userService.createUser(data);
      await fetchUsers();
      notifications.show({
        title: 'Succès',
        message: response.message,
        color: 'green',
      });
    } catch (error: any) {
      notifications.show({
        title: 'Erreur',
        message: error.response?.data?.message || 'Échec de la création de l\'utilisateur',
        color: 'red',
      });
      throw error;
    }
  };

  const deleteUser = async (id: string) => {
    try {
      const userToDelete = users.find(u => u._id === id);
      if (!userToDelete) return;

      await userService.deleteUser(id);
      setDeletedUsers(prev => ({ ...prev, [id]: userToDelete }));
      
      // Supprimer l'utilisateur de la liste après 10 secondes
      setTimeout(() => {
        setUsers(prev => prev.filter(u => u._id !== id));
        setDeletedUsers(prev => {
          const newDeletedUsers = { ...prev };
          delete newDeletedUsers[id];
          return newDeletedUsers;
        });
      }, 10000);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const restoreUser = async (id: string) => {
    try {
      const deletedUser = deletedUsers[id];
      if (!deletedUser) return;

      await userService.restoreUser(id);
      await fetchUsers();
      setDeletedUsers(prev => {
        const newDeletedUsers = { ...prev };
        delete newDeletedUsers[id];
        return newDeletedUsers;
      });
    } catch (error) {
      console.error('Error restoring user:', error);
    }
  };

  const updateUser = async (id: string, data: Partial<User>) => {
    try {
      await userService.updateUser(id, data);
      await fetchUsers();
      notifications.show({
        title: 'Success',
        message: 'User updated successfully',
        color: 'green',
      });
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to update user',
        color: 'red',
      });
    }
  };

  const resendActivationEmail = async (id: string) => {
    setEmailLoading(id);
    try {
      await userService.resendActivationEmail(id);
      setEmailSuccess(id);
      setTimeout(() => setEmailSuccess(null), 3000);
    } catch (error) {
      console.error('Error resending activation email:', error);
    } finally {
      setEmailLoading(null);
    }
  };

  const resetPassword = async (id: string) => {
    setEmailLoading(id);
    try {
      await userService.resetPassword(id);
      setEmailSuccess(id);
      setTimeout(() => setEmailSuccess(null), 3000);
    } catch (error) {
      console.error('Error resetting password:', error);
    } finally {
      setEmailLoading(null);
    }
  };

  const toggleUserStatus = async (id: string, isActive: boolean) => {
    try {
      await userService.updateUser(id, { isActive });
      await fetchUsers();
    } catch (error) {
      console.error('Error toggling user status:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    loading,
    emailLoading,
    emailSuccess,
    deletedUsers,
    createUser,
    deleteUser,
    restoreUser,
    updateUser,
    resendActivationEmail,
    resetPassword,
    toggleUserStatus,
  };
}; 