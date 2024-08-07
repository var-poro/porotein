import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import styles from './RepSetForm.module.scss';
import { BiChevronLeft } from 'react-icons/bi';
import { MdOutlineTimer } from 'react-icons/md';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import {
  createRepSet,
  deleteRepSet,
  getRepSetById,
  updateRepSet,
} from '@/services/exerciseService';
import { RepSet } from '@/types/Exercise';
import { Loading } from '@/components';
import RepSetInputs from '@/components/RepSetInputs/RepSetInputs.tsx';

const RepSetForm = () => {
  const { exerciseId, repSetId } = useParams<{
    exerciseId: string;
    repSetId?: string;
  }>();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('sessionId')!;
  const isEditMode = !!repSetId;
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [repetitions, setRepetitions] = useState(1);
  const [weight, setWeight] = useState(0);
  const [restTime, setRestTime] = useState('01:30');
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const { data: repSet, isLoading: isRepSetLoading } = useQuery(
    ['repSet', repSetId],
    () => getRepSetById(exerciseId!, repSetId!),
    { enabled: isEditMode }
  );

  useEffect(() => {
    if (repSet) {
      setRepetitions(repSet.repetitions);
      setWeight(repSet.weight);
      setRestTime(convertSecondsToTime(repSet.restTime));
    }
  }, [repSet]);

  const convertTimeToSeconds = (time: string) => {
    const [minutes, seconds] = time.split(':').map(Number);
    return minutes * 60 + (seconds || 0);
  };

  const convertSecondsToTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      const now = new Date();
      if (!startTime) {
        setStartTime(now);
      }

      interval = setInterval(() => {
        const elapsedTime = Math.floor(
          (new Date().getTime() - (startTime?.getTime() || now.getTime())) /
            1000
        );
        const remainingTime = convertTimeToSeconds(restTime) - elapsedTime;

        if (remainingTime <= 0) {
          clearInterval(interval);
          setIsRunning(false);
          setRestTime(convertSecondsToTime(0));
        } else {
          setRestTime(convertSecondsToTime(remainingTime));
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, startTime, restTime]);

  const createRepSetMutation = useMutation(
    (newRepSet: RepSet) => createRepSet(exerciseId!, newRepSet),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['exercise', exerciseId]);
        navigate(`/exercise/edit/${exerciseId}?sessionId=${sessionId}`);
      },
    }
  );

  const updateRepSetMutation = useMutation(
    (updatedRepSet: RepSet) =>
      updateRepSet(exerciseId!, repSetId!, updatedRepSet),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['exercise', exerciseId]);
        navigate(`/exercise/edit/${exerciseId}?sessionId=${sessionId}`);
      },
    }
  );

  const deleteRepSetMutation = useMutation(
    () => deleteRepSet(exerciseId!, repSetId!),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['exercise', exerciseId]);
        navigate(`/exercise/edit/${exerciseId}?sessionId=${sessionId}`);
      },
    }
  );

  const handleSubmit = () => {
    const repSetData: Omit<RepSet, '_id'> = {
      repetitions,
      weight,
      restTime: convertTimeToSeconds(restTime),
    };

    if (isEditMode) {
      updateRepSetMutation.mutate({ ...repSetData, _id: repSetId! });
    } else {
      createRepSetMutation.mutate(repSetData as RepSet);
    }
  };

  const handleDelete = () => {
    if (isEditMode) {
      deleteRepSetMutation.mutate();
    }
  };

  const handleRestTimeChange = (value: string) => {
    const timePattern = /^\d{2}:\d{2}$/;
    if (timePattern.test(value)) {
      setRestTime(value);
    } else if (value === '') {
      setRestTime('00:00:00');
    }
  };

  if (isRepSetLoading) {
    return <Loading />;
  }

  return (
    <div className={styles.container}>
      <div>
        <div className={styles.header}>
          <BiChevronLeft onClick={() => navigate(-1)} />
          <h2>{isEditMode ? 'Modifier une série' : 'Créer une série'}</h2>
        </div>

        <form onSubmit={(e) => e.preventDefault()}>
          <div>
            <RepSetInputs
              repetitions={repetitions}
              withLabels
              setRepetitions={setRepetitions}
              weight={weight}
              setWeight={setWeight}
            />
            <div className={styles.inputContainer}>
              <label>
                Temps de repos <MdOutlineTimer />
              </label>
              <div className={styles.timeInputWrapper}>
                <input
                  type="text"
                  value={restTime}
                  onChange={(e) => handleRestTimeChange(e.target.value)}
                  className={styles.timeDisplay}
                />
                <input
                  type="time"
                  value={restTime}
                  onChange={(e) => handleRestTimeChange(e.target.value)}
                  className={styles.timePicker}
                  min={'00:00'}
                  max={'59:59'}
                  pattern="[0-9]{2}:[0-9]{2}"
                  step={1}
                />
              </div>
            </div>
          </div>
          <div className={styles.buttonsContainer}>
            {isEditMode && (
              <button
                type="button"
                onClick={handleDelete}
                className={styles.deleteButton}
              >
                Supprimer
              </button>
            )}
            <button
              type="button"
              onClick={handleSubmit}
              className={styles.saveButton}
            >
              {isEditMode ? 'Enregistrer les modifications' : 'Créer la série'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RepSetForm;
