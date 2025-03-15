import { FC, useEffect, useRef, useState } from 'react';
import { useQuery } from 'react-query';
import apiClient from '@/services/apiService.ts';
import styles from './ActiveExercise.module.scss';
import { Muscle } from '@/types/Muscle.ts';
import { Tag } from '@/types/Tag.ts';
import { Exercise } from '@/types/Exercise.ts';
import { Loading } from '@/components';
import Timer from '@/components/Timer/Timer.tsx';
import { BiChevronDown } from 'react-icons/bi';
import RepSetInputs from '@/components/RepSetInputs/RepSetInputs.tsx';
import YoutubeVideo from '@/components/YoutubeVideo/YoutubeVideo.tsx';
import { useLocalStorage } from '@/utils/useLocalStorage.ts';

type Props = {
  exercise: Exercise;
  nextExercise: () => void;
  previousExercise: () => void;
  hasPrevious: boolean;
};

const ActiveExercise: FC<Props> = ({ exercise, nextExercise, previousExercise, hasPrevious }) => {
  const [exerciseStarted, setExerciseStarted] = useState(false);
  const [repSetIsDone, setRepSetIsDone] = useState(false);
  const [currentSeriesIndex, setCurrentSeriesIndex] = useState(0);
  const [repSets, setRepSets] = useLocalStorage(`repSets_${exercise._id}`, exercise.repSets);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const exerciseRef = useRef<HTMLDivElement>(null);

  const { data: muscles, isLoading: isMusclesLoading } = useQuery(
    'muscles',
    async () => {
      const { data } = await apiClient.get('/muscles');
      return data;
    }
  );

  const { data: tags, isLoading: isTagsLoading } = useQuery(
    'tags',
    async () => {
      const { data } = await apiClient.get('/tags');
      return data;
    }
  );

  // Restaurer l'état de l'exercice au chargement
  useEffect(() => {
    const savedState = localStorage.getItem(`exerciseState_${exercise._id}`);
    if (savedState) {
      try {
        const state = JSON.parse(savedState);
        console.log(`Restauration de l'état de l'exercice ${exercise._id}:`, state);
        setExerciseStarted(state.exerciseStarted || false);
        setRepSetIsDone(state.repSetIsDone || false);
        setCurrentSeriesIndex(state.currentSeriesIndex || 0);
        setIsCollapsed(state.isCollapsed || false);
      } catch (error) {
        console.error(`Erreur lors de la restauration de l'état de l'exercice ${exercise._id}:`, error);
        localStorage.removeItem(`exerciseState_${exercise._id}`);
      }
    }
  }, [exercise._id]);

  // Gérer les changements de visibilité
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        // L'application est mise en arrière-plan
        console.log(`Exercice ${exercise._id}: Application mise en arrière-plan`);
        // Sauvegarder l'état de l'exercice
        const state = {
          exerciseStarted,
          repSetIsDone,
          currentSeriesIndex,
          isCollapsed
        };
        localStorage.setItem(`exerciseState_${exercise._id}`, JSON.stringify(state));
        console.log(`État de l'exercice ${exercise._id} sauvegardé:`, state);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [exercise._id, exerciseStarted, repSetIsDone, currentSeriesIndex, isCollapsed]);

  const saveExerciseToLocal = () => {
    const savedSession = JSON.parse(
      localStorage.getItem('activeSession') || '{"exercises": []}'
    );
  
    const currentRepSets = repSets || exercise.repSets || [];
  
    const updatedSession = {
      ...savedSession,
      programId: savedSession.programId,
      duration: savedSession.duration || 0,
      exercises: (savedSession.exercises || []).map((ex: Exercise) =>
        ex._id === exercise._id
          ? {
              exerciseId: exercise._id,
              name: exercise.name,
              duration: ex.duration || 0,
              repSets: currentRepSets.map((repSet: any, index: number) => ({
                repSetId: `${exercise._id}_${index}`,
                repetitions: Number(repSet.repetitions) || 0,
                weight: Number(repSet.weight) || 0,
                restTime: repSet.restTime !== undefined ? Number(repSet.restTime) : exercise.repSets[index].restTime,
                duration: repSet.duration || 0,
              })),
            }
          : ex
      ),
    };
  
    localStorage.setItem('activeSession', JSON.stringify(updatedSession));
    
    // Sauvegarder également l'état de l'exercice
    const state = {
      exerciseStarted,
      repSetIsDone,
      currentSeriesIndex,
      isCollapsed
    };
    localStorage.setItem(`exerciseState_${exercise._id}`, JSON.stringify(state));
  };

  const handleNextRepSet = () => {
    if (!repSetIsDone) {
      setRepSetIsDone(true);
    } else {
      setRepSetIsDone(false);
      setCurrentSeriesIndex(currentSeriesIndex + 1);
    }
    saveExerciseToLocal();
  };

  const handlePreviousRepSet = () => {
    if (repSetIsDone) {
      setRepSetIsDone(false);
    } else if (currentSeriesIndex > 0) {
      setCurrentSeriesIndex(currentSeriesIndex - 1);
      setRepSetIsDone(true);
    }
    saveExerciseToLocal();
  };

  const handleStartExercise = () => {
    setExerciseStarted(true);
    setIsCollapsed(true);
    saveExerciseToLocal();
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  useEffect(() => {
    // Ne pas réinitialiser l'état si nous avons déjà un état sauvegardé
    if (!localStorage.getItem(`exerciseState_${exercise._id}`)) {
      setCurrentSeriesIndex(0);
      setExerciseStarted(false);
      setRepSetIsDone(false);
      setIsCollapsed(false);
      setVideoLoaded(false);
      setRepSets(exercise.repSets);
    }
  }, [exercise]);

  useEffect(() => {
    if (exerciseRef.current) {
      if (isCollapsed) {
        exerciseRef.current.style.height = '0px';
      } else {
        exerciseRef.current.style.height = `${exerciseRef.current.scrollHeight}px`;
      }
    }
  }, [isCollapsed, videoLoaded]);

  const handleVideoLoad = () => {
    setVideoLoaded(true);
  };

  if (isMusclesLoading || isTagsLoading) return <Loading />;

  return (
    <div className={styles.activeExercise}>
      <div className={styles.exerciseHeader} onClick={toggleCollapse}>
        <h3>{exercise.name}</h3>
        <span>
          <BiChevronDown
            className={`${isCollapsed ? styles.collapsedIcon : ''}`}
          />
        </span>
      </div>
      <div
        ref={exerciseRef}
        className={`${styles.exercise} ${isCollapsed ? styles.collapsed : ''}`}
      >
        <span>{exercise.description}</span>
        {exercise.videoUrl && (
          <YoutubeVideo
            youtubeUrl={exercise.videoUrl}
            onLoad={handleVideoLoad}
          />
        )}
        {!exerciseStarted && (
          <div className={styles.buttonsContainer}>
            <button onClick={handleStartExercise}>Démarrer</button>
            <div className={styles.navigationButtons}>
              {hasPrevious && (
                <span onClick={previousExercise}>Exercice précédent</span>
              )}
              <span onClick={nextExercise}>Passer l'exercice</span>
            </div>
          </div>
        )}
        <h5>Muscles</h5>
        <div className={styles.tagsContainer}>
          {muscles
            .filter((muscle: Muscle) =>
              exercise.targetMuscles.some(
                (exerciceMuscle: string) => exerciceMuscle === muscle._id
              )
            )
            .map((muscle: Muscle) => (
              <div className={styles.tag} key={muscle._id}>
                {muscle.name}
              </div>
            ))}
        </div>
        <h5>Tags</h5>
        <div className={styles.tagsContainer}>
          {tags
            .filter((tag: Tag) =>
              exercise.tags.some(
                (exerciceTag: string) => exerciceTag === tag._id
              )
            )
            .map((tag: Tag) => (
              <div className={styles.tag} key={tag._id}>
                {tag.name}
              </div>
            ))}
        </div>
      </div>
      {exerciseStarted && (
        <>
          <div className={styles.header}>
            <h4>Série {currentSeriesIndex + 1} </h4>
            <small>/ {exercise.repSets.length}</small>
          </div>
          {exercise.repSets?.[currentSeriesIndex] && (
            <>
              {!repSetIsDone ? (
                <RepSetInputs
                  repetitions={repSets[currentSeriesIndex]?.repetitions || 0}
                  setRepetitions={(value) => {
                    setRepSets((prevRepSets: any[]) => {
                      const newRepSets = [...prevRepSets];
                      newRepSets[currentSeriesIndex].repetitions = value;
                      return newRepSets;
                    });
                    saveExerciseToLocal();
                  }}
                  weight={repSets[currentSeriesIndex]?.weight || 0}
                  setWeight={(value) => {
                    setRepSets((prevRepSets: any[]) => {
                      const newRepSets = [...prevRepSets];
                      newRepSets[currentSeriesIndex].weight = value;
                      return newRepSets;
                    });
                    saveExerciseToLocal();
                  }}
                />
              ) : (
                <Timer
                  seconds={repSets[currentSeriesIndex]?.restTime || 0}
                  setSeconds={(value) => {
                    setRepSets((prevRepSets: any[]) => {
                      const newRepSets = [...prevRepSets];
                      newRepSets[currentSeriesIndex].restTime = value;
                      return newRepSets;
                    });
                    saveExerciseToLocal();
                  }}
                  defaultValue={exercise.repSets?.[currentSeriesIndex].restTime}
                  onComplete={() => {
                    if (currentSeriesIndex + 1 === exercise.repSets.length) {
                      nextExercise();
                    } else {
                      handleNextRepSet();
                    }
                  }}
                />
              )}
            </>
          )}
          <div className={styles.buttonsContainer}>
            <div className={styles.repSetNavigation}>
              {(currentSeriesIndex > 0 || repSetIsDone) && (
                <button onClick={handlePreviousRepSet}>Précédent</button>
              )}
              {currentSeriesIndex + 1 !== exercise.repSets.length || !repSetIsDone ? (
                <button onClick={handleNextRepSet}>Suivant</button>
              ) : (
                <button onClick={nextExercise}>Terminer l'exercice</button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ActiveExercise;
