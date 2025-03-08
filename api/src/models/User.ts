import { Document, model, Schema } from 'mongoose';
import Program from './Program';

interface IWeightDetail {
  _id?: Schema.Types.ObjectId;
  weight: number;
  date: Date;
}

interface IMeasurementDetail {
  measurementType: string;
  value: number;
  date: Date;
}

interface IUser extends Document {
  _id: Schema.Types.ObjectId;
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  weightHistory: IWeightDetail[];
  measurementsHistory: IMeasurementDetail[];
  activeProgram: Schema.Types.ObjectId | typeof Program;
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
  createdAt: { type: Date, default: Date.now },
  weightHistory: [weightDetailSchema],
  measurementsHistory: [measurementDetailSchema],
  activeProgram: { type: Schema.Types.ObjectId, ref: 'Program' },
});

const User = model<IUser>('User', userSchema);

export default User;