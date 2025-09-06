import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { IPersonalization } from './personalization.interface';
import { Personalization } from './personalization.model';

const createPersonalization = async (data: IPersonalization) => {
  const isExist = await Personalization.findOne({
    userId: data.userId,
  });
  if (isExist) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Personalization already exists'
    );
  }

  const personalization = Personalization.create(data);
  return personalization;
};

export const PersonalizationService = {
  createPersonalization,
};
