import { useState, useEffect } from 'react';
import { isIOS } from '@/services/notificationService';
import styles from './IOSNotificationBanner.module.scss';

const IOSNotificationBanner = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Vérifier si l'appareil est iOS et si la bannière n'a pas été fermée précédemment
    const isDismissed = localStorage.getItem('iosNotificationBannerDismissed') === 'true';
    setShowBanner(isIOS() && !isDismissed);
  }, []);

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem('iosNotificationBannerDismissed', 'true');
  };

  if (!showBanner) {
    return null;
  }

  return (
    <div className={styles.banner}>
      <div className={styles.content}>
        <div className={styles.icon}>📱</div>
        <div className={styles.message}>
          <strong>Information iOS</strong>
          <p>
            Les notifications ne sont pas supportées nativement sur iOS. 
            Pour une meilleure expérience, ajoutez cette application à votre écran d'accueil 
            et gardez-la ouverte pour recevoir les alertes.
          </p>
        </div>
      </div>
      <button className={styles.closeButton} onClick={handleDismiss}>
        ×
      </button>
    </div>
  );
};

export default IOSNotificationBanner; 