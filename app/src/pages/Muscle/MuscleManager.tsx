import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import {
  createMuscle,
  deleteMuscle,
  getMuscles,
  updateMuscle,
} from '@/services/muscleService';
import styles from './MusclesManager.module.scss';
import { BiChevronLeft } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import { Muscle } from '@/types/Muscle';
import { Loading } from '@/components';

const MuscleManager = () => {
  const [name, setName] = useState('');
  const [editingMuscle, setEditingMuscle] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: muscles, isLoading } = useQuery('muscles', getMuscles);

  const createMuscleMutation = useMutation(createMuscle, {
    onSuccess: () => {
      queryClient.invalidateQueries('muscles');
      setName('');
    },
  });

  const updateMuscleMutation = useMutation(
    ({ id, name }: { id: string; name: string }) =>
      updateMuscle(id, { name } as Muscle),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('muscles');
        setName('');
        setEditingMuscle(null);
      },
    }
  );

  const deleteMuscleMutation = useMutation((id: string) => deleteMuscle(id), {
    onSuccess: () => {
      queryClient.invalidateQueries('muscles');
    },
  });

  const handleCreateOrUpdateMuscle = () => {
    if (editingMuscle) {
      updateMuscleMutation.mutate({ id: editingMuscle, name });
    } else {
      createMuscleMutation.mutate({ name } as Muscle);
    }
  };

  const handleEdit = (muscle: Muscle) => {
    setName(muscle.name);
    setEditingMuscle(muscle._id);
  };

  const handleDelete = (id: string) => {
    deleteMuscleMutation.mutate(id);
  };

  if (isLoading || !muscles) {
    return <Loading />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <BiChevronLeft onClick={() => navigate(-1)} />
        <h2>Modifier les muscles</h2>
      </div>
      <div className={styles.muscleInputContainer}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nom"
        />
        <div className={styles.buttonsContainer}>
          <button onClick={handleCreateOrUpdateMuscle}>
            {editingMuscle ? 'Modifier' : 'Ajouter'}
          </button>
          {editingMuscle && (
            <button
              className={styles.delete}
              onClick={() => handleDelete(editingMuscle)}
            >
              Supprimer
            </button>
          )}
        </div>
      </div>
      <ul className={styles.musclesList}>
        {muscles.map((muscle: Muscle) => (
          <li
            onClick={() => handleEdit(muscle)}
            className={`${styles.muscle} ${muscle._id === editingMuscle ? styles.selected : ''}`}
            key={muscle._id}
          >
            <span>{muscle.name}</span>
          </li>
        ))}
        {muscles.length > 0 && (
          <li
            onClick={() => {
              setName('');
              setEditingMuscle(null);
            }}
            className={`${styles.muscle} ${!editingMuscle ? styles.selected : ''}`}
          >
            <span>Ajouter un muscle</span>
          </li>
        )}
      </ul>
    </div>
  );
};

export default MuscleManager;
