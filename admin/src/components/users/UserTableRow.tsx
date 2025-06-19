import { Table, Text, Badge, Group, Checkbox, Tooltip, Button, Stack } from '@mantine/core';
import { formatDistanceToNow, format } from 'date-fns';
import { User } from '../../services/userService';
import { UserStatusBadge } from './UserStatusBadge';
import { UserActionButtons } from './UserActionButtons';
import { PiArrowCounterClockwise } from 'react-icons/pi';

interface UserTableRowProps {
  user: User;
  isSelected: boolean;
  onSelect: (userId: string) => void;
  onEdit: (user: User) => void;
  onDelete: (userId: string) => void;
  onRestore: (userId: string) => void;
  onResendActivation: (userId: string) => void;
  onResetPassword: (userId: string) => void;
  emailLoading: string | null;
  emailSuccess: string | null;
  isDeleting: boolean;
  isDeleted: boolean;
}

export const UserTableRow: React.FC<UserTableRowProps> = ({
  user,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  onRestore,
  onResendActivation,
  onResetPassword,
  emailLoading,
  emailSuccess,
  isDeleting,
  isDeleted,
}) => {
  if (isDeleting) {
    return (
      <Table.Tr style={{ 
        backgroundColor: isDeleted ? 'var(--mantine-color-red-0)' : 'var(--mantine-color-yellow-0)',
        transition: 'background-color 0.3s ease',
      }}>
        <Table.Td colSpan={8}>
          <Group justify="space-between">
            <Text c={isDeleted ? "red" : "yellow"} fw={500}>
              {isDeleted ? "Utilisateur supprimé" : "Suppression en cours..."}
            </Text>
            {isDeleted && (
              <Button
                variant="light"
                color="blue"
                size="xs"
                leftSection={<PiArrowCounterClockwise size={14} />}
                onClick={() => onRestore(user._id)}
              >
                Annuler
              </Button>
            )}
          </Group>
        </Table.Td>
      </Table.Tr>
    );
  }

  return (
    <Table.Tr>
      <Table.Td>
        <Checkbox
          checked={isSelected}
          onChange={() => onSelect(user._id)}
        />
      </Table.Td>
      <Table.Td>
        <UserStatusBadge user={user} />
      </Table.Td>
      <Table.Td>{user.username}</Table.Td>
      <Table.Td style={{ maxWidth: 0 }}>
        <Text truncate="end" style={{ width: '100%' }}>
          {user.email}
        </Text>
      </Table.Td>
      <Table.Td>
        <Badge color={user.role === 'admin' ? 'blue' : 'green'}>
          {user.role}
        </Badge>
      </Table.Td>
      <Table.Td>
        <Group gap="xs">
          <Tooltip 
            label={
              <Stack gap="xs">
                <Text>Created: {format(new Date(user.createdAt), 'PPpp')}</Text>
                {user.lastActivationEmailSent && (
                  <Text c="blue">Last activation email: {format(new Date(user.lastActivationEmailSent), 'PPpp')}</Text>
                )}
                {user.lastPasswordResetEmailSent && (
                  <Text c="orange">Last password reset: {format(new Date(user.lastPasswordResetEmailSent), 'PPpp')}</Text>
                )}
              </Stack>
            }
          >
            <Text size="sm" fw={500}>
              {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
            </Text>
          </Tooltip>
          {user.lastLogin && (
            <Text size="sm" c="dimmed">
              Last login: {formatDistanceToNow(new Date(user.lastLogin), { addSuffix: true })}
            </Text>
          )}
        </Group>
      </Table.Td>
      <Table.Td>
        {user.lastLoginAt ? (
          <Tooltip label={format(new Date(user.lastLoginAt), 'PPpp')}>
            <Text size="sm" fw={500}>
              {formatDistanceToNow(new Date(user.lastLoginAt), { addSuffix: true })}
            </Text>
          </Tooltip>
        ) : (
          <Text size="sm" c="dimmed">
            Never
          </Text>
        )}
      </Table.Td>
      <Table.Td>
        <UserActionButtons
          user={user}
          onEdit={onEdit}
          onDelete={onDelete}
          onResendActivation={onResendActivation}
          onResetPassword={onResetPassword}
          emailLoading={emailLoading}
          emailSuccess={emailSuccess}
        />
      </Table.Td>
    </Table.Tr>
  );
}; 