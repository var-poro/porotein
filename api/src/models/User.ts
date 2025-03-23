import { Document, model, Schema } from 'mongoose';
import Program from './Program';

interface IWeightDetail {
  _id?: Schema.Types.ObjectId;
  weight: number;
  date: Date;
}

interface IMeasurementDetail {
  _id?: Schema.Types.ObjectId;
  measurementType: string;
  value: number;
  date: Date;
}

interface IUser extends Document {
  _id: Schema.Types.ObjectId;
  username: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  createdAt: Date;
  weightHistory: IWeightDetail[];
  measurementsHistory: IMeasurementDetail[];
  activeProgram: Schema.Types.ObjectId | typeof Program;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  emailVerificationToken?: string;
  emailVerified: boolean;
  lastActivationEmailSent: Date;
  lastPasswordResetEmailSent: Date;
  magicLinkToken?: string;
  magicLinkExpires?: Date;
  isActive: boolean;
  deleted?: boolean;
}

const weightDetailSchema = new Schema<IWeightDetail>({
  weight: { type: Number, required: true },
  date: { type: Date, required: true },
});

const measurementDetailSchema = new Schema<IMeasurementDetail>({
  measurementType: { type: String, required: true },
  value: { type: Number, required: true },
  date: { type: Date, required: true },
});

const userSchema = new Schema<IUser>({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  createdAt: { type: Date, default: Date.now },
  weightHistory: [weightDetailSchema],
  measurementsHistory: [measurementDetailSchema],
  activeProgram: { type: Schema.Types.ObjectId, ref: 'Program' },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  emailVerificationToken: { type: String },
  emailVerified: { type: Boolean, default: false },
  lastActivationEmailSent: { type: Date },
  lastPasswordResetEmailSent: { type: Date },
  magicLinkToken: {
    type: String,
    required: false
  },
  magicLinkExpires: {
    type: Date,
    required: false
  },
  isActive: { type: Boolean, default: true },
  deleted: { type: Boolean, default: false }
});

const User = model<IUser>('User', userSchema);

export default User;