import mongoose from 'mongoose';
import User from '../../src/models/User';

describe('User Model', () => {
  it('should create a user with minimal required fields', async () => {
    const userData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    };

    const user = new User(userData);
    await user.save();

    const foundUser = await User.findById(user._id);
    expect(foundUser).not.toBeNull();
    expect(foundUser?.username).toBe('testuser');
    expect(foundUser?.email).toBe('test@example.com');
    expect(foundUser?.role).toBe('user'); // Default value
    expect(foundUser?.isActive).toBe(true); // Default value
    expect(foundUser?.deleted).toBe(false); // Default value
    expect(foundUser?.emailVerified).toBe(false); // Default value
    expect(foundUser?.connectedDevice.type).toBeNull(); // Default value
    expect(foundUser?.connectedDevice.enabled).toBe(false); // Default value
  });

  it('should create a user with weight history', async () => {
    const userData = {
      username: 'weightuser',
      email: 'weight@example.com',
      password: 'password123',
      weightHistory: [
        {
          weight: 75.5,
          date: new Date('2023-01-01')
        },
        {
          weight: 74.8,
          date: new Date('2023-01-08')
        }
      ]
    };

    const user = new User(userData);
    await user.save();

    const foundUser = await User.findById(user._id);
    expect(foundUser).not.toBeNull();
    expect(foundUser?.weightHistory).toHaveLength(2);
    expect(foundUser?.weightHistory[0].weight).toBe(75.5);
    expect(foundUser?.weightHistory[1].weight).toBe(74.8);
  });

  it('should create a user with measurement history', async () => {
    const userData = {
      username: 'measurementuser',
      email: 'measurement@example.com',
      password: 'password123',
      measurementsHistory: [
        {
          measurementType: 'biceps',
          value: 35.5,
          date: new Date('2023-01-01')
        },
        {
          measurementType: 'chest',
          value: 100.2,
          date: new Date('2023-01-01')
        }
      ]
    };

    const user = new User(userData);
    await user.save();

    const foundUser = await User.findById(user._id);
    expect(foundUser).not.toBeNull();
    expect(foundUser?.measurementsHistory).toHaveLength(2);
    expect(foundUser?.measurementsHistory[0].measurementType).toBe('biceps');
    expect(foundUser?.measurementsHistory[0].value).toBe(35.5);
    expect(foundUser?.measurementsHistory[1].measurementType).toBe('chest');
  });

  it('should create a user with connected device', async () => {
    const userData = {
      username: 'deviceuser',
      email: 'device@example.com',
      password: 'password123',
      connectedDevice: {
        type: 'apple-watch',
        enabled: true
      }
    };

    const user = new User(userData);
    await user.save();

    const foundUser = await User.findById(user._id);
    expect(foundUser).not.toBeNull();
    expect(foundUser?.connectedDevice.type).toBe('apple-watch');
    expect(foundUser?.connectedDevice.enabled).toBe(true);
  });

  it('should create a user with password reset token', async () => {
    const resetDate = new Date();
    resetDate.setDate(resetDate.getDate() + 1); // Set expiry to tomorrow

    const userData = {
      username: 'resetuser',
      email: 'reset@example.com',
      password: 'password123',
      resetPasswordToken: 'token123',
      resetPasswordExpires: resetDate
    };

    const user = new User(userData);
    await user.save();

    const foundUser = await User.findById(user._id);
    expect(foundUser).not.toBeNull();
    expect(foundUser?.resetPasswordToken).toBe('token123');
    expect(foundUser?.resetPasswordExpires?.getTime()).toBe(resetDate.getTime());
  });

  it('should create an admin user', async () => {
    const userData = {
      username: 'adminuser',
      email: 'admin@example.com',
      password: 'password123',
      role: 'admin'
    };

    const user = new User(userData);
    await user.save();

    const foundUser = await User.findById(user._id);
    expect(foundUser).not.toBeNull();
    expect(foundUser?.role).toBe('admin');
  });

  it('should reject user creation without required fields', async () => {
    const incompleteUser = new User({
      username: 'incomplete'
      // Missing email and password
    });
    
    await expect(incompleteUser.save()).rejects.toThrow();
  });

  it('should validate user role', async () => {
    const invalidUser = new User({
      username: 'invalidrole',
      email: 'invalid@example.com',
      password: 'password123',
      role: 'superuser' // Invalid role
    });
    
    await expect(invalidUser.save()).rejects.toThrow();
  });
}); 