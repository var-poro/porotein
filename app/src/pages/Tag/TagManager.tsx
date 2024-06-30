import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import apiClient from '@/services/apiService';
import styles from './TagManager.module.scss';
import { BiChevronLeft } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';

const TagManager = () => {
  const [name, setName] = useState('');
  const [editingTag, setEditingTag] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const fetchTags = async () => {
    const { data } = await apiClient.get('/tags');
    return data;
  };

  const { data: tags, isLoading } = useQuery('tags', fetchTags);

  const createTagMutation = useMutation(
    (newTag: string) => apiClient.post('/tags', { name: newTag }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('tags');
        setName('');
      },
    }
  );

  const updateTagMutation = useMutation(
    ({ id, name }: { id: string; name: string }) =>
      apiClient.put(`/tags/${id}`, { name }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('tags');
        setName('');
        setEditingTag(null);
      },
    }
  );

  const deleteTagMutation = useMutation(
    (id: string) => apiClient.delete(`/tags/${id}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('tags');
      },
    }
  );

  const handleCreateOrUpdateTag = () => {
    if (editingTag) {
      updateTagMutation.mutate({ id: editingTag, name });
    } else {
      createTagMutation.mutate(name);
    }
  };

  const handleEdit = (tag: any) => {
    setName(tag.name);
    setEditingTag(tag._id);
  };

  const handleDelete = (id: string) => {
    deleteTagMutation.mutate(id);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <BiChevronLeft onClick={() => navigate(-1)} />
        <h2>Modifier les tags</h2>
      </div>
      <div className={styles.tagInputContainer}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nom"
        />
        <div className={styles.buttonsContainer}>
          <button onClick={handleCreateOrUpdateTag}>
            {editingTag ? 'Modifier' : 'Ajouter'}
          </button>
          {editingTag && (
            <button
              className={styles.delete}
              onClick={() => handleDelete(editingTag)}
            >
              Supprimer
            </button>
          )}
        </div>
      </div>
      <ul className={styles.tagsList}>
        {tags.map((tag: any) => (
          <li
            onClick={() => handleEdit(tag)}
            className={`${styles.tag} ${tag._id === editingTag ? styles.selected : ''}`}
            key={tag._id}
          >
            <span>{tag.name}</span>
          </li>
        ))}
        {tags.length > 0 && (
          <li
            onClick={() => {
              setName('');
              setEditingTag(null);
            }}
            className={`${styles.tag} ${!editingTag ? styles.selected : ''}`}
          >
            <span>Ajouter un tag</span>
          </li>
        )}
      </ul>
    </div>
  );
};

export default TagManager;
