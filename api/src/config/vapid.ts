import webpush from 'web-push';

// Vérifier et configurer les clés VAPID
export const configureVapid = () => {
    console.log('Début de la configuration VAPID');
    
    const { VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_EMAIL } = process.env;
    
    console.log('Variables d\'environnement VAPID :', {
        publicKeyExists: !!VAPID_PUBLIC_KEY,
        privateKeyExists: !!VAPID_PRIVATE_KEY,
        emailExists: !!VAPID_EMAIL
    });

    if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY || !VAPID_EMAIL) {
        console.error('Les clés VAPID ou l\'email manquants :', {
            publicKey: !VAPID_PUBLIC_KEY ? 'manquant' : 'présent',
            privateKey: !VAPID_PRIVATE_KEY ? 'manquant' : 'présent',
            email: !VAPID_EMAIL ? 'manquant' : 'présent'
        });
        process.exit(1);
    }

    try {
        console.log('Tentative de configuration des détails VAPID');
        webpush.setVapidDetails(
            `mailto:${VAPID_EMAIL}`,
            VAPID_PUBLIC_KEY,
            VAPID_PRIVATE_KEY
        );
        console.log('Configuration VAPID réussie');
    } catch (error) {
        console.error('Erreur détaillée lors de la configuration VAPID:', {
            error: error instanceof Error ? error.message : error,
            stack: error instanceof Error ? error.stack : undefined
        });
        process.exit(1);
    }
}; 