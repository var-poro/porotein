import { ActionIcon, Group, Menu, Tooltip, Modal, Text, Button } from '@mantine/core';
import { 
  PiPencilSimple, 
  PiTrash, 
  PiEnvelope,
  PiCheckCircle,
  PiKey,
} from 'react-icons/pi';
import { User } from '../../services/userService';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';

interface UserActionButtonsProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (userId: string) => void;
  onResendActivation: (userId: string) => void;
  onResetPassword: (userId: string) => void;
  emailLoading: string | null;
  emailSuccess: string | null;
}

export const UserActionButtons: React.FC<UserActionButtonsProps> = ({
  user,
  onEdit,
  onDelete,
  onResendActivation,
  onResetPassword,
  emailLoading,
  emailSuccess,
}) => {
  const { user: currentUser } = useAuth();
  const [deleteModalOpened, setDeleteModalOpened] = useState(false);
  const isCurrentUser = currentUser?._id === user._id;

  const handleDelete = () => {
    setDeleteModalOpened(true);
  };

  const confirmDelete = () => {
    onDelete(user._id);
    setDeleteModalOpened(false);
  };

  return (
    <>
      <Group gap={4} justify="flex-end" wrap="nowrap">
        <Tooltip label="Edit user">
          <ActionIcon 
            color="blue" 
            onClick={() => onEdit(user)}
            variant="light"
            size="md"
          >
            <PiPencilSimple size={16} />
          </ActionIcon>
        </Tooltip>
        <Menu position="bottom-end">
          <Menu.Target>
            <ActionIcon 
              variant="light"
              color={emailSuccess === user._id ? 'green' : 'blue'}
              loading={emailLoading === user._id}
              size="md"
            >
              <PiEnvelope size={16} />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item
              leftSection={<PiCheckCircle size={16} />}
              onClick={() => onResendActivation(user._id)}
              disabled={user.isActive || emailLoading === user._id}
            >
              Resend activation email
            </Menu.Item>
            <Menu.Item
              leftSection={<PiKey size={16} />}
              onClick={() => onResetPassword(user._id)}
              disabled={emailLoading === user._id}
            >
              Reset password
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
        <Tooltip label={isCurrentUser ? "You cannot delete your own account" : "Delete user"}>
          <ActionIcon 
            color="red" 
            onClick={handleDelete}
            variant="light"
            size="md"
            disabled={isCurrentUser}
          >
            <PiTrash size={16} />
          </ActionIcon>
        </Tooltip>
      </Group>

      <Modal
        opened={deleteModalOpened}
        onClose={() => setDeleteModalOpened(false)}
        title="Delete User"
      >
        <Text>Are you sure you want to delete this user?</Text>
        <Group justify="flex-end" mt="md">
          <Button variant="light" onClick={() => setDeleteModalOpened(false)}>
            Cancel
          </Button>
          <Button color="red" onClick={confirmDelete}>
            Delete
          </Button>
        </Group>
      </Modal>
    </>
  );
}; 