import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer: MongoMemoryServer;

// Augmenter la durée du timeout pour les tests
jest.setTimeout(30000);

// Mock du service email pour éviter les vraies connexions SMTP dans les tests
jest.mock('../src/config/email', () => ({
  transporter: {
    sendMail: jest.fn().mockResolvedValue({ messageId: 'test-message-id' }),
    verify: jest.fn().mockImplementation((callback) => {
      if (callback) callback(null, true);
    })
  },
  getRegistrationEmailTemplate: jest.fn().mockReturnValue({
    subject: 'Test Registration Email',
    html: '<p>Test email</p>',
    text: 'Test email'
  }),
  getPasswordResetEmailTemplate: jest.fn().mockReturnValue({
    subject: 'Test Password Reset Email',
    html: '<p>Test email</p>',
    text: 'Test email'
  }),
  getMagicLinkEmailTemplate: jest.fn().mockReturnValue({
    subject: 'Test Magic Link Email',
    html: '<p>Test email</p>',
    text: 'Test email'
  })
}));

// Connecter à la base de données MongoDB en mémoire avant tous les tests
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

// Nettoyer et fermer la connexion après tous les tests
afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
});

// Nettoyer les collections après chaque test
afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
}); 