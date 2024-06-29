import React from 'react';
import styles from './NoSessions.module.scss';
import { Link } from 'react-router-dom';
import Porotein from '@/assets/porotein.png';

interface NoSessionsProps {
  programName: string;
  onCreateSession: () => void;
}

const NoSessions: React.FC<NoSessionsProps> = ({
  programName,
  onCreateSession,
}) => (
  <div className={styles.noSessions}>
    <img
      loading={'lazy'}
      className={styles.logo}
      alt={'Porotein'}
      src={Porotein}
    />
    <p>
      Il semblerait qu'il n'y ait aucune séance pour le programme{' '}
      <b>{programName}</b>.
    </p>
    <div className={styles.noSessionsButtonsContainer}>
      <button onClick={onCreateSession}>Nouvelle séance</button>
      <Link
        to={'/my-program'}
        className={styles.link}
        onClick={onCreateSession}
      >
        Changer de programme
      </Link>
    </div>
  </div>
);

export default NoSessions;
