import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const AppStateHandler = () => {
  const location = useLocation();

  // Sauvegarder l'URL actuelle lorsque l'application est mise en arrière-plan
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        // L'application est mise en arrière-plan
        localStorage.setItem('lastPath', location.pathname + location.search);
        console.log('Application mise en arrière-plan, chemin sauvegardé:', location.pathname);
      }
      // Nous ne restaurons plus automatiquement le chemin lorsque l'application est remise au premier plan
      // Cela permet à l'utilisateur de naviguer normalement dans l'application
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [location.pathname, location.search]);

  return null;
};

export default AppStateHandler; 