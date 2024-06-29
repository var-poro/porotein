import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Home.module.scss';
import {
  Loading,
  NoSessions,
  RecommendedSession,
  SuggestedSessions,
} from '@/components';
import {
  getAllPrograms,
  getProgramSessions,
  getUserData,
} from '@/services/userService';
import { User } from '@/types/User';
import { useQuery } from 'react-query';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { BiPlus } from 'react-icons/bi';

const Home: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeProgram, setActiveProgram] = useState<string | null>(null);

  const navigate = useNavigate();

  const { data: userData, isLoading: isLoadingUser } = useQuery(
    'userData',
    getUserData
  );
  const { data: programs, isLoading: isLoadingPrograms } = useQuery(
    'programs',
    getAllPrograms
  );
  const { data: sessions, isLoading: isLoadingSessions } = useQuery(
    ['programSessions', activeProgram],
    () => getProgramSessions(activeProgram || ''),
    {
      enabled: !!activeProgram,
    }
  );

  const formattedDate = format(new Date(), 'EEEE dd MMMM', { locale: fr });
  const formattedDateCapitalized =
    formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

  useEffect(() => {
    if (userData) {
      setUser(userData);
      if (
        typeof userData.activeProgram !== 'string' &&
        userData?.activeProgram?._id
      ) {
        setActiveProgram(userData.activeProgram._id);
      }
    }
  }, [userData]);

  useEffect(() => {
    if (!isLoadingPrograms && programs?.length === 0) {
      navigate('/programs/create');
    }
  }, [isLoadingPrograms, programs, navigate]);

  const handleCreateSession = () => {
    navigate('/session/create');
  };

  if (isLoadingUser || isLoadingPrograms || isLoadingSessions) {
    return <Loading />;
  }

  return (
    <div className={styles.homePage}>
      <span className={styles.date}>{formattedDateCapitalized}</span>
      <h2>Séance recommandée</h2>
      {sessions && sessions.length > 0 ? (
        <>
          <RecommendedSession session={sessions[0]} />
          <h3>Autres séances</h3>
          <SuggestedSessions sessions={sessions.slice(1)} />

          <button onClick={handleCreateSession} className={styles.addSession}>
            <BiPlus className={styles.addSessionIcon} />
            <span>Créer une nouvelle séance</span>
          </button>
        </>
      ) : (
        <NoSessions
          programName={
            typeof user?.activeProgram !== 'string'
              ? user?.activeProgram?.name || ''
              : ''
          }
          onCreateSession={handleCreateSession}
        />
      )}
    </div>
  );
};

export default Home;
