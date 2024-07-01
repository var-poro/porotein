import { Exercise } from '@/types/Exercise.ts';
import { FC, useEffect, useState } from 'react';
import YoutubeVideo from '@/components/YoutubeVideo/YoutubeVideo.tsx';
import { useQuery } from 'react-query';
import apiClient from '@/services/apiService.ts';
import styles from './ActiveExercise.module.scss';
import { Muscle } from '@/types/Muscle.ts';
import { Tag } from '@/types/Tag.ts';
import { Loading } from '@/components';
import Timer from '@/components/Timer/Timer.tsx';

type Props = {
  exercise: Exercise;
  nextExercise: () => void;
};

const ActiveExercise: FC<Props> = ({ exercise, nextExercise }) => {
  const [repSetIsDone, setRepSetIsDone] = useState<boolean>(false);
  const [currentSeriesIndex, setCurrentSeriesIndex] = useState<number>(0);
  const [repetitions, setRepetitions] = useState<number>(0);
  const [weight, setWeight] = useState<number>(0);

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

  useEffect(() => {
    setCurrentSeriesIndex(0);
  }, [exercise]);

  useEffect(() => {
    if (exercise.repSets?.[currentSeriesIndex]) {
      setRepetitions(exercise.repSets[currentSeriesIndex].repetitions);
      setWeight(exercise.repSets[currentSeriesIndex].weight);
    }
  }, [currentSeriesIndex, exercise.repSets]);

  if (isMusclesLoading || isTagsLoading) return <Loading />;

  return (
    <div className={styles.activeExercice}>
      <h3>{exercise.name}</h3>
      <span>{exercise.description}</span>
      {exercise.videoUrl && <YoutubeVideo youtubeUrl={exercise.videoUrl} />}
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
      <div className={styles.header}>
        <h4>Série {currentSeriesIndex + 1} </h4>
        <small>/ {exercise.repSets.length}</small>
      </div>
      {exercise.repSets?.[currentSeriesIndex] && (
        <>
          {!repSetIsDone ? (
            <div className={styles.repSetDataContainer}>
              <input
                type="tel"
                value={repetitions}
                onChange={(e) => setRepetitions(Number(e.target.value))}
              />
              <span>x</span>
              <div className={styles.weightInput}>
                <input
                  type="tel"
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                />
                <small>kg</small>
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
    </div>
  );
};

export default ActiveExercise;
