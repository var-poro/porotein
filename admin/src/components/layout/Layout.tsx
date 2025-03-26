import React from 'react';
import { AppShell, useMantineTheme, useMantineColorScheme } from '@mantine/core';
import { Header } from './Header';
import { Navbar } from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const [opened, setOpened] = React.useState(false);
  const [collapsed, setCollapsed] = React.useState(false);

  const isDarkMode = colorScheme === 'dark' || (colorScheme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);

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
        <Header isCollapsed={collapsed} opened={opened} onToggle={() => setOpened(!opened)} onToggleCollapse={() => setCollapsed(!collapsed)} />
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <Navbar
          isCollapsed={collapsed}
          onToggleCollapse={() => setCollapsed(!collapsed)}
          onNavigate={() => setOpened(false)}
        />
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
};

export default Layout; 