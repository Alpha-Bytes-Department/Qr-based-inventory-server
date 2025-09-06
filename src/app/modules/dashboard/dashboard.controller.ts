import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { DashboardService } from './dashboard.service';

const getAllDashboardData = catchAsync(async (req, res) => {
  const result = await DashboardService.getAllDashboardData();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Dashboard data retrieved successfully',
    data: result,
  });
});

const getEarningChartData = catchAsync(async (req, res) => {
  const result = await DashboardService.getEarningChartData();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Dashboard earning data retrieved successfully',
    data: result,
  });
});

export const DashboardController = {
  getAllDashboardData,
  getEarningChartData,
};
