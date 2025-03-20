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

const Recapitulatif = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isJustFinished = location.state?.justFinished;
  const { data: user } = useGetCurrentUser();

  const { data: savedSessionData, isLoading: sessionLoading, isError: sessionError } = useQuery(
    ['savedSession', id],
    () => getSavedSessionById(id || ''),
    { 
      enabled: !!id,
      retry: false // Ne pas réessayer si la requête échoue
    }
  );

  console.log('savedSessionData:', savedSessionData);

  const { data: historicalSessions, isLoading: historyLoading } = useQuery(
    ['sessionHistory', savedSessionData?.session?._id],
    () => {
      console.log('Fetching history for sessionId:', savedSessionData?.session?._id);
      return getSavedSessionsBySessionId(savedSessionData?.session?._id || '');
    },
    { enabled: !!savedSessionData?.session?._id }
  );

  console.log('historicalSessions:', historicalSessions);

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

  const handleDelete = () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette séance ?')) {
      deleteMutation.mutate(id || '');
    }
  };

  const sessionData = savedSessionData?.session;

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

  const prepareExerciseHistory = (exerciseId: string) => {
    console.log('Historical Sessions:', historicalSessions);
    console.log('Exercise ID:', exerciseId);
    
    const history = historicalSessions?.map((savedSession: SavedSession) => {
      console.log('Processing session:', savedSession);
      const exercise = savedSession.exercises?.find(savedExercise => {
        const exId = savedExercise._id;
        console.log('Comparing IDs:', exId, exerciseId);
        return exId?.toString() === exerciseId?.toString();
      });
      
      if (!exercise) {
        console.log('Exercise not found in session');
        return null;
      }
      
      console.log('Found exercise:', exercise);
      const avgReps = exercise.repSets?.reduce((sum, set) => sum + set.repetitions, 0) / exercise.repSets?.length;
      const avgWeight = exercise.repSets?.reduce((sum, set) => sum + set.weight, 0) / exercise.repSets?.length;
      
      const result = {
        date: new Date(savedSession.performedAt).toLocaleDateString(),
        reps: Math.round(avgReps),
        weight: Math.round(avgWeight)
      };
      console.log('Prepared data point:', result);
      return result;
    }).filter(Boolean);
    
    console.log('Final history for exercise:', history);
    return history;
  };

  interface Session {
    savedExercises: Array<{
      savedRepSets: Array<{
        weight: number;
        repetitions: number;
      }>;
    }>;
    performedAt: string;
  }

  const calculatePerformanceMetrics = () => {
    if (!historicalSessions || historicalSessions.length < 2) return null;
  
    const previousSession = historicalSessions[1];
    const currentSession = savedSessionData;
  
    const totalVolume = (session: Session) => 
      session.savedExercises?.reduce((acc, ex) => 
        acc + ex.savedRepSets?.reduce((setAcc: number, set: { weight: number; repetitions: number }) => 
          setAcc + (set.weight * set.repetitions), 0), 0);
  
    const currentVolume = totalVolume(currentSession);
    const previousVolume = totalVolume(previousSession);
    const volumeChange = ((currentVolume - previousVolume) / previousVolume) * 100;
  
    return {
      volumeChange: Math.round(volumeChange * 10) / 10,
      totalVolume: Math.round(currentVolume),
      previousVolume: Math.round(previousVolume)
    };
  };

  const metrics = calculatePerformanceMetrics();

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
          value={savedSessionData?.savedExercises?.length}
          icon="performance"
        />
        <Tile
          title="Séries totales"
          value={savedSessionData?.savedExercises?.reduce((acc: number, ex: { repSets: Array<{ weight: number; repetitions: number }> }) => acc + ex.repSets?.length, 0)}
          icon="stats"
        />
        <Tile
          title="Durée totale"
          value={formatDuration(savedSessionData?.duration)}
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
        {savedSessionData?.savedExercises?.map((exercise: SavedExercise) => (
          <ExerciseChart
            key={exercise.exerciseId}
            name={exercise.name}
            history={prepareExerciseHistory(exercise.exerciseId)}
          />
        ))}
      </div>
    </div>
  );
};

export default Recapitulatif;
