import React from 'react';
import {
  AppShell,
  Burger,
  Group,
  Text,
  useMantineTheme,
  useMantineColorScheme,
  ActionIcon,
  Image,
  Tooltip,
  Box,
} from '@mantine/core';
import { 
  PiSun, 
  PiMoon, 
  PiSignOut, 
  PiUsers, 
  PiBook, 
  PiCalendar, 
  PiBarbell, 
  PiPackage,
  PiCaretLeft,
  PiCaretRight,
} from 'react-icons/pi';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const theme = useMantineTheme();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const [opened, setOpened] = React.useState(false);
  const [collapsed, setCollapsed] = React.useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isDarkMode = colorScheme === 'dark' || (colorScheme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  const navItems = [
    { label: 'Users', path: '/users', icon: PiUsers },
  ];

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: collapsed ? 70 : 250,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      padding="md"
      styles={{
        main: {
          background: isDarkMode ? theme.colors.dark[8] : theme.colors.gray[0],
        },
        navbar: {
          transition: 'width 200ms ease',
          overflow: 'hidden',
        },
      }}
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger
            opened={opened}
            onClick={() => setOpened(!opened)}
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
          <Group ml="auto" gap="xs">
            <Tooltip label="Logout">
              <ActionIcon
                variant="default"
                onClick={logout}
                size={30}
                color="red"
              >
                <PiSignOut size={16} />
              </ActionIcon>
            </Tooltip>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <Group justify="space-between" mb="xl">
          <Text size="xl" fw={700} style={{ display: collapsed ? 'none' : 'block' }}>
            Porotein
          </Text>
          <ActionIcon
            variant="default"
            onClick={() => setCollapsed(!collapsed)}
            size={30}
          >
            {collapsed ? <PiCaretRight size={16} /> : <PiCaretLeft size={16} />}
          </ActionIcon>
        </Group>

        <Box>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Group
                key={item.path}
                p="xs"
                style={{
                  borderRadius: theme.radius.sm,
                  cursor: 'pointer',
                  backgroundColor: location.pathname === item.path
                    ? isDarkMode
                      ? theme.colors.dark[6]
                      : theme.colors.gray[1]
                    : 'transparent',
                }}
                onClick={() => navigate(item.path)}
              >
                <Icon size={20} />
                {!collapsed && item.label}
              </Group>
            );
          })}
        </Box>
      </AppShell.Navbar>

      <AppShell.Main>
        {children}
      </AppShell.Main>
    </AppShell>
  );
};

export default Layout; 