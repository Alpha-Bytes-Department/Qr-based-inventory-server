import { model, Schema } from 'mongoose';
import { IPersonalization } from './personalization.interface';

const personalizationSchema = new Schema<IPersonalization>(
  {
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: false,
    },
    email: {
      type: String,
      required: false,
    },
    name: {
      type: String,
      required: false,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    birthday: {
      type: Date,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Personalization = model<IPersonalization>(
  'Personalization',
  personalizationSchema
);
