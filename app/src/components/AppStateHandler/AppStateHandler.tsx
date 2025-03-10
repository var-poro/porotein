import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const AppStateHandler = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Sauvegarder l'URL actuelle lorsque l'application est mise en arrière-plan
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        // L'application est mise en arrière-plan
        localStorage.setItem('lastPath', location.pathname + location.search);
        console.log('Application mise en arrière-plan, chemin sauvegardé:', location.pathname);
      } else if (document.visibilityState === 'visible') {
        // L'application est remise au premier plan
        const lastPath = localStorage.getItem('lastPath');
        if (lastPath && lastPath !== location.pathname + location.search) {
          console.log('Application remise au premier plan, restauration du chemin:', lastPath);
          navigate(lastPath);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Vérifier s'il y a un chemin sauvegardé au chargement initial
    const lastPath = localStorage.getItem('lastPath');
    if (lastPath && lastPath !== location.pathname + location.search) {
      console.log('Restauration du chemin au chargement:', lastPath);
      navigate(lastPath);
    }

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [location.pathname, location.search, navigate]);

  return null;
};

export default AppStateHandler; 