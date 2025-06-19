import { BiChevronLeft, BiPlus } from 'react-icons/bi';
import styles from './ExerciseForm.module.scss';
import { Difficulty, Loading, TagSelector } from '@/components';
import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { MdOutlineTimer } from 'react-icons/md';
import { GiWeight } from 'react-icons/gi';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import {
  createExerciseInSession,
  deleteExerciseFromSession,
  updateExerciseInSession,
} from '@/services/sessionService';
import apiClient from '@/services/apiService';
import { Exercise, RepSet } from '@/types/Exercise';
import { createRepSet } from '@/services/exerciseService.ts';
import { Muscle } from '@/types/Muscle';
import { Tag } from '@/types/Tag';

const ExerciseForm = () => {
  const { exerciseId } = useParams<{ exerciseId?: string }>();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('sessionId')!;
  const isEditMode = !!exerciseId;
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [selectedMuscles, setSelectedMuscles] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState<string | undefined>('1');
  const [repSets, setRepSets] = useState<RepSet[]>([]);

  const { data: exercise, isLoading: isExerciseLoading } = useQuery(
    ['exercise', exerciseId],
    () => apiClient.get(`/exercises/${exerciseId}`).then((res) => res.data),
    { enabled: isEditMode }
  );

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

  useEffect(() => {
    if (exercise) {
      setName(exercise.name);
      setDescription(exercise.description);
      setVideoUrl(exercise.videoUrl || '');
      setSelectedMuscles(exercise.targetMuscles);
      setSelectedTags(exercise.tags);
      setDifficulty(exercise.difficulty);
      setRepSets(exercise.repSets || []);
    }
  }, [exercise]);

  const createExerciseMutation = useMutation(
    (exercise: Exercise) => createExerciseInSession(sessionId, exercise),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['session', sessionId]);
        navigate(`/exercise/edit/${data._id}?sessionId=${sessionId}`);
      },
    }
  );

  const createRepSetMutation = useMutation(
    (newRepSet: RepSet) => createRepSet(exerciseId!, newRepSet),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['exercise', exerciseId]);
        navigate(`/exercise/edit/${exerciseId}?sessionId=${sessionId}`);
      },
    }
  );

  const updateExerciseMutation = useMutation(
    (exercise: Exercise) =>
      updateExerciseInSession(sessionId, exerciseId!, exercise),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['session', sessionId]);
        navigate(`/sessions/${sessionId}`);
      },
    }
  );

  const deleteExerciseMutation = useMutation(
    () => deleteExerciseFromSession(sessionId, exerciseId!),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['session', sessionId]);
        navigate(`/sessions/${sessionId}`);
      },
    }
  );

  const handleSubmit = () => {
    const exerciseData: Omit<Exercise, '_id'> = {
      name,
      videoUrl,
      description,
      tags: selectedTags,
      targetMuscles: selectedMuscles,
      difficulty,
      createdAt: new Date(),
      updatedAt: new Date(),
      repSets,
      duration: 0,
      type: 'strength' // Ajout de la propriété type requise
    };

    if (isEditMode) {
      updateExerciseMutation.mutate({ ...exerciseData, _id: exerciseId! });
    } else {
      createExerciseMutation.mutate(exerciseData as Exercise);
    }
  };

  const handleDuplicateRepSet = (repSet: RepSet) => {
    const newRepSet = { ...repSet, _id: undefined };
    createRepSetMutation.mutate(newRepSet);
  };

  const handleDelete = () => {
    deleteExerciseMutation.mutate();
  };

  if (isExerciseLoading || isMusclesLoading || isTagsLoading) {
    return <Loading />;
  }

  return (
    <div className={styles.container}>
      <div>
        <div className={styles.header}>
          <BiChevronLeft onClick={() => navigate(-1)} />
          <h2>{isEditMode ? "Modifier l'exercice" : 'Créer un exercice'}</h2>
        </div>
        <div className={styles.inputContainer}>
          <label htmlFor="name">Nom de l'exercice</label>
          <input
            id="name"
            placeholder="Tractions"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className={styles.inputContainer}>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            placeholder="Traction en pronation, mains placées sur la largeur des épaules"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className={styles.inputContainer}>
          <label htmlFor="videoUrl">Lien de la vidéo</label>
          <input
            id="videoUrl"
            placeholder="https://youtu.be/"
            type="text"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
          />
        </div>
        <div className={styles.inputContainer}>
          <label htmlFor="muscles">Muscles</label>
          <TagSelector
            availableTags={muscles.map((muscle: Muscle) => ({
              id: muscle._id,
              name: muscle.name,
            }))}
            selectedTags={selectedMuscles}
            onChange={setSelectedMuscles}
          />
        </div>
        <div className={styles.inputContainer}>
          <label htmlFor="tags">Tags</label>
          <TagSelector
            availableTags={tags.map((tag: Tag) => ({
              id: tag._id,
              name: tag.name,
            }))}
            selectedTags={selectedTags}
            onChange={setSelectedTags}
          />
        </div>
        <div className={styles.inputContainer}>
          <Difficulty difficulty={difficulty} setDifficulty={setDifficulty} />
        </div>
        <div className={styles.seriesContainer}>
          <h4>Séries</h4>
          <div className={styles.seriesList}>
            {repSets.map((repSet, index) => (
              <div
                key={repSet._id}
                className={`${styles.card} ${styles.series}`}
              >
                <div className={styles.setText}>
                  <span>Série {index + 1}</span>
                  <div className={styles.subText}>
                    <div className={styles.restTime}>
                      <GiWeight />
                      <small>
                        {repSet.repetitions} x {repSet.weight} kg
                      </small>
                    </div>
                    <div className={styles.restTime}>
                      <MdOutlineTimer />
                      <small>{repSet.restTime} sec</small>
                    </div>
                  </div>
                </div>
                <div className={styles.buttonsContainer}>
                  <button onClick={() => handleDuplicateRepSet(repSet)}>
                    Dupliquer
                  </button>
                  <button
                    onClick={() =>
                      navigate(
                        `/exercise/${exerciseId}/reps/${repSet._id}?sessionId=${sessionId}`
                      )
                    }
                  >
                    Modifier
                  </button>
                </div>
              </div>
            ))}
          </div>
          <br />
          {isEditMode && (
            <div className={styles.series}>
              <div
                className={styles.addSeries}
                onClick={() =>
                  navigate(
                    `/exercise/${exerciseId}/reps?sessionId=${sessionId}`
                  )
                }
              >
                <BiPlus className={styles.setIcon} />
                <span>Ajouter une série</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className={styles.buttonsContainer}>
        <button onClick={handleSubmit}>
          {isEditMode ? 'Sauvegarder' : "Créer l'exercice"}
        </button>
        {isEditMode && <button onClick={handleDelete}>Supprimer</button>}
      </div>
    </div>
  );
};

export default ExerciseForm;
