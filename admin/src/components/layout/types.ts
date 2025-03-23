import { IconType } from 'react-icons';

export interface NavItemType {
  label: string;
  path: string;
  icon: IconType;
}

export interface ThemeProps {
  isDarkMode: boolean;
}

export interface CollapsibleProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export interface NavigationProps {
  onNavigate: () => void;
}

export interface HeaderProps extends CollapsibleProps {
  opened: boolean;
  onToggle: () => void;
}

export interface NavItemProps extends ThemeProps, CollapsibleProps, NavigationProps {
  label: string;
  path: string;
  icon: IconType;
  isActive: boolean;
}

export interface NavbarProps extends CollapsibleProps, NavigationProps {}

export interface NavbarFooterProps extends CollapsibleProps {} 