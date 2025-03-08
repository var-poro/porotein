import { ReactNode } from 'react';
import styles from './Tile.module.scss';

interface TileContainerProps {
  children: ReactNode;
}

export const TileContainer = ({ children }: TileContainerProps) => {
  return <div className={styles.tileContainer}>{children}</div>;
};