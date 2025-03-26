import React, { useEffect, useState } from 'react';
import { Paper, Title, Container, LoadingOverlay, Group, Button } from '@mantine/core';
import { FiPlus } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User } from '../services/userService';
import { useUsers } from '../hooks/useUsers';
import { useUserFilters } from '../hooks/useUserFilters';
import { useUserSelection } from '../hooks/useUserSelection';
import { UserFilters } from '../components/users/UserFilters';
import { UserTable } from '../components/users/UserTable';
import { UserModal } from '../components/users/UserModal';

const ITEMS_PER_PAGE = 10;

interface FormData {
  username: string;
  email: string;
  password?: string;
}

const Users: React.FC = () => {
  const [opened, setOpened] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    password: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  const {
    users,
    loading,
    emailLoading,
    emailSuccess,
    deletedUsers,
    deleteUser,
    restoreUser,
    updateUser,
    createUser,
    resendActivationEmail,
    resetPassword,
    toggleUserStatus,
  } = useUsers();

  const {
    filters,
    filteredUsers,
    updateFilter,
    handleSort,
  } = useUserFilters(users);

  const {
    selectedUsers,
    handleSelectAll,
    handleSelectUser,
    clearSelection,
  } = useUserSelection(filteredUsers.map(user => user._id));

  useEffect(() => {
    if (!isAdmin) {
      navigate('/login');
      return;
    }
  }, [isAdmin, navigate]);

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      password: '',
    });
    setOpened(true);
  };

  const handleSubmit = async () => {
    try {
      if (selectedUser) {
        // Modification d'un utilisateur existant
        await updateUser(selectedUser._id, formData);
      } else {
        // Création d'un nouvel utilisateur
        if (!formData.password) {
          throw new Error('Password is required for new users');
        }
        await createUser({
          username: formData.username,
          email: formData.email,
          password: formData.password as string
        });
      }
      setOpened(false);
      setSelectedUser(null);
      setFormData({ username: '', email: '', password: '' });
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  const handleBulkAction = async (action: 'delete' | 'activate' | 'deactivate') => {
    if (selectedUsers.length === 0) return;

    if (action === 'delete' && !window.confirm(`Are you sure you want to delete ${selectedUsers.length} users?`)) {
      return;
    }

    try {
      for (const userId of selectedUsers) {
        switch (action) {
          case 'delete':
            await deleteUser(userId);
            break;
          case 'activate':
            await toggleUserStatus(userId, true);
            break;
          case 'deactivate':
            await toggleUserStatus(userId, false);
            break;
        }
      }
      clearSelection();
    } catch (error) {
      console.error(`Error performing bulk ${action}:`, error);
    }
  };

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <Container size="xl">
      <Paper p="md" radius="md" withBorder>
        <LoadingOverlay visible={loading} />
        <Group justify="space-between" mb="md">
          <Title order={2}>Users Management</Title>
          <Button
            leftSection={<FiPlus size={16} />}
            onClick={() => {
              setSelectedUser(null);
              setFormData({ username: '', email: '', password: '' });
              setOpened(true);
            }}
          >
            Add User
          </Button>
        </Group>

        <UserFilters
          searchQuery={filters.searchQuery}
          onSearchChange={(value) => updateFilter('searchQuery', value)}
          roleFilter={filters.roleFilter}
          onRoleFilterChange={(value) => updateFilter('roleFilter', value)}
          statusFilter={filters.statusFilter}
          onStatusFilterChange={(value) => updateFilter('statusFilter', value)}
          dateRange={filters.dateRange}
          onDateRangeChange={(range) => updateFilter('dateRange', range)}
          selectedUsersCount={selectedUsers.length}
          onBulkDelete={() => handleBulkAction('delete')}
          onBulkActivate={() => handleBulkAction('activate')}
          onBulkDeactivate={() => handleBulkAction('deactivate')}
        />

        <UserTable
          users={paginatedUsers}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          selectedUsers={selectedUsers}
          onSelectAll={handleSelectAll}
          onSelectUser={handleSelectUser}
          onEdit={handleEdit}
          onDelete={deleteUser}
          onRestore={restoreUser}
          onResendActivation={resendActivationEmail}
          onResetPassword={resetPassword}
          onSort={handleSort}
          sortField={filters.sortField}
          sortDirection={filters.sortDirection}
          emailLoading={emailLoading}
          emailSuccess={emailSuccess}
          deletedUsers={deletedUsers}
        />

        <UserModal
          opened={opened}
          onClose={() => {
            setOpened(false);
            setSelectedUser(null);
            setFormData({ username: '', email: '', password: '' });
          }}
          user={selectedUser}
          formData={formData}
          onFormDataChange={setFormData}
          onSubmit={handleSubmit}
        />
      </Paper>
    </Container>
  );
};

export default Users; 