import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import styles from './RepSetForm.module.scss';
import { BiChevronLeft } from 'react-icons/bi';
import { GiWeight, GiWeightLiftingUp } from 'react-icons/gi';
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
  const [weight, setWeight] = useState(1);
  const [restTime, setRestTime] = useState(90);
  const { data: repSet, isLoading: isRepSetLoading } = useQuery(
    ['repSet', repSetId],
    () => getRepSetById(exerciseId!, repSetId!),
    { enabled: isEditMode }
  );

  useEffect(() => {
    if (repSet) {
      setRepetitions(repSet.repetitions);
      setWeight(repSet.weight);
      setRestTime(repSet.restTime);
    }
  }, [repSet]);

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
      restTime,
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
            <div className={styles.repetitionsContainer}>
              <div className={styles.inputContainer}>
                <label>
                  Répétitions <GiWeightLiftingUp />
                </label>
                <input
                  type="number"
                  value={repetitions}
                  onChange={(e) => setRepetitions(parseInt(e.target.value))}
                  min={1}
                />
              </div>
              <span>x</span>
              <div className={styles.inputContainer}>
                <label>
                  Poids <GiWeight />
                </label>
                <div className={styles.weightInput}>
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(parseInt(e.target.value))}
                    min={0}
                  />
                  <small>kg</small>
                </div>
              </div>
            </div>
            <div className={styles.inputContainer}>
              <label>
                Temps de repos <MdOutlineTimer />
              </label>
              <input
                type="number"
                value={restTime}
                onChange={(e) => setRestTime(parseInt(e.target.value))}
                min={0}
              />
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
