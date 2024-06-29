import { FC } from 'react';
import styles from './ProgressBar.module.scss';

type Props = {
  progress: number;
};

const ProgressBar: FC<Props> = ({ progress }) => {
  return (
    <div className={styles.progressBar}>
      <div style={{ width: `${progress}%` }} className={styles.progress}></div>
    </div>
  );
};

export default ProgressBar;
