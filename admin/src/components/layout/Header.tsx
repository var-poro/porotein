import { Group, Burger, ActionIcon, Image } from '@mantine/core';
import { PiSignOut } from 'react-icons/pi';
import { useAuth } from '../../context/AuthContext';
import { HeaderProps } from './types';

export const Header: React.FC<HeaderProps> = ({ opened, onToggle }) => {
  const { logout } = useAuth();

  return (
    <Group h="100%" px="md">
      <Burger
        opened={opened}
        onClick={onToggle}
        hiddenFrom="sm"
        size="sm"
      />
      <Group gap="xs">
        <Image
          src="/porotein-logo.png"
          alt="Porotein Logo"
          h={32}
          w="auto"
          style={{ objectFit: 'contain' }}
        />
      </Group>
      <Group ml="auto">
        <ActionIcon
          variant="default"
          onClick={logout}
          size={30}
          color="red"
          title="Logout"
        >
          <PiSignOut size={16} />
        </ActionIcon>
      </Group>
    </Group>
  );
}; 