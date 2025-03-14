import swaggerJSDoc from 'swagger-jsdoc';

const swaggerOptions: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Porotein',
      version: '1.0.0',
      description: 'API pour l\'application de suivi d\'entraînement Porotein',
      contact: {
        name: 'Équipe Porotein',
        url: 'https://porotein.fr',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: 'http://localhost:4000',
        description: 'Serveur de développement',
      },
      {
        url: 'https://api.porotein.fr',
        description: 'Serveur de production',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          required: ['username', 'email', 'password'],
          properties: {
            _id: {
              type: 'string',
              description: 'ID unique de l\'utilisateur',
            },
            username: {
              type: 'string',
              description: 'Nom d\'utilisateur',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Adresse email de l\'utilisateur',
            },
            password: {
              type: 'string',
              description: 'Mot de passe de l\'utilisateur (haché)',
              format: 'password',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Date de création du compte',
            },
            weightHistory: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/WeightDetail',
              },
              description: 'Historique des poids',
            },
            measurementsHistory: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/MeasurementDetail',
              },
              description: 'Historique des mesures',
            },
            activeProgram: {
              type: 'string',
              description: 'ID du programme actif',
            },
          },
        },
        WeightDetail: {
          type: 'object',
          required: ['weight', 'date'],
          properties: {
            _id: {
              type: 'string',
              description: 'ID unique de l\'entrée de poids',
            },
            weight: {
              type: 'number',
              description: 'Poids en kg',
            },
            date: {
              type: 'string',
              format: 'date-time',
              description: 'Date de l\'enregistrement',
            },
          },
        },
        MeasurementDetail: {
          type: 'object',
          required: ['measurementType', 'value', 'date'],
          properties: {
            measurementType: {
              type: 'string',
              description: 'Type de mesure (ex: tour de bras, tour de taille)',
            },
            value: {
              type: 'number',
              description: 'Valeur de la mesure en cm',
            },
            date: {
              type: 'string',
              format: 'date-time',
              description: 'Date de l\'enregistrement',
            },
          },
        },
        Program: {
          type: 'object',
          required: ['name', 'creator'],
          properties: {
            _id: {
              type: 'string',
              description: 'ID unique du programme',
            },
            name: {
              type: 'string',
              description: 'Nom du programme',
            },
            description: {
              type: 'string',
              description: 'Description du programme',
            },
            creator: {
              type: 'string',
              description: 'ID de l\'utilisateur créateur',
            },
            sessions: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: 'Liste des IDs de sessions associées',
            },
          },
        },
        Session: {
          type: 'object',
          required: ['name', 'creator'],
          properties: {
            _id: {
              type: 'string',
              description: 'ID unique de la session',
            },
            name: {
              type: 'string',
              description: 'Nom de la session',
            },
            description: {
              type: 'string',
              description: 'Description de la session',
            },
            exercises: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  exercise: {
                    type: 'string',
                    description: 'ID de l\'exercice',
                  },
                  sets: {
                    type: 'number',
                    description: 'Nombre de séries',
                  },
                  reps: {
                    type: 'number',
                    description: 'Nombre de répétitions',
                  },
                },
              },
              description: 'Liste des exercices de la session',
            },
            creator: {
              type: 'string',
              description: 'ID de l\'utilisateur créateur',
            },
          },
        },
        Exercise: {
          type: 'object',
          required: ['name', 'creator'],
          properties: {
            _id: {
              type: 'string',
              description: 'ID unique de l\'exercice',
            },
            name: {
              type: 'string',
              description: 'Nom de l\'exercice',
            },
            description: {
              type: 'string',
              description: 'Description de l\'exercice',
            },
            muscles: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: 'Liste des IDs des muscles ciblés',
            },
            tags: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: 'Liste des IDs des tags associés',
            },
            creator: {
              type: 'string',
              description: 'ID de l\'utilisateur créateur',
            },
          },
        },
        SavedSession: {
          type: 'object',
          required: ['session', 'user', 'date'],
          properties: {
            _id: {
              type: 'string',
              description: 'ID unique de la session enregistrée',
            },
            session: {
              type: 'string',
              description: 'ID de la session de référence',
            },
            date: {
              type: 'string',
              format: 'date-time',
              description: 'Date de la session',
            },
            exercises: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  exercise: {
                    type: 'string',
                    description: 'ID de l\'exercice',
                  },
                  sets: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        reps: {
                          type: 'number',
                          description: 'Nombre de répétitions',
                        },
                        weight: {
                          type: 'number',
                          description: 'Poids utilisé en kg',
                        },
                        completed: {
                          type: 'boolean',
                          description: 'Si la série a été complétée',
                        },
                      },
                    },
                    description: 'Détails des séries effectuées',
                  },
                },
              },
              description: 'Liste des exercices effectués',
            },
            user: {
              type: 'string',
              description: 'ID de l\'utilisateur',
            },
            duration: {
              type: 'number',
              description: 'Durée de la session en minutes',
            },
            notes: {
              type: 'string',
              description: 'Notes sur la session',
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.ts'], // Chemin vers les fichiers de routes
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

export default swaggerSpec; 