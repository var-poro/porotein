import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Program } from '@/types/Program.ts';
import styles from './ProgramForm.module.scss';
import {
  createProgram,
  deleteProgram,
  getProgramById,
  updateProgram,
} from '@/services/programService.ts';
import { Loading, Modal } from '@/components';

const ProgramForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { register, handleSubmit, setValue } = useForm<ProgramFormInputs>();
  const { data: program, isLoading: isLoadingProgram } = useQuery<Program>(
    ['program', id],
    () => getProgramById(id as string),
    {
      enabled: !!id,
    }
  );

  const createMutation = useMutation(createProgram, {
    onSuccess: () => {
      queryClient.invalidateQueries('programs');
      navigate('/');
    },
  });

  const updateMutation = useMutation(
    (updatedProgram: ProgramFormInputs) =>
      updateProgram(id as string, updatedProgram as Program),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('programs');
        navigate('/');
      },
    }
  );

  const deleteMutation = useMutation(deleteProgram, {
    onSuccess: () => {
      queryClient.invalidateQueries('programs');
      navigate('/');
    },
  });

  useEffect(() => {
    if (program) {
      setValue('name', program.name);
      setValue('description', program.description);
    }
  }, [program, setValue]);

  const onSubmit = (data: ProgramFormInputs) => {
    if (id) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const handleDelete = () => {
    if (id) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoadingProgram) {
    return <Loading />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.programForm}>
        <h1>
          {id ? `Modifier le programme ${program?.name}` : 'Créer un programme'}
        </h1>
        <p>
          Renseigne le nom et une description pour ton nouveau programme.
          L'entraînement commence bientôt !
        </p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Nom du programme</label>
            <input
              placeholder="Prise de masse"
              id="name"
              {...register('name', { required: true })}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="description">Description</label>
            <textarea
              placeholder="Prendre de la masse musculaire sans prendre de masse graisseuse"
              id="description"
              {...register('description', { required: true })}
            />
          </div>
          <button type="submit">
            {id ? `Modifier ${program?.name}` : 'Créer'}
          </button>
          {id && (
            <button
              type="button"
              className={styles.deleteButton}
              onClick={() => setIsModalOpen(true)}
            >
              Supprimer
            </button>
          )}
        </form>
      </div>
      <Modal
        title="Confirmer la suppression"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDelete}
      >
        <p>
          Êtes-vous sûr de vouloir supprimer ce programme ? Cette action est
          irréversible.
        </p>
      </Modal>
    </div>
  );
};

interface ProgramFormInputs {
  name: string;
  description: string;
}

export default ProgramForm;
