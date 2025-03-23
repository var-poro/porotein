import { Badge, Box } from '@mantine/core';
import { User } from '../../services/userService';

interface UserStatusBadgeProps {
  user: User;
}

export const UserStatusBadge: React.FC<UserStatusBadgeProps> = ({ user }) => {
  return (
    <Badge 
      color={user.isActive ? 'green' : 'red'} 
      variant="light"
      leftSection={
        <Box
          w={6}
          h={6}
          style={{
            borderRadius: '50%',
            backgroundColor: user.isActive ? 'var(--mantine-color-green-6)' : 'var(--mantine-color-red-6)',
          }}
        />
      }
      style={{ whiteSpace: 'nowrap' }}
    >
      {user.isActive ? 'Active' : 'Inactive'}
    </Badge>
  );
}; 