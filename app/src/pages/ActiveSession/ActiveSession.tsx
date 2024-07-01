import ProgressBar from '@/components/ProgressBar/ProgressBar.tsx';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { getSessionById } from '@/services/sessionService.ts';
import { Loading } from '@/components';
import styles from './ActiveSession.module.scss';
import ActiveExercise from '@/components/ActiveExercise/ActiveExercise.tsx';

const ActiveSession = () => {
  const [currentProgress, setCurrentProgress] = useState(0);
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: sessionData, isLoading: sessionLoading } = useQuery(
    ['session', id],
    () => getSessionById(id),
    { enabled: !!id }
  );

  useEffect(() => {
    if (sessionData?.exercises?.length) {
      setCurrentProgress(
        ((exerciseIndex + 1) * 100) / sessionData.exercises.length
      );
    }
  }, [exerciseIndex, sessionData]);

  const handleProgress = (newIndex: number) => {
    if (sessionData?.exercises[newIndex]) {
      setExerciseIndex(newIndex);
    }
  };

  const handleNextExercise = () => {
    handleProgress(exerciseIndex + 1);
  };

  if (sessionLoading) return <Loading />;

  if (!sessionData?.exercises?.[exerciseIndex]) {
    return (
      <div>
        <span>
          Il n'existe aucun exercice pour la séance {sessionData.name}
        </span>
        <button onClick={() => navigate(`/sessions/${sessionData.id}`)}>
          Modifier la séance
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.headerContainer}>
        <h5>{sessionData.name}</h5>
        <h5>
          {exerciseIndex + 1} / {sessionData.exercises.length}
        </h5>
      </div>
      <br />
      <div>
        <ProgressBar progress={currentProgress} />
      </div>

      {
        <ActiveExercise
          exercise={sessionData.exercises[exerciseIndex]}
          nextExercise={handleNextExercise}
        />
      }
      {exerciseIndex > sessionData.exercises.length - 1 && (
        <button onClick={() => navigate('/')}>Terminer la séance</button>
      )}
    </div>
  );
};

export default ActiveSession;
