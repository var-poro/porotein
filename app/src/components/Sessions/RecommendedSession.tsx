import React from 'react';
import styles from './RecommendedSession.module.scss';
import { Session } from '@/types/Session';
import { GrEdit } from 'react-icons/gr';
import { Link, useNavigate } from 'react-router-dom';
import { PiTriangleBold } from 'react-icons/pi';

interface RecommendedSessionProps {
  session: Session;
}

const RecommendedSession: React.FC<RecommendedSessionProps> = ({ session }) => {
  const navigate = useNavigate();

  return (
    <div className={styles.recommendedSession}>
      <div className={styles.sessionDetails}>
        <div className={styles.sessionDetailsHeader}>
          <h3>{session.name}</h3>
          <Link to={`/sessions/${session._id}`}>
            <GrEdit />
          </Link>
        </div>
        <p>{session.description}</p>
        <button
          onClick={() => navigate(`/workout/${session._id}`)}
          className={styles.startSession}
        >
          Démarrer la séance <PiTriangleBold />
        </button>
      </div>
    </div>
  );
};

export default RecommendedSession;
