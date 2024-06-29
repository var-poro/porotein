import { BiChevronLeft, BiDumbbell, BiPlus } from 'react-icons/bi';
import styles from './SessionForm.module.scss';
import { LiaDumbbellSolid } from 'react-icons/lia';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import {
  createSession,
  deleteSession,
  getSessionById,
  updateSession,
} from '@/services/sessionService';
import { useGetCurrentUser } from '@/utils/useGetCurrentUser';
import { Program } from '@/types/Program';
import { Loading } from '@/components';
import { Session } from '@/types/Session.ts';

const SessionForm = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id } = useParams<{ id: string }>();
  const { data: user, isLoading: userLoading } = useGetCurrentUser();
  const [sessionName, setSessionName] = useState('');
  const [sessionDescription, setSessionDescription] = useState('');
  const [exercises, setExercises] = useState<any[]>([]);

  const { data: sessionData, isLoading: sessionLoading } = useQuery(
    ['session', id],
    () => getSessionById(id!),
    { enabled: !!id }
  );

  const createMutation = useMutation(createSession, {
    onSuccess: (data) => {
      queryClient.invalidateQueries('programs');
      navigate(`/sessions/${data._id}`);
    },
  });

  const updateMutation = useMutation(
    (updatedSession: Session) => updateSession(id!, updatedSession),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('programs');
      },
    }
  );

  const deleteMutation = useMutation(() => deleteSession(id!), {
    onSuccess: () => {
      queryClient.invalidateQueries('programs');
      navigate(`/`);
    },
  });

  useEffect(() => {
    if (sessionData) {
      setSessionName(sessionData.name);
      setSessionDescription(sessionData.description);
      setExercises(sessionData.exercises || []);
    }
  }, [sessionData]);

  const handleSaveSession = () => {
    const sessionToSaveData = {
      name: sessionName,
      description: sessionDescription,
      userId: user?._id,
      programId: (user?.activeProgram as Program)._id,
    };
    if (id) {
      updateMutation.mutate(sessionToSaveData as Session);
    } else {
      createMutation.mutate(sessionToSaveData as Session);
    }
  };

  if (userLoading || sessionLoading) {
    return <Loading />;
  }

  return (
    <div className={styles.container}>
      <div>
        <div className={styles.header}>
          <BiChevronLeft onClick={() => navigate(-1)} />
          <h2>{id ? 'Modifier la séance' : 'Créer une séance'}</h2>
        </div>
        <div className={styles.inputContainer}>
          <label htmlFor="name">Nom de la séance</label>
          <input
            id="name"
            placeholder="Haut de corps"
            type="text"
            value={sessionName}
            onChange={(e) => setSessionName(e.target.value)}
          />
        </div>
        <div className={styles.inputContainer}>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            placeholder="Séance ciblée sur le haut du corps : dos, épaules."
            value={sessionDescription}
            onChange={(e) => setSessionDescription(e.target.value)}
          />
        </div>
        <div className={styles.exercisesContainer}>
          <h4>Exercices</h4>
          <div className={styles.exercisesList}>
            {exercises.map((exercise: any, index: number) => (
              <div key={index} className={styles.exercise}>
                <div className={styles.exerciseText}>
                  {index % 2 ? (
                    <BiDumbbell className={styles.exerciseIcon} />
                  ) : (
                    <LiaDumbbellSolid className={styles.exerciseIcon} />
                  )}
                  <span>{exercise.name}</span>
                </div>
                <button
                  onClick={() =>
                    navigate(`/exercise/edit/${exercise._id}?sessionId=${id}`)
                  }
                >
                  Modifier
                </button>
              </div>
            ))}
          </div>
          <br />
          <div className={styles.exercise}>
            {id && (
              <div
                className={styles.exerciseText}
                onClick={() => navigate(`/exercise/create?sessionId=${id}`)}
              >
                <BiPlus className={styles.exerciseIcon} />
                <span>Ajouter un exercice</span>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className={styles.buttonsContainer}>
        <button onClick={handleSaveSession}>
          {id ? 'Enregistrer les modifications' : 'Créer la séance'}
        </button>
        {id && (
          <button onClick={() => deleteMutation.mutate()}>Supprimer</button>
        )}
      </div>
    </div>
  );
};

export default SessionForm;
