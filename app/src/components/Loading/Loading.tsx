import Lottie from 'react-lottie';
import animationData from '@/assets/loading.json';
import styles from './Loading.module.scss';

const Loading = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return (
    <div className={styles.loadingContainer}>
      <Lottie options={defaultOptions} height={100} width={100} />
    </div>
  );
};

export default Loading;
