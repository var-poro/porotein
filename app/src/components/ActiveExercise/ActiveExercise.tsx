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
import { BiChevronDown } from 'react-icons/bi';
import NumberInput from '@/components/NumberInput/NumberInput.tsx';

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
                  <NumberInput value={repetitions} setValue={setRepetitions} />
                  <span className={styles.times}>x</span>
                  <NumberInput value={weight} setValue={setWeight} />
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
          </div>
        </>
      )}
      {!exerciseStarted && (
        <div className={styles.buttonsContainer}>
          <button onClick={handleStartExercise}>Démarrer</button>
          <span onClick={nextExercise}>Passer l'exercice</span>
        </div>
      )}
    </div>
  );
};

export default ActiveExercise;
