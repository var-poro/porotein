import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { getSessionById } from '@/services/sessionService.ts';
import { saveSession } from '@/services/savedSessionService.ts';
import { Loading } from '@/components';
import styles from './ActiveSession.module.scss';
import ActiveExercise from '@/components/ActiveExercise/ActiveExercise.tsx';
import ProgressBar from '@/components/ProgressBar/ProgressBar.tsx';
import toast from 'react-hot-toast';
import { Exercise, RepSet } from '@/types/Exercise';

const ACTIVE_SESSION_STATE_KEY = 'activeSessionState';

const ActiveSession = () => {
  const [currentProgress, setCurrentProgress] = useState(0);
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [exerciseStartTime, setExerciseStartTime] = useState<number | null>(null);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: sessionData, isLoading: sessionLoading } = useQuery(
    ['session', id],
    () => getSessionById(id),
    { enabled: !!id }
  );

  // Restaurer l'état de la session au chargement
  useEffect(() => {
    const savedState = localStorage.getItem(ACTIVE_SESSION_STATE_KEY);
    if (savedState && id) {
      try {
        const state = JSON.parse(savedState);
        if (state.sessionId === id) {
          console.log('Restauration de l\'état de la session active:', state);
          setExerciseIndex(state.exerciseIndex || 0);
          setSessionStartTime(state.sessionStartTime || Date.now());
          setExerciseStartTime(state.exerciseStartTime || Date.now());
        }
      } catch (error) {
        console.error('Erreur lors de la restauration de l\'état de la session:', error);
        localStorage.removeItem(ACTIVE_SESSION_STATE_KEY);
      }
    }
  }, [id]);

  // Gérer les changements de visibilité
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        // L'application est mise en arrière-plan
        console.log('Session active: Application mise en arrière-plan');
        // Sauvegarder l'état complet de la session
        if (sessionData && id) {
          const state = {
            sessionId: id,
            exerciseIndex,
            sessionStartTime,
            exerciseStartTime
          };
          localStorage.setItem(ACTIVE_SESSION_STATE_KEY, JSON.stringify(state));
          console.log('État de la session sauvegardé:', state);
        }
      } else if (document.visibilityState === 'visible') {
        // L'application est remise au premier plan
        console.log('Session active: Application remise au premier plan');
        // La restauration est gérée au chargement initial
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [id, exerciseIndex, sessionStartTime, exerciseStartTime, sessionData]);

  useEffect(() => {
    if (sessionData?.exercises?.length) {
      setCurrentProgress(
        ((exerciseIndex + 1) * 100) / sessionData.exercises.length
      );
      if (!sessionStartTime) {
        setSessionStartTime(Date.now());
      }
      if (exerciseIndex === 0 && !exerciseStartTime) {
        setExerciseStartTime(Date.now());
      }
    }
  }, [exerciseIndex, sessionData]);

  const saveSessionToLocal = () => {
    const currentTime = Date.now();
    const totalDuration = sessionStartTime ? currentTime - sessionStartTime : 0;

    if (exerciseStartTime && sessionData?.exercises[exerciseIndex]) {
      const exerciseDuration = currentTime - exerciseStartTime;
      sessionData.exercises[exerciseIndex].duration = exerciseDuration;
    }

    const updatedSessionData = {
      ...sessionData,
      sessionId: sessionData._id,
      duration: totalDuration,
      exercises: sessionData.exercises.map((exercise: Exercise, index: number) => ({
        ...exercise,
        exerciseId: exercise._id,
        duration: index === exerciseIndex && exerciseStartTime
          ? currentTime - exerciseStartTime
          : exercise.duration || 0,
        repSets: exercise.repSets.map((repSet: RepSet) => ({
          ...repSet,
          _id: repSet._id,
          duration: repSet.duration || 0,
          repSetId: repSet._id,
        })),
      })),
    };
    localStorage.setItem('activeSession', JSON.stringify(updatedSessionData));
    
    // Sauvegarder également l'état de la session
    const state = {
      sessionId: id,
      exerciseIndex,
      sessionStartTime,
      exerciseStartTime
    };
    localStorage.setItem(ACTIVE_SESSION_STATE_KEY, JSON.stringify(state));
  };

  const handleProgress = (newIndex: number) => {
    if (sessionData?.exercises[newIndex]) {
      const currentTime = Date.now();
      if (exerciseStartTime) {
        const exerciseDuration = currentTime - exerciseStartTime;
        sessionData.exercises[exerciseIndex].duration = exerciseDuration;
      }
      setExerciseIndex(newIndex);
      setExerciseStartTime(currentTime);
      saveSessionToLocal();
    }
  };

  const handleNextExercise = async () => {
    if (exerciseIndex + 1 < sessionData.exercises.length) {
      handleProgress(exerciseIndex + 1);
    } else {
      try {
        const savedSession = await saveSessionToApi();
        console.log({ savedSession });
        toast.success('Session sauvegardée avec succès !');
        localStorage.removeItem('activeSession');
        localStorage.removeItem(ACTIVE_SESSION_STATE_KEY);
        if (savedSession._id) navigate(`/workout/${savedSession._id}/recap`, { state: { justFinished: true } });
      } catch (error) {
        toast.error('Erreur lors de la sauvegarde de la session.');
      }
    }
  };

  const handlePreviousExercise = () => {
    if (exerciseIndex > 0) {
      handleProgress(exerciseIndex - 1);
    } else {
      toast('Vous êtes déjà au premier exercice', {
        icon: '⚠️'
      });
    }
  };

  const saveSessionToApi = async () => {
    saveSessionToLocal();
    const sessionData = JSON.parse(
      localStorage.getItem('activeSession') || '{}'
    );
    delete sessionData._id;
    return await saveSession(sessionData);
  };

  if (sessionLoading) return <Loading />;

  if (!sessionData?.exercises?.[exerciseIndex]) {
    return (
      <div>
        <p>Il n'existe aucun exercice pour la séance {sessionData?.name}</p>
        <button onClick={() => navigate(`/sessions/${sessionData.id}`)}>
          Modifier la séance
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.headerContainer}>
        <h5>{sessionData?.name}</h5>
        <div className={styles.navigationInfo}>
          {exerciseIndex > 0 && (
            <small className={styles.previousExercise}>
              Précédent : {sessionData.exercises[exerciseIndex - 1]?.name}
            </small>
          )}
          {sessionData.exercises[exerciseIndex + 1] && (
            <small className={styles.nextExercise}>
              À suivre : {sessionData.exercises[exerciseIndex + 1]?.name}
            </small>
          )}
        </div>
        <h5>
          {exerciseIndex + 1} / {sessionData.exercises.length}
        </h5>
      </div>
      <br />
      <div>
        <ProgressBar progress={currentProgress} />
      </div>
      <ActiveExercise
        exercise={sessionData.exercises[exerciseIndex]}
        nextExercise={handleNextExercise}
        previousExercise={handlePreviousExercise}
        hasPrevious={exerciseIndex > 0}
      />
    </div>
  );
};

export default ActiveSession;
