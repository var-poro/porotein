import { FC } from 'react';
import YouTube from 'react-youtube';
import styles from './YoutubeVideo.module.scss';
import getYoutubeVideoId from '@/utils/getYoutubeVideoId.tsx';

type Props = {
  youtubeUrl: string;
  onLoad: () => void;
};

const YoutubeVideo: FC<Props> = ({ youtubeUrl, onLoad }) => {
  const opts = {
    width: '100%',
    height: '100%',
    playerVars: {
      loop: 1,
      modestBranding: true,
      rel: 0,
    },
  };

  const videoId = getYoutubeVideoId(youtubeUrl);

  const handleReady = () => {
    onLoad();
  };

  return (
    <div className={styles.videoContainer}>
      {videoId ? (
        <YouTube
          className={styles.youtubeVideo}
          videoId={videoId}
          opts={opts}
          onReady={handleReady} // Ajout de l'événement onReady
        />
      ) : (
        <p>Invalid YouTube URL</p>
      )}
    </div>
  );
};

export default YoutubeVideo;
