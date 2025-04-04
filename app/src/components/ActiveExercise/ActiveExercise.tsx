import { FC, useEffect, useRef, useState } from 'react';
import { useQuery } from 'react-query';
import apiClient from '@/services/apiService.ts';
import styles from './ActiveExercise.module.scss';
import { Muscle } from '@/types/Muscle.ts';
import { Tag } from '@/types/Tag.ts';
import { Exercise, RepSet } from '@/types/Exercise.ts';
import { Loading } from '@/components';
import Timer from '@/components/Timer/Timer.tsx';
import { BiChevronDown, BiChevronLeft, BiChevronRight } from 'react-icons/bi';
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
  const transitionRef = useRef<number | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);
  const [isRunning, setIsRunning] = useState(false);

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
              repSets: currentRepSets.map((repSet: RepSet, index: number) => ({
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
      // On met à jour l'index après avoir sauvegardé l'état actuel
      const nextIndex = currentSeriesIndex + 1;
      setCurrentSeriesIndex(nextIndex);
      setRepSetIsDone(false);
      
      // On s'assure que les valeurs de la nouvelle série sont correctement initialisées
      if (repSets[nextIndex]) {
        setRepSets((prevRepSets: RepSet[]) => {
          const newRepSets = [...prevRepSets];
          // On s'assure que la nouvelle série a les bonnes valeurs par défaut
          newRepSets[nextIndex] = {
            ...newRepSets[nextIndex],
            repetitions: newRepSets[nextIndex].repetitions || 0,
            weight: newRepSets[nextIndex].weight || 0,
            restTime: newRepSets[nextIndex].restTime || exercise.repSets[nextIndex].restTime
          };
          return newRepSets;
        });
      }
    }
    saveExerciseToLocal();
  };

  const handlePreviousRepSet = () => {
    if (repSetIsDone) {
      setRepSetIsDone(false);
    } else if (currentSeriesIndex > 0) {
      const prevIndex = currentSeriesIndex - 1;
      setCurrentSeriesIndex(prevIndex);
      setRepSetIsDone(true);
      
      // On s'assure que les valeurs de la série précédente sont correctement restaurées
      if (repSets[prevIndex]) {
        setRepSets((prevRepSets: RepSet[]) => {
          const newRepSets = [...prevRepSets];
          // On restaure les valeurs de la série précédente
          newRepSets[prevIndex] = {
            ...newRepSets[prevIndex],
            repetitions: newRepSets[prevIndex].repetitions || 0,
            weight: newRepSets[prevIndex].weight || 0,
            restTime: newRepSets[prevIndex].restTime || exercise.repSets[prevIndex].restTime
          };
          return newRepSets;
        });
      }
    }
    saveExerciseToLocal();
  };

  const handleTimerComplete = () => {
    if (currentSeriesIndex + 1 === exercise.repSets.length) {
      // Si c'est la dernière série, on passe directement à l'exercice suivant
      nextExercise();
    } else {
      handleNextRepSet();
    }
  };

  const handleManualNext = () => {
    if (currentSeriesIndex + 1 === exercise.repSets.length) {
      // Si c'est la dernière série, on passe directement à l'exercice suivant
      nextExercise();
    } else {
      handleNextRepSet();
    }
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
    // Réinitialiser uniquement l'état visuel
    setCurrentSeriesIndex(0);
    setExerciseStarted(false);
    setRepSetIsDone(false);
    setIsCollapsed(false);
    setVideoLoaded(false);
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

  // Nettoyage de l'intervalle lors du démontage
  useEffect(() => {
    return () => {
      if (transitionRef.current) {
        clearInterval(transitionRef.current);
        transitionRef.current = null;
      }
    };
  }, []);

  // S'assurer que les repSets correspondent à l'exercice actuel
  useEffect(() => {
    const savedRepSets = localStorage.getItem(`repSets_${exercise._id}`);
    if (!savedRepSets) {
      // Si pas de données sauvegardées, on utilise les valeurs par défaut
      setRepSets(exercise.repSets);
    } else {
      try {
        // Si des données existent, on s'assure qu'elles ont la bonne structure
        const parsedRepSets = JSON.parse(savedRepSets);
        const updatedRepSets = exercise.repSets.map((defaultRepSet, index) => ({
          ...defaultRepSet,
          ...(parsedRepSets[index] || {}),
          repetitions: parsedRepSets[index]?.repetitions || 0,
          weight: parsedRepSets[index]?.weight || 0,
          restTime: parsedRepSets[index]?.restTime || defaultRepSet.restTime
        }));
        setRepSets(updatedRepSets);
      } catch (error) {
        // En cas d'erreur de parsing, on utilise les valeurs par défaut
        console.error(`Erreur lors du parsing des repSets pour l'exercice ${exercise._id}:`, error);
        setRepSets(exercise.repSets);
      }
    }
  }, [exercise._id]);

  const startCountdown = () => {
    setCountdown(3);
    countdownRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) {
          if (countdownRef.current) {
            clearInterval(countdownRef.current);
            countdownRef.current = null;
          }
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
    };
  }, []);

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
            <div className={styles.navigationButtons}>
              {hasPrevious && (
                <button onClick={previousExercise} disabled={!hasPrevious}>
                  <BiChevronLeft />
                  Précédent
                </button>
              )}
              <button onClick={handleStartExercise} className={styles.startButton}>
                Démarrer
              </button>
              <button onClick={nextExercise}>
                Suivant
                <BiChevronRight />
              </button>
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
            <h4>Série {currentSeriesIndex + 1}</h4>
            <small>/ {exercise.repSets.length}</small>
          </div>
          {repSetIsDone && 
           currentSeriesIndex + 1 < exercise.repSets.length && 
           repSets[currentSeriesIndex]?.weight !== repSets[currentSeriesIndex + 1]?.weight && 
           repSets[currentSeriesIndex + 1]?.weight !== undefined && (
            <div className={styles.weightChange}>
              <span>Poids : {repSets[currentSeriesIndex]?.weight || 0}kg → {repSets[currentSeriesIndex + 1]?.weight || 0}kg</span>
            </div>
          )}
          {exercise.repSets?.[currentSeriesIndex] && (
            <>
              {!repSetIsDone ? (
                <RepSetInputs
                  key={`repSet-${currentSeriesIndex}`}
                  repetitions={repSets[currentSeriesIndex]?.repetitions || 0}
                  setRepetitions={(value: number) => {
                    setRepSets((prevRepSets: RepSet[]) => {
                      const newRepSets = [...prevRepSets];
                      newRepSets[currentSeriesIndex] = {
                        ...newRepSets[currentSeriesIndex],
                        repetitions: value
                      };
                      return newRepSets;
                    });
                    saveExerciseToLocal();
                  }}
                  weight={repSets[currentSeriesIndex]?.weight || 0}
                  setWeight={(value: number) => {
                    setRepSets((prevRepSets: RepSet[]) => {
                      const newRepSets = [...prevRepSets];
                      newRepSets[currentSeriesIndex] = {
                        ...newRepSets[currentSeriesIndex],
                        weight: value
                      };
                      return newRepSets;
                    });
                    saveExerciseToLocal();
                  }}
                />
              ) : (
                <Timer
                  key={`timer-${currentSeriesIndex}`}
                  seconds={repSets[currentSeriesIndex]?.restTime || exercise.repSets[currentSeriesIndex].restTime}
                  defaultValue={exercise.repSets[currentSeriesIndex].restTime}
                  onComplete={handleTimerComplete}
                  onCountdownStart={startCountdown}
                  onTimeChange={(newSeconds, isRunning) => {
                    if (newSeconds > 0 || !isRunning) {
                      setRepSets((prevRepSets: RepSet[]) => {
                        const newRepSets = [...prevRepSets];
                        newRepSets[currentSeriesIndex] = {
                          ...newRepSets[currentSeriesIndex],
                          restTime: newSeconds
                        };
                        return newRepSets;
                      });
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
                <button onClick={handleNextRepSet}>
                  Suivant 
                  {countdown !== null && `(${countdown})`}
                </button>
              ) : (
                <button onClick={handleManualNext}>
                  Terminer l'exercice
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ActiveExercise;
