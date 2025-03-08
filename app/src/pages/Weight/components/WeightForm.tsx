import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import { addWeightEntry, updateWeightEntry } from '@/services/weightService';
import styles from './WeightForm.module.scss';
import { WeightDetail } from '@/types/Weight';

interface WeightFormInputs {
  weight: number;
  date: string;
}

interface WeightFormProps {
  initialData?: WeightDetail;
  onDelete?: (id: string) => void;
}

const WeightForm: React.FC<WeightFormProps> = ({ initialData, onDelete }) => {
  const { register, handleSubmit, reset } = useForm<WeightFormInputs>();
  const queryClient = useQueryClient();

  // Add useEffect to reset form when initialData changes
  React.useEffect(() => {
    if (initialData) {
      reset({
        weight: initialData.weight,
        date: new Date(initialData.date).toISOString().split('T')[0]
      });
    } else {
      reset({
        date: new Date().toISOString().split('T')[0]
      });
    }
  }, [initialData, reset]);

  const mutation = useMutation(
    (data: WeightFormInputs) => isEditing 
      ? updateWeightEntry(initialData._id!, data)
      : addWeightEntry(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('userData');
        reset();
      },
    }
  );

  const onSubmit = (data: WeightFormInputs) => {
    mutation.mutate(data);
  };

  const isEditing = !!initialData;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.weightForm}>
      <div className={styles.formGroup}>
        <div className={styles.inputWithUnit}>
          <input
            type="number"
            step="0.1"
            placeholder="Poids"
            {...register('weight', { required: true, min: 20, max: 300 })}
          />
          <span className={styles.unit}>kg</span>
        </div>
        <input
          type="date"
          {...register('date')}
          defaultValue={new Date().toISOString().split('T')[0]}
        />
        <div className={styles.buttons}>
          <button type="submit">
            {isEditing ? 'Modifier' : 'Ajouter'}
          </button>
          {isEditing && (
            <button 
              type="button" 
              onClick={() => onDelete?.(initialData._id!)}
              className={styles.deleteButton}
            >
              Supprimer
            </button>
          )}
        </div>
      </div>
    </form>
  );
};

export default WeightForm;