import React from 'react';
import styles from './SuggestedSessions.module.scss';
import { Session } from '@/types/Session';
import { Link, useNavigate } from 'react-router-dom';

interface SuggestedSessionsProps {
  sessions: Session[];
}

const SuggestedSessions: React.FC<SuggestedSessionsProps> = ({ sessions }) => {
  const navigate = useNavigate();

  return (
    <div className={styles.suggestedSessions}>
      {sessions.map((session) => (
        <div key={session._id} className={styles.sessionCard}>
          <div className={styles.sessionDetails}>
            <div className={styles.sessionDetailsHeader}>
              <Link to={`/sessions/${session._id}`}>
                <h3>{session.name}</h3>
              </Link>
            </div>
            <div onClick={() => navigate(`/workout/${session._id}`)}>
              <button>Démarrer</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SuggestedSessions;
