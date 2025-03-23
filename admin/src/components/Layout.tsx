import React from 'react';
import {
  AppShell,
  Burger,
  Group,
  Text,
  useMantineTheme,
  useMantineColorScheme,
  ActionIcon,
  rem,
  Image,
  Tooltip,
  Transition,
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
    { label: 'Programs', path: '/programs', icon: PiBook },
    { label: 'Sessions', path: '/sessions', icon: PiCalendar },
    { label: 'Exercises', path: '/exercises', icon: PiBarbell },
    { label: 'Supplements', path: '/supplements', icon: PiPackage },
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
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <Box style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Box style={{ flex: 1 }}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Tooltip
                  key={item.path}
                  label={collapsed ? item.label : null}
                  position="right"
                  disabled={!collapsed}
                >
                  <Box
                    p="xs"
                    style={{
                      cursor: 'pointer',
                      backgroundColor: isActive
                        ? isDarkMode
                          ? theme.colors.dark[6]
                          : theme.colors.gray[1]
                        : 'transparent',
                      borderRadius: theme.radius.sm,
                      width: '100%',
                    }}
                    onClick={() => {
                      navigate(item.path);
                      setOpened(false);
                    }}
                  >
                    <Box style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <Box style={{ width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Icon size={20} />
                      </Box>
                      {!collapsed && (
                        <Text size="sm" fw={500} style={{ letterSpacing: '0.3px' }}>{item.label}</Text>
                      )}
                    </Box>
                  </Box>
                </Tooltip>
              );
            })}
          </Box>
          <Group justify="space-between" mt="auto">
            <Tooltip label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}>
              <ActionIcon
                variant="default"
                onClick={() => toggleColorScheme()}
                size={30}
              >
                {isDarkMode ? (
                  <PiSun size={16} />
                ) : (
                  <PiMoon size={16} />
                )}
              </ActionIcon>
            </Tooltip>
            <Tooltip label={collapsed ? "Expand sidebar" : "Collapse sidebar"}>
              <ActionIcon
                variant="default"
                onClick={() => setCollapsed(!collapsed)}
                size={30}
              >
                {collapsed ? <PiCaretRight size={16} /> : <PiCaretLeft size={16} />}
              </ActionIcon>
            </Tooltip>
          </Group>
        </Box>
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
};

export default Layout; 