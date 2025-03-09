const webpush = require('web-push');

// Génération des clés VAPID
const vapidKeys = webpush.generateVAPIDKeys();

console.log('Clés VAPID générées avec succès !');
console.log('\nAjoutez ces variables dans votre fichier .env.local :');
console.log('\nNEXT_PUBLIC_VAPID_PUBLIC_KEY=' + vapidKeys.publicKey);
console.log('VAPID_PRIVATE_KEY=' + vapidKeys.privateKey);
console.log('\nGardez la clé privée secrète et ne la partagez jamais !'); 