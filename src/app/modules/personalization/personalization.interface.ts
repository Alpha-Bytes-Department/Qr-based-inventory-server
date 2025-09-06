import { Types } from 'mongoose';

export type IPersonalization = {
  userId: Types.ObjectId;
  name: string;
  email: string;
  category: Types.ObjectId;
  birthday?: Date;
};
