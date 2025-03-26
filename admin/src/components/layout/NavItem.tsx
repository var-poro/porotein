import { Box, Text, Tooltip } from '@mantine/core';
import { NavItemProps } from './types';

export const NavItem: React.FC<NavItemProps> = ({
  label,
  icon: Icon,
  isActive,
  isCollapsed,
  isDarkMode,
  onNavigate,
}) => {
  return (
    <Tooltip
      label={isCollapsed ? label : null}
      position="right"
      disabled={!isCollapsed}
    >
      <Box
        p="xs"
        style={{
          cursor: 'pointer',
          backgroundColor: isActive
            ? isDarkMode
              ? 'var(--mantine-color-dark-6)'
              : 'var(--mantine-color-gray-1)'
            : 'transparent',
          borderRadius: 'var(--mantine-radius-sm)',
          width: '100%',
        }}
        onClick={onNavigate}
      >
        <Box style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Box style={{ width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon size={20} />
          </Box>
          {!isCollapsed && (
            <Text size="sm" fw={500} style={{ letterSpacing: '0.3px' }}>{label}</Text>
          )}
        </Box>
      </Box>
    </Tooltip>
  );
}; 