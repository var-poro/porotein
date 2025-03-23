import { Group, ActionIcon, Tooltip } from '@mantine/core';
import { PiSun, PiMoon, PiCaretLeft, PiCaretRight } from 'react-icons/pi';
import { useMantineColorScheme } from '@mantine/core';
import { NavbarFooterProps } from './types';

export const NavbarFooter: React.FC<NavbarFooterProps> = ({
  isCollapsed,
  onToggleCollapse,
}) => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const isDarkMode = colorScheme === 'dark' || (colorScheme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  return (
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
      <Tooltip label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}>
        <ActionIcon
          variant="default"
          onClick={onToggleCollapse}
          size={30}
        >
          {isCollapsed ? <PiCaretRight size={16} /> : <PiCaretLeft size={16} />}
        </ActionIcon>
      </Tooltip>
    </Group>
  );
}; 