import { Box } from '@mantine/core';
import { useNavigate, useLocation } from 'react-router-dom';
import { PiUsers, PiBook, PiCalendar, PiBarbell, PiPackage } from 'react-icons/pi';
import { NavItem } from './NavItem';
import { NavbarFooter } from './NavbarFooter';
import { NavbarProps, NavItemType } from './types';

const navItems: NavItemType[] = [
  { label: 'Users', path: '/users', icon: PiUsers },
  { label: 'Programs', path: '/programs', icon: PiBook },
  { label: 'Sessions', path: '/sessions', icon: PiCalendar },
  { label: 'Exercises', path: '/exercises', icon: PiBarbell },
  { label: 'Supplements', path: '/supplements', icon: PiPackage },
];

export const Navbar: React.FC<NavbarProps> = ({
  isCollapsed,
  onToggleCollapse,
  onNavigate,
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    navigate(path);
    onNavigate();
  };

  return (
    <Box style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box style={{ flex: 1 }}>
        {navItems.map((item) => (
          <NavItem
            key={item.path}
            label={item.label}
            path={item.path}
            icon={item.icon}
            isActive={location.pathname === item.path}
            isCollapsed={isCollapsed}
            isDarkMode={false} // This will be handled by the theme context
            onNavigate={() => handleNavigate(item.path)}
            onToggleCollapse={onToggleCollapse}
          />
        ))}
      </Box>
      <NavbarFooter
        isCollapsed={isCollapsed}
        onToggleCollapse={onToggleCollapse}
      />
    </Box>
  );
}; 