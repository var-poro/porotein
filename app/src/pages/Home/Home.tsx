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
  getUserData,
} from '@/services/userService';
import { User } from '@/types/User';
import { useQuery } from 'react-query';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { BiPlus } from 'react-icons/bi';
import { getRecommendedSessions } from '@/services/sessionService';

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

  const formattedDate = format(new Date(), 'EEEE dd MMMM', { locale: fr });
  const formattedDateCapitalized =
    formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

  useEffect(() => {
    if (userData) {
      setUser(userData);
      if (userData.activeProgram) {
        setActiveProgram(userData.activeProgram);
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

  const { data: recommendedData, isLoading: isLoadingRecommended } = useQuery(
    ['recommendedSessions', activeProgram],
    getRecommendedSessions,
    {
      enabled: !!activeProgram,
    }
  );

  if (isLoadingUser || isLoadingPrograms || isLoadingRecommended) {
    return <Loading />;
  }

  return (
    <div className={styles.homePage}>
      <span className={styles.date}>{formattedDateCapitalized}</span>
      <h2>Séance recommandée</h2>
      {recommendedData?.recommended ? (
        <>
          <RecommendedSession 
            session={recommendedData.recommended}
            lastPerformed={recommendedData.lastPerformed[recommendedData.recommended._id]}
          />
          <h3>Autres séances</h3>
          <SuggestedSessions 
            sessions={recommendedData.otherSessions}
          />
          <button onClick={handleCreateSession} className={styles.addSession}>
            <BiPlus className={styles.addSessionIcon} />
            <span>Créer une nouvelle séance</span>
          </button>
        </>
      ) : (
        <NoSessions
          programName={
            user?.activeProgram
              ? programs?.find(p => p._id === user.activeProgram)?.name || ''
              : ''
          }
          onCreateSession={handleCreateSession}
        />
      )}
    </div>
  );
};

export default Home;
