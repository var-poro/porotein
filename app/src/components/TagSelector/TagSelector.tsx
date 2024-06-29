import styles from './TagSelector.module.scss';

interface Tag {
  id: string;
  name: string;
}

interface TagSelectorProps {
  availableTags: Tag[];
  selectedTags: string[];
  onChange: (tags: string[]) => void;
}

const TagSelector: React.FC<TagSelectorProps> = ({
  availableTags,
  selectedTags,
  onChange,
}) => {
  const toggleTag = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      console.log({ tagId });
      onChange(selectedTags.filter((t) => t !== tagId));
    } else {
      onChange([...selectedTags, tagId]);
    }
  };

  return (
    <div className={styles.tagSelector}>
      {availableTags.map((tag) => (
        <button
          key={tag.id}
          type="button"
          className={`${styles.tag} ${selectedTags.includes(tag.id) ? styles.selected : ''}`}
          onClick={() => toggleTag(tag.id)}
        >
          {tag.name}
        </button>
      ))}
    </div>
  );
};

export default TagSelector;
