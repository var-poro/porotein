# API Test Suite

This directory contains tests for the Porotein API, covering models, controllers, middleware, routes, and integration tests.

## Setup

Tests are using Jest with `mongodb-memory-server` to run with an in-memory MongoDB instance.

### Key files:
- `setup.ts`: Configures the in-memory MongoDB for all tests
- `mocks/auth.mock.ts`: Provides mock authentication functions for testing

## Test Structure

The test suite is organized as follows:

```
tests/
  ├── models/           # Tests for database models
  ├── controllers/      # Tests for API controller functions
  ├── middleware/       # Tests for middleware components
  ├── routes/           # Tests for API routes
  ├── integration/      # End-to-end integration tests
  ├── mocks/            # Mock implementations for tests
  └── setup.ts          # Test configuration
```

## Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## Current Coverage Status

As of the latest run, test coverage stands at:

- **Total**: ~43%
- **Models**: ~65% (Good coverage)
- **Controllers**: ~36% (Needs improvement)
- **Middleware**: ~96% (Excellent coverage)
- **Routes**: ~100% (Excellent coverage for implemented tests)

## Implementation Notes

### Models

Model tests are fairly complete, testing:
- Schema validation
- Default values
- Relationships between models

### Controllers

Controller tests are progressively being implemented:
- `authController`: Login, registration, email verification, magic links, etc.
- `userController`: CRUD operations, user management, weight history
- `tagController`: CRUD operations for tags
- `exerciseController`: Exercise management with cardio segments
- `savedExerciseController`: Saved exercise functionality with cardio segments
- `programController`: In progress - Program management with sessions
- `sessionController`: In progress - Session management with exercises
- `muscleController`: In progress - Muscle management

### Middleware

- `auth.ts`: Authentication and admin role verification

### Routes

Route tests are being implemented for:
- Exercise routes
- Saved exercise routes

### Integration

Integration tests cover end-to-end scenarios:
- Cardio exercise creation and management
- Saved exercise functionality

## Challenges and Solutions

### TypeScript and Jest Mocking Issues

We're encountering TypeScript compatibility issues with Jest mocks when using ES modules and MongoDB models. The main challenges are:

1. **Type compatibility**: TypeScript treats Mongoose model types strictly, making it difficult to mock them with Jest.
2. **ES modules**: TypeScript's ES module handling conflicts with Jest's CommonJS-based mocking system.
3. **Method chaining**: Mongoose's fluent API with method chaining (e.g., `Model.find().populate()`) is difficult to mock properly.

### Potential Solutions

1. **Use manual mock files**: Create dedicated mock files in a `__mocks__` directory that Jest will use automatically.
2. **Use `ts-jest/utils` transformers**: Use custom transformers to help with TypeScript compatibility.
3. **Dependency injection**: Refactor code to use dependency injection for easier mocking.
4. **Use jest.spyOn**: Instead of mocking whole modules, spy on specific methods.

### Current Mocking Strategy

For controller tests, we are shifting to a more TypeScript-compatible approach:

```typescript
// Import actual model (not mocked yet)
import OriginalModel from '../../src/models/Model';
 
// Create direct mock using jest.spyOn
jest.mock('../../src/models/Model');
const Model = OriginalModel as jest.MockedObject<typeof OriginalModel>;

// Mock specific methods for each test
const mockFindById = jest.fn().mockResolvedValue({...});
(Model.findById as jest.Mock) = mockFindById;

// For chained methods
const mockFind = jest.fn().mockReturnThis();
const mockPopulate = jest.fn().mockResolvedValue([...]);
(Model.find as jest.Mock) = mockFind;
mockFind.populate = mockPopulate;
```

## Known Issues

1. **Mongoose Schema Issues**: There are errors related to Mongoose module versions causing schema issues in integration tests.
2. **Controller Test Mocking**: Some controller tests have mocking issues that need to be resolved.
3. **Timeouts**: Integration tests experience timeouts and need optimization.
4. **TypeScript Compatibility**: TypeScript strict typing causes issues when mocking Mongoose models.

## Next Steps

1. Standardize the mocking approach across all controller tests
2. Complete tests for remaining controllers prioritizing straightforward functionality
3. Address the Mongoose schema issues in integration tests
4. Clean up tests and improve error handling in test setup
5. Increase overall test coverage to 70%+
6. Add tests for error cases and edge conditions

## Contributing to Tests

When adding new tests:

1. Follow the existing pattern for your test type (model, controller, etc.)
2. Use the mocks provided in the `mocks` directory
3. Ensure your tests are isolated (don't depend on other tests)
4. Mock external dependencies appropriately
5. Include both success and failure cases 