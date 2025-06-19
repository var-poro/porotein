import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Loading } from '@/components';
import { getSavedSessionById, getSavedSessionsBySessionId, deleteSavedSession } from '@/services/savedSessionService.ts';
import { useGetCurrentUser } from '@/utils/useGetCurrentUser.ts';
import { formatDuration } from '@/utils/formatDuration.ts';
import styles from './Recapitulatif.module.scss';
import { Tile, TileContainer } from '@/components/Tile';
import { ExerciseChart } from '@/components/ExerciseChart/ExerciseChart';
import { BiLineChart, BiUpArrowAlt, BiDownArrowAlt, BiMinus, BiTrash } from 'react-icons/bi';
import { SavedExercise, SavedSession } from '@/types/SavedSession';
import toast from 'react-hot-toast';
import { useCallback, useMemo, useEffect, useRef } from 'react';

const Recapitulatif = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isJustFinished = location.state?.justFinished;
  const { data: user } = useGetCurrentUser();
  const notificationShown = useRef(false);

  // Effet pour afficher la notification de la montre connectée
  useEffect(() => {
    if (isJustFinished && user?.connectedDevice?.enabled && user?.connectedDevice?.type && !notificationShown.current) {
      const deviceName = {
        'apple-watch': 'Apple Watch',
        'garmin': 'Garmin',
        'fitbit': 'Fitbit'
      }[user.connectedDevice.type];

      toast(
        `N'oubliez pas d'arrêter le suivi sur votre ${deviceName} !`,
        {
          duration: 5000,
          icon: '⌚️',
          style: {
            background: 'var(--background-color)',
            color: 'var(--text-color)',
            border: '1px solid var(--border-color)',
          },
        }
      );
      notificationShown.current = true;
    }
  }, [isJustFinished, user?.connectedDevice]);

  const { data: savedSessionData, isLoading: sessionLoading, isError: sessionError } = useQuery(
    ['savedSession', id],
    () => getSavedSessionById(id || ''),
    { 
      enabled: !!id,
      retry: false
    }
  );

  const { data: historicalSessions, isLoading: historyLoading } = useQuery(
    ['sessionHistory', savedSessionData?.session?._id],
    () => getSavedSessionsBySessionId(savedSessionData?.session?._id || ''),
    { enabled: !!savedSessionData?.session?._id }
  );

  const deleteMutation = useMutation(deleteSavedSession, {
    onSuccess: () => {
      toast.success('Séance supprimée avec succès');
      queryClient.invalidateQueries('savedSessions');
      navigate('/history');
    },
    onError: () => {
      toast.error('Erreur lors de la suppression de la séance');
    }
  });

  const handleDelete = useCallback(() => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette séance ?')) {
      deleteMutation.mutate(id || '');
    }
  }, [deleteMutation, id]);

  const sessionData = savedSessionData?.session;

  const prepareExerciseHistory = useCallback((exerciseId: string) => {
    if (!historicalSessions) {
      console.log('No historical sessions available');
      return [];
    }
    
    console.log('Processing exercise history for ID:', exerciseId);
    console.log('Historical sessions:', JSON.stringify(historicalSessions, null, 2));
    
    return historicalSessions.map((savedSession: SavedSession) => {
      console.log('Processing session:', JSON.stringify(savedSession, null, 2));
      console.log('Session exercises:', JSON.stringify(savedSession.savedExercises, null, 2));
      
      // Chercher l'exercice dans les exercices sauvegardés
      const exercise = savedSession.savedExercises?.find(savedExercise => {
        const exId = savedExercise.exerciseId?._id || savedExercise.exerciseId?.id || savedExercise._id;
        console.log('Comparing exercise IDs:', { 
          exId, 
          exerciseId,
          exerciseIdType: typeof exerciseId,
          exIdType: typeof exId,
          savedExercise: JSON.stringify(savedExercise, null, 2)
        });
        return exId?.toString() === exerciseId?.toString();
      });
      
      if (!exercise) {
        console.log('Exercise not found in session');
        return null;
      }
      
      console.log('Found exercise:', JSON.stringify(exercise, null, 2));
      console.log('Exercise repSets:', JSON.stringify(exercise.repSets, null, 2));
      
      // Calculer les moyennes en s'assurant que les valeurs sont des nombres
      const avgReps = (exercise.repSets?.reduce((sum, set) => 
        sum + (Number(set.repetitions) || 0), 0) || 0) / (exercise.repSets?.length || 1);
      const avgWeight = (exercise.repSets?.reduce((sum, set) => 
        sum + (Number(set.weight) || 0), 0) || 0) / (exercise.repSets?.length || 1);
      
      const result = {
        date: new Date(savedSession.performedAt).toLocaleDateString(),
        reps: Math.round(avgReps),
        weight: Math.round(avgWeight)
      };
      
      console.log('Prepared data point:', result);
      return result;
    }).filter(Boolean);
  }, [historicalSessions]);

  // Ajouter un log pour voir les exercices de la session actuelle
  useEffect(() => {
    if (savedSessionData?.savedExercises) {
      console.log('Current session exercises:', JSON.stringify(savedSessionData.savedExercises, null, 2));
      console.log('First exercise:', JSON.stringify(savedSessionData.savedExercises[0], null, 2));
      console.log('First exercise exerciseId:', JSON.stringify(savedSessionData.savedExercises[0]?.exerciseId, null, 2));
      console.log('First exercise exerciseId type:', typeof savedSessionData.savedExercises[0]?.exerciseId);
    }
  }, [savedSessionData]);

  const metrics = useMemo(() => {
    if (!historicalSessions || historicalSessions.length < 2) return null;
  
    const previousSession = historicalSessions[1];
    const currentSession = savedSessionData;
  
    const totalVolume = (session: SavedSession | null | undefined) => {
      if (!session?.savedExercises) return 0;
      return session.savedExercises.reduce((acc, ex) => 
        acc + (ex.repSets?.reduce((setAcc: number, set: { weight: number; repetitions: number }) => 
          setAcc + (set.weight * set.repetitions), 0) || 0), 0);
    };
  
    const currentVolume = totalVolume(currentSession);
    const previousVolume = totalVolume(previousSession);
    const volumeChange = previousVolume > 0 
      ? ((currentVolume - previousVolume) / previousVolume) * 100 
      : 0;
  
    return {
      volumeChange: Math.round(volumeChange * 10) / 10,
      totalVolume: Math.round(currentVolume),
      previousVolume: Math.round(previousVolume)
    };
  }, [historicalSessions, savedSessionData]);

  if (sessionLoading || historyLoading) return <Loading />;

  if (sessionError || !savedSessionData) {
    return (
      <div className={styles.errorContainer}>
        <h1>Session introuvable</h1>
        <p>Désolé, la session que vous recherchez n'existe pas ou a été supprimée.</p>
        <button 
          onClick={() => navigate('/history')}
          className={styles.returnButton}
        >
          Retourner à l'historique
        </button>
      </div>
    );
  }

  return (
    <div className={styles.recapContainer}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          {isJustFinished ? (
            <>
              <h1>🎉 Félicitations, {user?.username} !</h1>
              <p className={styles.subtitle}>Vous venez de terminer votre séance</p>
            </>
          ) : (
            <>
              <h1>Récapitulatif de séance</h1>
              <p className={styles.subtitle}>Session du {new Date(savedSessionData?.performedAt).toLocaleDateString()}</p>
            </>
          )}
          <h3>{sessionData?.name}</h3>
        </div>
        <div 
          className={styles.deleteButton}
          onClick={handleDelete}
          title="Supprimer la séance"
        >
          <BiTrash />
        </div>
      </div>

      <TileContainer>
        <Tile
          title="Exercices"
          value={savedSessionData?.savedExercises?.length || 0}
          icon="performance"
        />
        <Tile
          title="Séries totales"
          value={savedSessionData?.savedExercises?.reduce((acc: number, ex: SavedExercise) => 
            acc + (ex.repSets?.length || 0), 0) || 0}
          icon="stats"
        />
        <Tile
          title="Durée totale"
          value={formatDuration(savedSessionData?.duration || 0)}
          icon="time"
        />
      </TileContainer>

      {metrics && (
        <div className={styles.performanceAnalysis}>
          <div className={styles.analysisHeader}>
            <BiLineChart className={styles.analysisIcon} />
            <h2>Analyse de performance</h2>
            {metrics.volumeChange > 0 ? (
              <BiUpArrowAlt className={`${styles.trendIcon} ${styles.positive}`} />
            ) : metrics.volumeChange < 0 ? (
              <BiDownArrowAlt className={`${styles.trendIcon} ${styles.negative}`} />
            ) : (
              <BiMinus className={`${styles.trendIcon} ${styles.neutral}`} />
            )}
          </div>
          <p>
            {metrics.volumeChange > 0 
              ? `🚀 Belle progression ! Vous avez augmenté votre volume total de ${metrics.volumeChange}% par rapport à votre dernière séance.`
              : metrics.volumeChange < 0
                ? `Cette séance était un peu moins intense que la précédente avec une variation de ${metrics.volumeChange}% du volume total.`
                : `Vous avez maintenu votre niveau de performance par rapport à la dernière séance.`
            }
          </p>
        </div>
      )}

      <div className={styles.exerciseCharts}>
        <h2>Progression par exercice</h2>
        {savedSessionData?.savedExercises?.map((exercise: SavedExercise) => {
          // Get the exercise ID, handling both frontend and backend data structures
          const exerciseId = typeof exercise.exerciseId === 'object' 
            ? exercise.exerciseId?._id || exercise.exerciseId?.id 
            : exercise.exerciseId || exercise._id;
            
          if (!exerciseId) {
            console.warn('Exercise missing ID:', exercise);
            return null;
          }
          console.log('Rendering ExerciseChart for exercise:', { 
            name: exercise.name, 
            exerciseId,
            exerciseIdType: typeof exerciseId,
            exercise: JSON.stringify(exercise, null, 2)
          });
          return (
            <ExerciseChart
              key={exerciseId}
              name={exercise.name}
              history={prepareExerciseHistory(exerciseId)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Recapitulatif;