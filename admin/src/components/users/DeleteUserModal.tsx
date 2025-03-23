import { Modal, Text, Button, Group } from '@mantine/core';
import { User } from '../../services/userService';

interface DeleteUserModalProps {
  opened: boolean;
  onClose: () => void;
  onConfirm: () => void;
  user: User | null;
}

export const DeleteUserModal: React.FC<DeleteUserModalProps> = ({
  opened,
  onClose,
  onConfirm,
  user,
}) => {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Delete User"
      centered
    >
      <Text size="sm" mb="xl">
        Are you sure you want to delete user <Text fw={500} component="span">{user?.username}</Text>? This action cannot be undone.
      </Text>

      <Group justify="flex-end" gap="xs">
        <Button variant="default" onClick={onClose}>
          Cancel
        </Button>
        <Button color="red" onClick={onConfirm}>
          Delete
        </Button>
      </Group>
    </Modal>
  );
}; 