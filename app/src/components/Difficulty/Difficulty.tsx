import styles from './Difficulty.module.scss';
import ReactSlider from 'react-slider';

type Props = {
  difficulty: string | undefined;
  setDifficulty: (difficulty: string) => void;
};

// @Todo: avoir une animation pour la difficulté: poids qui s'empilent, emoji en 3d qui tourne pour switch et qui serait animé...
const difficultyEmoji = ['😁', '😬', '🥲', '😮‍💨', '🥵'];

const Difficulty: React.FC<Props> = ({ difficulty = '1', setDifficulty }) => {
  console.log(difficulty);
  return (
    <div>
      <div>
        <label htmlFor={'difficulty'}>Difficulté</label>{' '}
        {difficultyEmoji[parseInt(difficulty) - 1]}
      </div>

      <ReactSlider
        className={styles.slider}
        thumbClassName={styles.thumb}
        trackClassName={styles.track}
        min={1}
        max={5}
        step={1}
        value={parseInt(difficulty)}
        onChange={(value) => setDifficulty(value.toString())}
        renderThumb={(props) => <div {...props}></div>}
      />
    </div>
  );
};

export default Difficulty;
