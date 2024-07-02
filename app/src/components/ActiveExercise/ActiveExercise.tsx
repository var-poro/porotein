import { Exercise } from '@/types/Exercise.ts';
import { FC, useEffect, useRef, useState } from 'react';
import YoutubeVideo from '@/components/YoutubeVideo/YoutubeVideo.tsx';
import { useQuery } from 'react-query';
import apiClient from '@/services/apiService.ts';
import styles from './ActiveExercise.module.scss';
import { Muscle } from '@/types/Muscle.ts';
import { Tag } from '@/types/Tag.ts';
import { Loading } from '@/components';
import Timer from '@/components/Timer/Timer.tsx';
import { BiChevronDown, BiMinus, BiPlus } from 'react-icons/bi';

type Props = {
  exercise: Exercise;
  nextExercise: () => void;
};

const ActiveExercise: FC<Props> = ({ exercise, nextExercise }) => {
  const [exerciseStarted, setExerciseStarted] = useState<boolean>(false);
  const [repSetIsDone, setRepSetIsDone] = useState<boolean>(false);
  const [currentSeriesIndex, setCurrentSeriesIndex] = useState<number>(0);
  const [repetitions, setRepetitions] = useState<number>(0);
  const [weight, setWeight] = useState<number>(0);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
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

  const handleNextRepSet = () => {
    if (!repSetIsDone) setRepSetIsDone(true);
    else {
      setRepSetIsDone(false);
      setCurrentSeriesIndex(currentSeriesIndex + 1);
    }
  };

  const handleStartExercise = () => {
    setExerciseStarted(true);
    setIsCollapsed(true);
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleMouseDown = (callback: () => void) => {
    callback();
    const initialDelay = 500;
    let intervalDelay = 200;
    const intervalStep = 50;
    const maxIntervalDelay = 50;
    let timeoutId: NodeJS.Timeout;
    let intervalId: NodeJS.Timeout;

    const startInterval = () => {
      intervalId = setInterval(() => {
        callback();
        if (intervalDelay > maxIntervalDelay) {
          intervalDelay -= intervalStep;
          clearInterval(intervalId);
          startInterval();
        }
      }, intervalDelay);
    };

    timeoutId = setTimeout(() => {
      startInterval();
    }, initialDelay);

    const clearTimers = () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
      intervalDelay = 200; // Réinitialiser l'intervalDelay après chaque relâchement
    };

    document.addEventListener('mouseup', clearTimers, { once: true });
    document.addEventListener('touchend', clearTimers, { once: true });
  };

  useEffect(() => {
    setCurrentSeriesIndex(0);
    setExerciseStarted(false);
    setRepSetIsDone(false);
    setIsCollapsed(false);
  }, [exercise]);

  useEffect(() => {
    if (exercise.repSets?.[currentSeriesIndex]) {
      setRepetitions(exercise.repSets[currentSeriesIndex].repetitions);
      setWeight(exercise.repSets[currentSeriesIndex].weight);
    }
  }, [currentSeriesIndex, exercise.repSets]);

  useEffect(() => {
    if (exerciseRef.current) {
      if (isCollapsed) {
        exerciseRef.current.style.height = '0px';
      } else {
        exerciseRef.current.style.height = `${exerciseRef.current.scrollHeight}px`;
      }
    }
  }, [isCollapsed]);

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
        {exercise.videoUrl && <YoutubeVideo youtubeUrl={exercise.videoUrl} />}
        <h5>Muscles</h5>
        <div className={styles.tagsContainer}>
          {muscles
            .filter((muscle: Muscle) =>
              exercise.targetMuscles.some((exerciceMuscle: string) => {
                return exerciceMuscle === muscle._id;
              })
            )
            .map((muscle: Muscle) => {
              return (
                <div className={styles.tag} key={muscle._id}>
                  {muscle.name}
                </div>
              );
            })}
        </div>
        <h5>Tags</h5>
        <div className={styles.tagsContainer}>
          {tags
            .filter((tag: Tag) =>
              exercise.tags.some((exerciceTag: string) => {
                return exerciceTag === tag._id;
              })
            )
            .map((tag: Tag) => {
              return (
                <div className={styles.tag} key={tag._id}>
                  {tag.name}
                </div>
              );
            })}
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
                <div className={styles.repSetDataContainer}>
                  <div>
                    <input
                      type="tel"
                      value={repetitions}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        setRepetitions(isNaN(value) ? 0 : value);
                      }}
                    />
                    <div className={styles.editInputContainer}>
                      <BiMinus
                        onMouseDown={() =>
                          handleMouseDown(() => {
                            if (repetitions - 1 >= 0)
                              setRepetitions((prev) => prev - 1);
                          })
                        }
                        onTouchStart={() =>
                          handleMouseDown(() => {
                            if (repetitions - 1 >= 0)
                              setRepetitions((prev) => prev - 1);
                          })
                        }
                      />
                      <BiPlus
                        onMouseDown={() =>
                          handleMouseDown(() => {
                            setRepetitions((prev) => prev + 1);
                          })
                        }
                        onTouchStart={() =>
                          handleMouseDown(() => {
                            setRepetitions((prev) => prev + 1);
                          })
                        }
                      />
                    </div>
                  </div>
                  <span className={styles.times}>x</span>
                  <div>
                    <div className={styles.weightInput}>
                      <input
                        type="tel"
                        value={weight}
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          setWeight(isNaN(value) ? 0 : value);
                        }}
                      />
                      <small>kg</small>
                    </div>
                    <div className={styles.editInputContainer}>
                      <BiMinus
                        onMouseDown={() =>
                          handleMouseDown(() => {
                            if (weight - 1 >= 0) setWeight((prev) => prev - 1);
                          })
                        }
                        onTouchStart={() =>
                          handleMouseDown(() => {
                            if (weight - 1 >= 0) setWeight((prev) => prev - 1);
                          })
                        }
                      />
                      <BiPlus
                        onMouseDown={() =>
                          handleMouseDown(() => {
                            setWeight((prev) => prev + 1);
                          })
                        }
                        onTouchStart={() =>
                          handleMouseDown(() => {
                            setWeight((prev) => prev + 1);
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <Timer
                  defaultValue={exercise.repSets?.[currentSeriesIndex].restTime}
                />
              )}
            </>
          )}
          <div className={styles.buttonsContainer}>
            {currentSeriesIndex + 1 !== exercise.repSets.length ? (
              <button onClick={handleNextRepSet}>Suivant</button>
            ) : (
              <button onClick={nextExercise}>Terminer l'exercice</button>
            )}
            <small onClick={nextExercise}>Passer l'exercice</small>
          </div>
        </>
      )}
      {!exerciseStarted && (
        <button onClick={handleStartExercise}>Démarrer l'exercice</button>
      )}
    </div>
  );
};

export default ActiveExercise;
