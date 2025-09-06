import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { PersonalizationService } from './personalization.service';

const createPersonalization = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const personalizationData = { ...req.body, userId };

  const result = await PersonalizationService.createPersonalization(
    personalizationData
  );

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Personalization created successfully',
    data: result,
  });
});

export const PersonalizationController = {
  createPersonalization,
};
