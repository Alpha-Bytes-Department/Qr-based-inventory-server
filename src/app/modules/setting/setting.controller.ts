import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { SettingService } from './setting.service';

const createSetting = catchAsync(async (req, res) => {
  const result = await SettingService.createSetting(req.params.type, req.body);
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Setting created successfully',
    data: result,
  });
});

const getSetting = catchAsync(async (req, res) => {
  const result = await SettingService.getSetting(req.params.type);
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Setting retrieved successfully',
    data: result,
  });
});

export const SettingController = {
  createSetting,
  getSetting,
};
