import React from 'react';
import styles from './RecommendedSession.module.scss';
import { Session } from '@/types/Session';
import { GrEdit } from 'react-icons/gr';
import { Link, useNavigate } from 'react-router-dom';
import { PiTriangleBold } from 'react-icons/pi';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface RecommendedSessionProps {
  session: Session;
  lastPerformed?: Date;
}

const RecommendedSession: React.FC<RecommendedSessionProps> = ({ session, lastPerformed }) => {
  const navigate = useNavigate();

  return (
    <div className={styles.recommendedSession}>
      <div className={styles.sessionDetails}>
        <div className={styles.sessionDetailsHeader}>
          <div className={styles.headerContent}>
            <h3>{session.name}</h3>
            {lastPerformed && (
              <span className={styles.lastPerformed}>
                Il y a {formatDistanceToNow(new Date(lastPerformed), { locale: fr })}
              </span>
            )}
          </div>
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
