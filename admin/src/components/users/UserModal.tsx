import { Modal, Stack, TextInput, Button } from '@mantine/core';
import { User } from '../../services/userService';

interface UserModalProps {
  opened: boolean;
  onClose: () => void;
  user: User | null;
  formData: {
    username: string;
    email: string;
    password?: string;
  };
  onFormDataChange: (data: { username: string; email: string; password?: string }) => void;
  onSubmit: () => void;
}

export const UserModal: React.FC<UserModalProps> = ({
  opened,
  onClose,
  user,
  formData,
  onFormDataChange,
  onSubmit,
}) => {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={user ? 'Edit User' : 'Add User'}
    >
      <Stack>
        <TextInput
          label="Username"
          value={formData.username}
          onChange={(e) =>
            onFormDataChange({ ...formData, username: e.target.value })
          }
          required
        />
        <TextInput
          label="Email"
          value={formData.email}
          onChange={(e) =>
            onFormDataChange({ ...formData, email: e.target.value })
          }
          required
        />
        {!user && (
          <TextInput
            label="Password"
            type="password"
            value={formData.password || ''}
            onChange={(e) =>
              onFormDataChange({ ...formData, password: e.target.value })
            }
            required
          />
        )}
        <Button onClick={onSubmit}>
          {user ? 'Update' : 'Create'}
        </Button>
      </Stack>
    </Modal>
  );
}; 