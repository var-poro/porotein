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
};

const ActiveExercise: FC<Props> = ({ exercise, nextExercise }) => {
  const [exerciseStarted, setExerciseStarted] = useState<boolean>(false);
  const [repSetIsDone, setRepSetIsDone] = useState<boolean>(false);
  const [currentSeriesIndex, setCurrentSeriesIndex] = useState<number>(0);
  const [repSets, setRepSets] = useLocalStorage('repSets', []);

  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [videoLoaded, setVideoLoaded] = useState<boolean>(false);
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

  useEffect(() => {
    setCurrentSeriesIndex(0);
    setExerciseStarted(false);
    setRepSetIsDone(false);
    setIsCollapsed(false);
    setVideoLoaded(false); // Reset video loaded state
  }, [exercise]);

  useEffect(() => {
    if (exercise.repSets?.[currentSeriesIndex]) {
      const { repetitions, weight, restTime } =
        exercise.repSets[currentSeriesIndex];
      setRepSets((prevRepSets: any[]) => {
        const newRepSets = [...prevRepSets];
        newRepSets[currentSeriesIndex] = {
          repetitions,
          weight,
          restTime,
        };
        return newRepSets;
      });
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
  }, [isCollapsed, videoLoaded]); // Add videoLoaded to dependencies

  const handleVideoLoad = () => {
    setVideoLoaded(true); // Set video loaded state to true when video is loaded
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
            <span onClick={nextExercise}>Passer l'exercice</span>
          </div>
        )}
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
                <RepSetInputs
                  repetitions={repSets[currentSeriesIndex]?.repetitions || 0}
                  setRepetitions={(value) => {
                    setRepSets((prevRepSets: any[]) => {
                      const newRepSets = [...prevRepSets];
                      newRepSets[currentSeriesIndex].repetitions = value;
                      return newRepSets;
                    });
                  }}
                  weight={repSets[currentSeriesIndex]?.weight || 0}
                  setWeight={(value) => {
                    setRepSets((prevRepSets: any[]) => {
                      const newRepSets = [...prevRepSets];
                      newRepSets[currentSeriesIndex].weight = value;
                      return newRepSets;
                    });
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
                  }}
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
          </div>
        </>
      )}
    </div>
  );
};

export default ActiveExercise;
